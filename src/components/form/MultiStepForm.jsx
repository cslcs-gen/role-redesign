import { useMemo, useState } from 'react';
import Button from '../common/Button.jsx';
import Card from '../common/Card.jsx';
import StepOrganisation from './StepOrganisation.jsx';
import StepRoleContext from './StepRoleContext.jsx';
import StepManagerInput from './StepManagerInput.jsx';
import StepTaskInput from './StepTaskInput.jsx';
import StepReflection from './StepReflection.jsx';
import { parseExcelFile, parseTaskText } from '../../lib/excelParser.js';

const steps = [
  'Organisation context',
  'Role context',
  'Line manager input',
  'Task input',
  'Staff reflection'
];

const initialState = {
  organisationName: '',
  sector: '',
  department: '',
  roleTitle: '',
  seniorityLevel: '',
  teamStructure: '',
  keyOutcomes: '',
  strategicPriorities: '',
  tasks: []
};

export default function MultiStepForm({ onSubmit, loading }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [formState, setFormState] = useState(initialState);
  const [pastedTasks, setPastedTasks] = useState('');
  const [error, setError] = useState('');

  const canGoNext = useMemo(() => {
    if (stepIndex === 0) {
      return formState.organisationName && formState.sector && formState.department;
    }
    if (stepIndex === 1) {
      return formState.roleTitle && formState.seniorityLevel;
    }
    if (stepIndex === 2) {
      return formState.teamStructure || formState.keyOutcomes || formState.strategicPriorities;
    }
    if (stepIndex === 3) {
      return formState.tasks.length >= 5;
    }
    return true;
  }, [formState, stepIndex]);

  const updateField = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }));
  };

  const handlePasteChange = (value) => {
    setPastedTasks(value);
    const parsedTasks = parseTaskText(value);
    setFormState((current) => ({ ...current, tasks: parsedTasks }));
  };

  const handleFileChange = async (file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setError('Excel file must be under 2MB.');
      return;
    }
    try {
      const parsedTasks = await parseExcelFile(file);
      setError('');
      setFormState((current) => ({ ...current, tasks: parsedTasks }));
    } catch (parseError) {
      setError('Could not parse the Excel file.');
    }
  };

  const updateReflection = (taskId, reflection) => {
    setFormState((current) => ({
      ...current,
      tasks: current.tasks.map((task) => (task.id === taskId ? { ...task, reflection } : task))
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formState);
  };

  return (
    <Card>
      <h2>Analyse one role</h2>
      <p>Complete the five-step input flow, then generate a full AI workforce impact report for a single role.</p>
      <div className="stepper">
        {steps.map((step, index) => (
          <div key={step} className={`step-chip ${index === stepIndex ? 'active' : ''}`}>{index + 1}. {step}</div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        {stepIndex === 0 && <StepOrganisation value={formState} onChange={updateField} />}
        {stepIndex === 1 && <StepRoleContext value={formState} onChange={updateField} />}
        {stepIndex === 2 && <StepManagerInput value={formState} onChange={updateField} />}
        {stepIndex === 3 && (
          <StepTaskInput
            pastedTasks={pastedTasks}
            onPasteChange={handlePasteChange}
            onFileChange={handleFileChange}
            tasks={formState.tasks}
          />
        )}
        {stepIndex === 4 && <StepReflection tasks={formState.tasks} onReflectionChange={updateReflection} />}
        {error && <p className="error-text">{error}</p>}
        <div className="actions-row">
          <Button type="button" variant="secondary" onClick={() => setStepIndex((current) => Math.max(0, current - 1))} disabled={stepIndex === 0}>
            Back
          </Button>
          {stepIndex < steps.length - 1 ? (
            <Button type="button" onClick={() => setStepIndex((current) => current + 1)} disabled={!canGoNext}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={loading}>
              {loading ? 'Generating…' : 'Generate role redesign'}
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}
