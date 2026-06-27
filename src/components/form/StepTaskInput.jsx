import Button from '../common/Button.jsx';
import { downloadExcelTemplate } from '../../lib/excelTemplate.js';

export default function StepTaskInput({ pastedTasks, onPasteChange, onFileChange, tasks }) {
  return (
    <div className="form-grid">
      <div className="card inline-card">
        <h4>Excel template</h4>
        <p>Download the template, collect input from staff and line managers, then upload the completed file.</p>
        <Button type="button" variant="secondary" onClick={downloadExcelTemplate}>Download Excel template</Button>
      </div>
      <label className="field">
        <span>Upload completed Excel file</span>
        <input type="file" accept=".xlsx" onChange={(event) => onFileChange(event.target.files?.[0] ?? null)} />
      </label>
      <label className="field">
        <span>Or paste task list</span>
        <textarea rows="8" value={pastedTasks} onChange={(event) => onPasteChange(event.target.value)} placeholder="One task per line" />
      </label>
      <div className="card inline-card">
        <h4>Detected tasks</h4>
        <p>{tasks.length} tasks captured</p>
        <ul className="plain-list">
          {tasks.map((task) => (
            <li key={task.id}>{task.task}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
