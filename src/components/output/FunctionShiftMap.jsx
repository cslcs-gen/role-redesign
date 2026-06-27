import Card from '../common/Card.jsx';

function Column({ title, items }) {
  return (
    <div>
      <h4>{title}</h4>
      <ul className="plain-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default function FunctionShiftMap({ movesToAi, remainsHuman, newFunctions }) {
  return (
    <Card>
      <h3>Function shift map</h3>
      <div className="shift-grid">
        <Column title="Moves to AI" items={movesToAi} />
        <Column title="Remains human" items={remainsHuman} />
        <Column title="New functions" items={newFunctions} />
      </div>
    </Card>
  );
}
