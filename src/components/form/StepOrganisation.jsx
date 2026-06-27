export default function StepOrganisation({ value, onChange }) {
  return (
    <div className="form-grid">
      <label className="field">
        <span>Organisation name</span>
        <input value={value.organisationName} onChange={(event) => onChange('organisationName', event.target.value)} />
      </label>
      <label className="field">
        <span>Sector</span>
        <input value={value.sector} onChange={(event) => onChange('sector', event.target.value)} />
      </label>
      <label className="field">
        <span>Department</span>
        <input value={value.department} onChange={(event) => onChange('department', event.target.value)} />
      </label>
    </div>
  );
}
