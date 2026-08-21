import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { getStatusChartData } from '../../utils/taskCalculations.js'
import ChartEmptyState from './ChartEmptyState.jsx'

const COLORS = ['#8098f2', '#e8ad52', '#4b9b7c']

function StatusTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <span>{payload[0].name}</span>
      <strong>{payload[0].value} tasks</strong>
    </div>
  )
}

function StatusChart({ tasks }) {
  const chartData = getStatusChartData(tasks)
  const data = chartData.labels.map((name, index) => ({
    name,
    value: chartData.data[index],
  }))
  const total = data.reduce((sum, item) => sum + item.value, 0)
  const accessibleSummary = data.map((item) => `${item.name}: ${item.value}`).join(', ')

  if (total === 0) return <ChartEmptyState />

  return (
    <div className="status-chart-wrap">
      <div
        className="donut-chart"
        role="img"
        aria-label={`Task status chart. ${accessibleSummary}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={67}
              outerRadius={91}
              paddingAngle={4}
              cornerRadius={7}
              stroke="none"
            >
              {data.map((item, index) => (
                <Cell key={item.name} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip content={<StatusTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-chart__center" aria-hidden="true">
          <strong>{total}</strong>
          <span>tasks</span>
        </div>
      </div>

      <ul className="chart-legend" aria-hidden="true">
        {data.map((item, index) => (
          <li key={item.name}>
            <span className="legend-dot" style={{ background: COLORS[index] }} />
            <span>{item.name}</span>
            <strong>{item.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default StatusChart
