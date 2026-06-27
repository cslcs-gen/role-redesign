export default function StepManagerInput({ value, onChange }) {
  return (
    <div className="form-grid">
      <label className="field">
        <span>Team structure</span>
        <textarea rows="4" value={value.teamStructure} onChange={(event) => onChange('teamStructure', event.target.value)} />
      </label>
      <label className="field">
        <span>Key outcomes expected</span>
        <textarea rows="4" value={value.keyOutcomes} onChange={(event) => onChange('keyOutcomes', event.target.value)} />
      </label>
      <label className="field">
        <span>Strategic priorities</span>
        <textarea rows="4" value={value.strategicPriorities} onChange={(event) => onChange('strategicPriorities', event.target.value)} />
      </label>
    </div>
  );
}
