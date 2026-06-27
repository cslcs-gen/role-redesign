import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from 'recharts';
import Card from '../common/Card.jsx';

export default function RadarCategoryChart({ data }) {
  return (
    <Card>
      <h3>Function shift radar</h3>
      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={320}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="category" />
            <Radar dataKey="value" stroke="#6d5efc" fill="#6d5efc" fillOpacity={0.5} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
