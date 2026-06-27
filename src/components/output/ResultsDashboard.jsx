import RadarCategoryChart from './RadarCategoryChart.jsx';
import ImpactSplitBarChart from './ImpactSplitBarChart.jsx';
import FunctionShiftMap from './FunctionShiftMap.jsx';
import RedesignedRoleBrief from './RedesignedRoleBrief.jsx';
import TaskScoreTable from './TaskScoreTable.jsx';

export default function ResultsDashboard({ role, output }) {
  return (
    <section className="results-stack">
      <div className="section-heading">
        <h2>{role.title}</h2>
        <p>{role.summary}</p>
      </div>
      <TaskScoreTable items={output.taskScores} citations={output.citations} />
      <RadarCategoryChart data={output.categories} />
      <ImpactSplitBarChart data={output.split} />
      <FunctionShiftMap
        movesToAi={output.movesToAi}
        remainsHuman={output.remainsHuman}
        newFunctions={output.newFunctions}
      />
      <RedesignedRoleBrief output={output} />
    </section>
  );
}
