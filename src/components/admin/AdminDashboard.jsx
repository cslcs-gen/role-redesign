import { useEffect, useState } from 'react';
import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';
import { adminLogin, loadAdminConfig, saveAdminConfig } from '../../lib/apiClient.js';

export default function AdminDashboard() {
  const [adminCode, setAdminCode] = useState('');
  const [adminToken, setAdminToken] = useState('');
  const [config, setConfig] = useState({
    shareCode: '',
    telegramBotToken: '',
    telegramChatId: '',
    accessRequests: []
  });
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (!adminToken) return;
    loadAdminConfig(adminToken)
      .then((result) => setConfig(result))
      .catch((loadError) => setError(loadError.message));
  }, [adminToken]);

  const handleLogin = async () => {
    try {
      setError('');
      const result = await adminLogin(adminCode);
      setAdminToken(result.adminToken);
    } catch (loginError) {
      setError(loginError.message);
    }
  };

  const handleSave = async () => {
    try {
      setError('');
      await saveAdminConfig(adminToken, config);
      setStatus('Config saved.');
    } catch (saveError) {
      setError(saveError.message);
    }
  };

  if (!adminToken) {
    return (
      <Card>
        <h2>Admin access</h2>
        <label className="field">
          <span>Admin code</span>
          <input type="password" value={adminCode} onChange={(event) => setAdminCode(event.target.value)} />
        </label>
        {error && <p className="error-text">{error}</p>}
        <Button onClick={handleLogin} disabled={!adminCode}>Unlock admin</Button>
      </Card>
    );
  }

  return (
    <section className="results-stack">
      <Card>
        <h2>Admin config</h2>
        <p>Update the share code and Telegram delivery settings without redeploying.</p>
        <div className="admin-grid">
          <label className="field">
            <span>Share code</span>
            <input value={config.shareCode} onChange={(event) => setConfig((current) => ({ ...current, shareCode: event.target.value }))} />
          </label>
          <label className="field">
            <span>Telegram Bot Token</span>
            <input value={config.telegramBotToken} onChange={(event) => setConfig((current) => ({ ...current, telegramBotToken: event.target.value }))} />
          </label>
          <label className="field">
            <span>Telegram Chat ID</span>
            <input value={config.telegramChatId} onChange={(event) => setConfig((current) => ({ ...current, telegramChatId: event.target.value }))} />
          </label>
        </div>
        {error && <p className="error-text">{error}</p>}
        {status && <p className="success-text">{status}</p>}
        <Button onClick={handleSave}>Save config</Button>
      </Card>
      <Card>
        <h3>Recent access requests</h3>
        <ul className="plain-list">
          {config.accessRequests?.map((entry) => (
            <li key={`${entry.timestamp}-${entry.sessionId}`}>{entry.timestamp} · {entry.sessionId} · {entry.status}</li>
          ))}
        </ul>
      </Card>
    </section>
  );
}
