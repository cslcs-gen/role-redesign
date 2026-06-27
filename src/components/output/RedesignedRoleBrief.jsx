import Card from '../common/Card.jsx';

export default function RedesignedRoleBrief({ output }) {
  return (
    <Card>
      <h3>{output.suggestedTitle}</h3>
      <p>{output.superpower}</p>
      <div className="brief-grid">
        <div>
          <h4>Suggested AI tools</h4>
          <ul className="plain-list">
            {output.toolSuggestions.map((tool) => (
              <li key={tool}>{tool}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Upskilling priorities</h4>
          <ul className="plain-list">
            {output.upskilling.map((item) => (
              <li key={item.skill}>{item.skill} · {item.effort} · {item.direction}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="proposal-block">
        <h4>New role proposals</h4>
        <ul className="plain-list">
          {output.newRoleProposals.map((proposal) => (
            <li key={proposal.title}>
              <strong>{proposal.title}:</strong> {proposal.description}
            </li>
          ))}
        </ul>
      </div>
      {output.citations && output.citations.length > 0 && (
        <div className="citations-block">
          <p className="eyebrow">References</p>
          <ul className="citations-list">
            {output.citations.map((c) => (
              <li key={c.source}>{c.source} ({c.section})</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
