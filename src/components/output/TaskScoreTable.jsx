import Card from '../common/Card.jsx';

function scoreClass(score) {
  if (score >= 70) return 'score-high';
  if (score >= 31) return 'score-medium';
  return 'score-low';
}

export default function TaskScoreTable({ items, citations }) {
  return (
    <Card>
      <h3>Task displacement scoring</h3>
      <div className="task-score-list">
        {items.map((item) => (
          <article key={item.task} className="task-score-item">
            <div className="task-score-head">
              <h4>{item.task}</h4>
              <div className={`score-pill ${scoreClass(item.score)}`}>
                {item.score} · {item.classification}
              </div>
            </div>
            <p>{item.explanation}</p>
          </article>
        ))}
      </div>
      {citations && citations.length > 0 && (
        <div className="citations-block">
          <p className="eyebrow">References</p>
          <ul className="citations-list">
            {citations.map((c) => (
              <li key={c.source}>{c.source} ({c.section})</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
