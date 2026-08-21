import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Pencil,
  Trash2,
  TriangleAlert,
} from 'lucide-react'
import { getPersonById } from '../data/people.js'
import { isTaskOverdue, normalizeStatus } from '../utils/taskCalculations.js'

const STATUS_ORDER = ['TODO', 'DOING', 'DONE']
const CATEGORY_COLORS = ['mint', 'blue', 'amber', 'coral', 'lilac']

function getCategoryTone(category = '') {
  const hash = [...category].reduce((sum, character) => sum + character.charCodeAt(0), 0)
  return CATEGORY_COLORS[hash % CATEGORY_COLORS.length]
}

function formatDate(dateKey) {
  if (!dateKey) return 'No due date'
  const date = new Date(`${dateKey}T12:00:00`)
  if (Number.isNaN(date.getTime())) return dateKey

  return new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

function TaskCard({ task, onMove, onEdit, onDelete }) {
  const person = getPersonById(task.responsiblePersonId)
  const overdue = isTaskOverdue(task)
  const currentStatus = normalizeStatus(task.status)
  const statusIndex = STATUS_ORDER.indexOf(currentStatus)
  const previousStatus = STATUS_ORDER[statusIndex - 1]
  const nextStatus = STATUS_ORDER[statusIndex + 1]

  return (
    <article
      className={`task-card${overdue ? ' task-card--overdue' : ''}`}
      data-task-id={task.id}
      tabIndex="-1"
    >
      <div className="task-card__topline">
        <span className={`category-pill category-pill--${getCategoryTone(task.category)}`}>
          {task.category || 'Uncategorized'}
        </span>
        <div className="task-card__actions">
          <button
            className="icon-button"
            type="button"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
          >
            <Pencil size={14} />
          </button>
          <button
            className="icon-button icon-button--danger"
            type="button"
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div className="task-card__content">
        <h3>{task.title}</h3>
        {task.description && <p>{task.description}</p>}
      </div>

      <div className="task-card__meta">
        <span className="person-chip" title={person?.name || 'Unassigned'}>
          <span
            className="person-avatar"
            style={{ background: person?.color || '#e4e5df' }}
            aria-hidden="true"
          >
            {person?.initials || '—'}
          </span>
          <span>{person?.name || 'Unassigned'}</span>
        </span>
        <span className={`due-chip${overdue ? ' is-overdue' : ''}`}>
          {overdue ? <TriangleAlert size={13} /> : <CalendarClock size={13} />}
          <span>{overdue ? 'Overdue' : formatDate(task.dueDate)}</span>
        </span>
      </div>

      <footer className="task-card__footer">
        <button
          type="button"
          className="move-button"
          disabled={statusIndex <= 0}
          onClick={() => onMove(task.id, previousStatus)}
          aria-label={`Move ${task.title} to ${previousStatus || 'the previous column'}`}
        >
          <ArrowLeft size={15} />
          <span>Back</span>
        </button>
        <span className="task-card__date-label">
          {currentStatus === 'DONE' && task.completeDate
            ? `Done ${formatDate(task.completeDate)}`
            : `Due ${formatDate(task.dueDate)}`}
        </span>
        <button
          type="button"
          className="move-button move-button--next"
          disabled={statusIndex < 0 || statusIndex >= STATUS_ORDER.length - 1}
          onClick={() => onMove(task.id, nextStatus)}
          aria-label={`Move ${task.title} to ${nextStatus || 'the next column'}`}
        >
          <span>Next</span>
          <ArrowRight size={15} />
        </button>
      </footer>
    </article>
  )
}

export default TaskCard
