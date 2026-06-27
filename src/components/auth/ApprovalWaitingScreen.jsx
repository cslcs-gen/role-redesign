import Card from '../common/Card.jsx';

export default function ApprovalWaitingScreen() {
  return (
    <Card>
      <h2>Approval request sent</h2>
      <p>Please wait while the request is reviewed in Telegram.</p>
      <div className="status-pill pending">Waiting for /approve_sessionId</div>
    </Card>
  );
}
