const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers ?? {})
    },
    ...options
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

export function requestAccess(shareCode) {
  return request('/api/auth/request', {
    method: 'POST',
    body: JSON.stringify({ shareCode })
  });
}

export function checkApproval(sessionId) {
  return request(`/api/auth/status?sessionId=${encodeURIComponent(sessionId)}`);
}

export function analyseRole(payload) {
  return request('/api/analyse', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function adminLogin(adminCode) {
  return request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify({ adminCode })
  });
}

export function loadAdminConfig(adminToken) {
  return request('/api/admin/config', {
    headers: {
      'x-admin-token': adminToken
    }
  });
}

export function saveAdminConfig(adminToken, config) {
  return request('/api/admin/config', {
    method: 'POST',
    headers: {
      'x-admin-token': adminToken
    },
    body: JSON.stringify(config)
  });
}
