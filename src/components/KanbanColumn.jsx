import { CircleCheckBig, CircleDashed, Clock3, Inbox } from 'lucide-react'
import TaskCard from './TaskCard.jsx'

const COLUMN_CONFIG = {
  TODO: {
    label: 'TO DO',
    note: 'Ready when you are',
    icon: CircleDashed,
    tone: 'blue',
  },
  DOING: {
    label: 'DOING',
    note: 'Work in motion',
    icon: Clock3,
    tone: 'amber',
  },
  DONE: {
    label: 'DONE',
    note: 'A little victory shelf',
    icon: CircleCheckBig,
    tone: 'mint',
  },
}

function KanbanColumn({ status, tasks, onMove, onEdit, onDelete, emptyMessage }) {
  const config = COLUMN_CONFIG[status]
  const Icon = config.icon

  return (
    <section className={`kanban-column kanban-column--${config.tone}`}>
      <header className="kanban-column__header">
        <span className="column-icon" aria-hidden="true">
          <Icon size={18} />
        </span>
        <div>
          <div className="column-title-row">
            <h2>{config.label}</h2>
            <span className="column-count">{tasks.length}</span>
          </div>
          <p>{config.note}</p>
        </div>
      </header>

      <div className="kanban-column__tasks">
        {tasks.length ? (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onMove={onMove}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        ) : (
          <div className="column-empty">
            <span aria-hidden="true">
              <Inbox size={20} />
            </span>
            <strong>Clear space</strong>
            <p>{emptyMessage || 'No tasks in this column yet.'}</p>
          </div>
        )}
      </div>
    </section>
  )
}

export default KanbanColumn
