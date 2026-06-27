export default function StepRoleContext({ value, onChange }) {
  return (
    <div className="form-grid">
      <label className="field">
        <span>Role title</span>
        <input value={value.roleTitle} onChange={(event) => onChange('roleTitle', event.target.value)} />
      </label>
      <label className="field">
        <span>Seniority level</span>
        <select value={value.seniorityLevel} onChange={(event) => onChange('seniorityLevel', event.target.value)}>
          <option value="">Select level</option>
          <option value="Junior">Junior</option>
          <option value="Mid">Mid</option>
          <option value="Senior">Senior</option>
          <option value="Lead">Lead</option>
          <option value="Director">Director</option>
        </select>
      </label>
    </div>
  );
}
