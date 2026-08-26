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
import '../dashboard-ui.css'

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
      helper: summary.overdue
        ? 'Needs the team’s attention'
        : 'Everything is on track',
      icon: TriangleAlert,
      tone: 'coral',
    },
  ]

  return (
    <div className="dashboard-page dashboard-page--refresh page-enter">

      <section className="dashboard-hero dashboard-hero--refresh">
        <div className="dashboard-hero__copy">
          <span className="hero-kicker">
            <Sparkles size={14} aria-hidden="true" />
            Live team overview
          </span>
          <h1>
            <span className="hero-title-line">Make progress</span>{' '}
            <span className="hero-title-line">feel visible.</span>
          </h1>
          <p>
            Track the team’s workload, completed tasks, overdue work and
            performance from one clear dashboard.
          </p>

          <div className="dashboard-hero__actions">
            <Link className="button button--light" to="/kanban">
              Open the board
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="dashboard-hero__metrics">
            <div>
              <strong>{summary.total}</strong>
              <span>Total tasks</span>
            </div>

            <div>
              <strong>{summary.done}</strong>
              <span>Completed</span>
            </div>

            <div className={summary.overdue ? 'metric-alert' : ''}>
              <strong>{summary.overdue}</strong>
              <span>Overdue</span>
            </div>
          </div>
        </div>

        <div
          className="progress-orbit progress-orbit--refresh"
          aria-label={`${completionRate}% of tasks completed`}
        >
          <div
            className="progress-orbit__ring"
            style={{ '--progress': `${completionRate * 3.6}deg` }}
          >
            <div>
              <strong>{completionRate}%</strong>
              <span>complete</span>
            </div>
          </div>

          <div className="progress-orbit__caption">
            <span className="pulse-dot" aria-hidden="true" />
            <div>
              <strong>Board progress</strong>
              <span>Synced with Kanban tasks</span>
            </div>
          </div>
        </div>
      </section>

      <section
        className="summary-section dashboard-summary"
        aria-labelledby="summary-heading"
      >
        <div className="section-heading-row">
          <div>
            <span className="section-eyebrow">At a glance</span>
            <h2 id="summary-heading">Task overview</h2>
          </div>

          <p>
            Live counts automatically update when tasks move through the board.
          </p>
        </div>

        <div className="summary-grid">
          {cards.map((card) => (
            <SummaryCard key={card.label} {...card} />
          ))}
        </div>
      </section>

      <section className="analytics-section">
        <div className="section-heading-row analytics-heading">
          <div>
            <span className="section-eyebrow">Analytics</span>
            <h2>Understand your workflow</h2>
          </div>

          <p>
            Compare status, delivery performance and category distribution.
          </p>
        </div>

        <div className="dashboard-charts dashboard-charts--refresh">
          <ChartCard
            eyebrow="Distribution"
            title="Task status"
            description="How work is spread across TO DO, DOING and DONE."
          >
            <StatusChart tasks={tasks} />
          </ChartCard>

          <ChartCard
            eyebrow="Delivery"
            title="Completion performance"
            description="Compare tasks completed early, on time or late."
          >
            <PerformanceChart tasks={tasks} />
          </ChartCard>

          <ChartCard
            eyebrow="Work mix"
            title="Tasks by category"
            description="See how tasks are distributed across categories."
            className="chart-card--wide"
          >
            <CategoryChart tasks={tasks} />
          </ChartCard>
        </div>
      </section>

    </div>
  )
}

export default DashboardPage
