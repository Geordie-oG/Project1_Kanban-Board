import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getPerformanceChartData } from '../../utils/taskCalculations.js'
import ChartEmptyState from './ChartEmptyState.jsx'

const COLORS = ['#4b9b7c', '#8098f2', '#d7846a']

function PerformanceChart({ tasks }) {
  const chartData = getPerformanceChartData(tasks)
  const data = chartData.labels.map((label, index) => ({
    label,
    tasks: chartData.data[index],
  }))
  const total = data.reduce((sum, item) => sum + item.tasks, 0)

  if (total === 0) {
    return <ChartEmptyState message="Complete a task with a due date to measure performance." />
  }

  const summary = data.map((item) => `${item.label}: ${item.tasks}`).join(', ')

  return (
    <div
      className="bar-chart bar-chart--performance"
      role="img"
      aria-label={`Completion performance. ${summary}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 8, right: 34, left: 2, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} stroke="#e6e7e1" strokeDasharray="4 5" />
          <XAxis type="number" hide allowDecimals={false} />
          <YAxis
            type="category"
            dataKey="label"
            axisLine={false}
            tickLine={false}
            width={66}
            tick={{ fill: '#5d625b', fontSize: 12, fontWeight: 600 }}
          />
          <Tooltip
            cursor={{ fill: '#f3f3ee' }}
            contentStyle={{
              border: '1px solid #e3e4dd',
              borderRadius: 12,
              boxShadow: '0 12px 30px rgba(35, 41, 37, 0.08)',
            }}
          />
          <Bar dataKey="tasks" radius={[0, 8, 8, 0]} barSize={27}>
            {data.map((item, index) => (
              <Cell key={item.label} fill={COLORS[index]} />
            ))}
            <LabelList
              dataKey="tasks"
              position="right"
              fill="#454a43"
              fontSize={12}
              fontWeight={700}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default PerformanceChart
