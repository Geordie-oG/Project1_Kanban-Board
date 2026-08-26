import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useEffect, useRef, useState } from 'react'
import { getCategoryChartData } from '../../utils/taskCalculations.js'
import ChartEmptyState from './ChartEmptyState.jsx'

const CATEGORY_COLORS = ['#577f71', '#8098f2', '#e8ad52', '#d7846a', '#997db9']

function shortenLabel(label) {
  return label.length > 13 ? `${label.slice(0, 12)}…` : label
}

function CategoryChart({ tasks }) {
  const scrollRegionRef = useRef(null)
  const [isScrollable, setIsScrollable] = useState(false)
  const chartData = getCategoryChartData(tasks)
  const data = chartData.labels.map((category, index) => ({
    category,
    tasks: chartData.data[index],
  }))

  const chartHeight = Math.max(240, data.length * 44)

  useEffect(() => {
    const scrollRegion = scrollRegionRef.current
    if (!scrollRegion) return undefined

    function updateScrollableState() {
      setIsScrollable(scrollRegion.scrollHeight > scrollRegion.clientHeight + 1)
    }

    updateScrollableState()
    const resizeObserver = new ResizeObserver(updateScrollableState)
    resizeObserver.observe(scrollRegion)

    return () => resizeObserver.disconnect()
  }, [chartHeight, data.length])

  if (data.length === 0) return <ChartEmptyState />

  const summary = data.map((item) => `${item.category}: ${item.tasks}`).join(', ')

  return (
    <div
      ref={scrollRegionRef}
      className="chart-scroll-region"
      role={isScrollable ? 'region' : undefined}
      tabIndex={isScrollable ? 0 : undefined}
      aria-label={isScrollable ? 'Scrollable category chart' : undefined}
    >
      <div
        className="bar-chart bar-chart--category"
        style={{ height: chartHeight }}
        role="img"
        aria-label={`Tasks by category. ${summary}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 6, right: 24, left: 0, bottom: 0 }}
          >
            <CartesianGrid horizontal={false} stroke="#e6e7e1" strokeDasharray="4 5" />
            <XAxis
              type="number"
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{ fill: '#777b72', fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="category"
              axisLine={false}
              tickLine={false}
              width={92}
              tickFormatter={shortenLabel}
              tick={{ fill: '#666b64', fontSize: 10, fontWeight: 600 }}
            />
            <Tooltip
              cursor={{ fill: '#f3f3ee' }}
              formatter={(value) => [`${value} tasks`, 'Total']}
              contentStyle={{
                border: '1px solid #e3e4dd',
                borderRadius: 12,
                boxShadow: '0 12px 30px rgba(35, 41, 37, 0.08)',
              }}
            />
            <Bar dataKey="tasks" radius={[0, 8, 8, 0]} barSize={24}>
              {data.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default CategoryChart
