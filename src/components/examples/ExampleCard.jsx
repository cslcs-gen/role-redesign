import Card from '../common/Card.jsx';
import Button from '../common/Button.jsx';

export default function ExampleCard({ role, onSelect }) {
  return (
    <Card className="example-card">
      <p className="tag">{role.sector}</p>
      <h3>{role.title}</h3>
      <p>{role.summary}</p>
      <Button variant="secondary" onClick={() => onSelect(role.id)}>Preview example</Button>
    </Card>
  );
}
