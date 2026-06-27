import { useState } from 'react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';

export default function ShareCodeGate({ onUnlockRequest, error, loading }) {
  const [code, setCode] = useState('');

  return (
    <Card>
      <h2>Secure access</h2>
      <p>Enter the share code to request access. A Telegram approval request is then sent for final sign-off.</p>
      <label className="field">
        <span>Share code</span>
        <input value={code} onChange={(event) => setCode(event.target.value)} placeholder="Enter share code" />
      </label>
      {error && <p className="error-text">{error}</p>}
      <Button onClick={() => onUnlockRequest(code)} disabled={!code.trim() || loading}>
        {loading ? 'Requesting…' : 'Request access'}
      </Button>
    </Card>
  );
}
