const defaultCorsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,x-admin-token'
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...defaultCorsHeaders
    }
  });
}

function makeId(prefix = 'session') {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

async function getConfig(env) {
  const stored = await env.ROLE_REDESIGN_KV.get('config', 'json');
  return {
    shareCode: stored?.shareCode || env.CF_SHARE_CODE,
    telegramBotToken: stored?.telegramBotToken || env.TELEGRAM_BOT_TOKEN,
    telegramChatId: stored?.telegramChatId || env.TELEGRAM_CHAT_ID
  };
}

async function logAccessRequest(env, entry) {
  const current = (await env.ROLE_REDESIGN_KV.get('access_logs', 'json')) || [];
  const next = [entry, ...current].slice(0, 10);
  await env.ROLE_REDESIGN_KV.put('access_logs', JSON.stringify(next));
}

async function sendTelegramApproval(config, sessionId) {
  if (!config.telegramBotToken || !config.telegramChatId) {
    return;
  }

  const text = [
    '🔐 RoleRedesign access request',
    `Time: ${new Date().toISOString()}`,
    `Session: ${sessionId}`,
    `Approve: /approve_${sessionId}`,
    `Deny: /deny_${sessionId}`
  ].join('\n');

  await fetch(`https://api.telegram.org/bot${config.telegramBotToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: config.telegramChatId,
      text
    })
  });
}

async function handleAuthRequest(request, env) {
  const body = await request.json();
  const config = await getConfig(env);

  if (body.shareCode !== config.shareCode) {
    return json({ error: 'Invalid share code' }, 401);
  }

  const sessionId = makeId();
  await env.ROLE_REDESIGN_KV.put(`session:${sessionId}`, JSON.stringify({ status: 'pending' }), {
    expirationTtl: 60 * 60 * 4
  });
  await logAccessRequest(env, { sessionId, status: 'pending', timestamp: new Date().toISOString() });
  await sendTelegramApproval(config, sessionId);

  return json({ sessionId, status: 'pending' });
}

async function handleAuthStatus(url, env) {
  const sessionId = url.searchParams.get('sessionId');
  if (!sessionId) {
    return json({ error: 'Missing sessionId' }, 400);
  }

  const record = await env.ROLE_REDESIGN_KV.get(`session:${sessionId}`, 'json');
  return json({ status: record?.status || 'pending' });
}

async function handleAdminLogin(request, env) {
  const body = await request.json();
  if (body.adminCode !== env.CF_ADMIN_CODE) {
    return json({ error: 'Invalid admin code' }, 401);
  }
  return json({ adminToken: env.CF_ADMIN_CODE });
}

async function handleGetAdminConfig(request, env) {
  if (request.headers.get('x-admin-token') !== env.CF_ADMIN_CODE) {
    return json({ error: 'Forbidden' }, 403);
  }

  const config = await getConfig(env);
  const accessRequests = (await env.ROLE_REDESIGN_KV.get('access_logs', 'json')) || [];
  return json({ ...config, accessRequests });
}

async function handleSaveAdminConfig(request, env) {
  if (request.headers.get('x-admin-token') !== env.CF_ADMIN_CODE) {
    return json({ error: 'Forbidden' }, 403);
  }

  const body = await request.json();
  const nextConfig = {
    shareCode: body.shareCode,
    telegramBotToken: body.telegramBotToken,
    telegramChatId: body.telegramChatId
  };
  await env.ROLE_REDESIGN_KV.put('config', JSON.stringify(nextConfig));
  return json({ ok: true });
}

async function handleTelegramWebhook(request, env) {
  const payload = await request.json();
  const text = payload?.message?.text || '';
  const approveMatch = text.match(/^\/approve_(session_[a-z0-9]+)$/i);
  const denyMatch = text.match(/^\/deny_(session_[a-z0-9]+)$/i);

  const sessionId = approveMatch?.[1] || denyMatch?.[1];
  if (!sessionId) {
    return json({ ok: true });
  }

  const status = approveMatch ? 'approved' : 'denied';
  await env.ROLE_REDESIGN_KV.put(`session:${sessionId}`, JSON.stringify({ status }), {
    expirationTtl: 60 * 60 * 4
  });
  await logAccessRequest(env, { sessionId, status, timestamp: new Date().toISOString() });

  return json({ ok: true });
}

async function handleAnalyse(request, env) {
  const body = await request.json();

  const prompt = `You are analysing a workforce role for AI redesign. Return strict JSON with keys: suggestedTitle, superpower, categories, split, taskScores, movesToAi, remainsHuman, newFunctions, toolSuggestions, newRoleProposals, upskilling. Role input: ${JSON.stringify(body)}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2500,
      messages: [{ role: 'user', content: prompt }]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    return json({ error: errorText || 'Analysis failed' }, 500);
  }

  const result = await response.json();
  const text = result?.content?.[0]?.text || '{}';

  try {
    return json(JSON.parse(text));
  } catch {
    return json({ raw: text }, 200);
  }
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: defaultCorsHeaders });
    }

    const url = new URL(request.url);

    if (request.method === 'POST' && url.pathname === '/api/auth/request') {
      return handleAuthRequest(request, env);
    }
    if (request.method === 'GET' && url.pathname === '/api/auth/status') {
      return handleAuthStatus(url, env);
    }
    if (request.method === 'POST' && url.pathname === '/api/admin/login') {
      return handleAdminLogin(request, env);
    }
    if (request.method === 'GET' && url.pathname === '/api/admin/config') {
      return handleGetAdminConfig(request, env);
    }
    if (request.method === 'POST' && url.pathname === '/api/admin/config') {
      return handleSaveAdminConfig(request, env);
    }
    if (request.method === 'POST' && url.pathname === '/api/telegram/webhook') {
      return handleTelegramWebhook(request, env);
    }
    if (request.method === 'POST' && url.pathname === '/api/analyse') {
      return handleAnalyse(request, env);
    }

    return json({ error: 'Not found' }, 404);
  }
};
