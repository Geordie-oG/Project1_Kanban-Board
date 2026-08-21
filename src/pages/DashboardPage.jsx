import {
  ArrowRight,
  CheckCircle2,
  CircleDashed,
  Clock3,
  ListChecks,
  Sparkles,
  TriangleAlert,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import ChartCard from '../components/ChartCard.jsx'
import SummaryCard from '../components/SummaryCard.jsx'
import CategoryChart from '../components/charts/CategoryChart.jsx'
import PerformanceChart from '../components/charts/PerformanceChart.jsx'
import StatusChart from '../components/charts/StatusChart.jsx'
import { useTasks } from '../context/useTasks.js'
import { getTaskSummary } from '../utils/taskCalculations.js'

function DashboardPage() {
  const { tasks } = useTasks()
  const summary = getTaskSummary(tasks)
  const completionRate = summary.total
    ? Math.round((summary.done / summary.total) * 100)
    : 0

  const cards = [
    {
      label: 'Total tasks',
      value: summary.total,
      helper: 'Across your whole board',
      icon: ListChecks,
      tone: 'ink',
    },
    {
      label: 'To do',
      value: summary.todo,
      helper: 'Ready to be picked up',
      icon: CircleDashed,
      tone: 'blue',
    },
    {
      label: 'Doing',
      value: summary.doing,
      helper: 'Work currently in motion',
      icon: Clock3,
      tone: 'amber',
    },
    {
      label: 'Done',
      value: summary.done,
      helper: 'Completed with care',
      icon: CheckCircle2,
      tone: 'mint',
    },
    {
      label: 'Overdue',
      value: summary.overdue,
      helper: summary.overdue ? 'Needs the team’s attention' : 'Everything is on track',
      icon: TriangleAlert,
      tone: 'coral',
    },
  ]

  return (
    <div className="dashboard-page page-enter">
      <section className="dashboard-hero">
        <div className="dashboard-hero__copy">
          <span className="hero-kicker">
            <Sparkles size={14} aria-hidden="true" />
            Live team overview
          </span>
          <h1>Make progress<br />feel visible.</h1>
          <p>
            A calm, honest snapshot of what is moving, what is finished, and where
            the team can help next.
          </p>
          <Link className="button button--light" to="/kanban">
            Open the board
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>

        <div className="progress-orbit" aria-label={`${completionRate}% of tasks completed`}>
          <div
            className="progress-orbit__ring"
            style={{ '--progress': `${completionRate * 3.6}deg` }}
          >
            <div>
              <strong>{completionRate}%</strong>
              <span>complete</span>
            </div>
          </div>
          <p>
            <span className="pulse-dot" aria-hidden="true" />
            Synced with your Kanban board
          </p>
        </div>
      </section>

      <section className="summary-section" aria-labelledby="summary-heading">
        <div className="section-heading-row">
          <div>
            <span className="section-eyebrow">At a glance</span>
            <h2 id="summary-heading">Today’s workload</h2>
          </div>
          <p>Updates automatically as tasks move through the board.</p>
        </div>
        <div className="summary-grid">
          {cards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section className="dashboard-charts" aria-label="Task analytics">
        <ChartCard
          eyebrow="Distribution"
          title="Task status"
          description="How work is spread across the workflow."
        >
          <StatusChart tasks={tasks} />
        </ChartCard>

        <ChartCard
          eyebrow="Delivery"
          title="Completion performance"
          description="Finished before, on, or after the due date."
        >
          <PerformanceChart tasks={tasks} />
        </ChartCard>

        <ChartCard
          eyebrow="Work mix"
          title="Tasks by category"
          description="See where the team is investing its energy."
          className="chart-card--wide"
        >
          <CategoryChart tasks={tasks} />
        </ChartCard>
      </section>
    </div>
  )
}

export default DashboardPage
