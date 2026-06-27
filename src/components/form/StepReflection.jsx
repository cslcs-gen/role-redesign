export default function StepReflection({ tasks, onReflectionChange }) {
  return (
    <div className="form-grid">
      {tasks.map((task) => (
        <label className="field" key={task.id}>
          <span>{task.task}</span>
          <textarea
            rows="3"
            value={task.reflection}
            onChange={(event) => onReflectionChange(task.id, event.target.value)}
            placeholder="If AI handled this task, I could instead focus on…"
          />
        </label>
      ))}
    </div>
  );
}
