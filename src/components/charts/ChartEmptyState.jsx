import { BarChart3 } from 'lucide-react'

function ChartEmptyState({ message = 'Add tasks to see this chart come to life.' }) {
  return (
    <div className="chart-empty" role="status">
      <span aria-hidden="true">
        <BarChart3 size={22} />
      </span>
      <p>{message}</p>
    </div>
  )
}

export default ChartEmptyState
