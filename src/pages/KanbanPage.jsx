import { Filter, Plus, Search, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import KanbanColumn from '../components/KanbanColumn.jsx'
import TaskForm from '../components/TaskForm.jsx'
import { useTasks } from '../context/useTasks.js'
import { getTaskSummary, normalizeStatus } from '../utils/taskCalculations.js'

const STATUSES = ['TODO', 'DOING', 'DONE']

function KanbanPage() {
  const {
    tasks,
    categories,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addCategory,
  } = useTasks()
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [editingTask, setEditingTask] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [movedTaskId, setMovedTaskId] = useState(null)
  const [movementAnnouncement, setMovementAnnouncement] = useState('')
  const summary = getTaskSummary(tasks)
  const completionRate = summary.total
    ? Math.round((summary.done / summary.total) * 100)
    : 0

  const visibleTasks = useMemo(() => {
    const search = searchTerm.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesCategory = categoryFilter === 'ALL' || task.category === categoryFilter
      const matchesSearch =
        !search ||
        task.title?.toLowerCase().includes(search) ||
        task.description?.toLowerCase().includes(search)
      return matchesCategory && matchesSearch
    })
  }, [tasks, searchTerm, categoryFilter])
  const filtersAreActive = Boolean(searchTerm.trim()) || categoryFilter !== 'ALL'

  useEffect(() => {
    if (!movedTaskId) return
    const focusMovedCard = window.requestAnimationFrame(() => {
      const movedCard = [...document.querySelectorAll('[data-task-id]')].find(
        (card) => card.dataset.taskId === movedTaskId,
      )
      movedCard?.focus()
      setMovedTaskId(null)
    })
    return () => window.cancelAnimationFrame(focusMovedCard)
  }, [tasks, movedTaskId])

  function openCreateForm() {
    setEditingTask(null)
    setIsFormOpen(true)
  }

  function openEditForm(task) {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  function closeForm() {
    setIsFormOpen(false)
    setEditingTask(null)
  }

  function saveTask(taskData) {
    if (editingTask) updateTask(editingTask.id, taskData)
    else addTask(taskData)
    closeForm()
  }

  function confirmDelete(task) {
    if (window.confirm(`Delete “${task.title}”? This cannot be undone.`)) {
      deleteTask(task.id)
    }
  }

  function handleMove(taskId, newStatus) {
    const task = tasks.find((item) => item.id === taskId)
    moveTask(taskId, newStatus)
    setMovedTaskId(taskId)
    setMovementAnnouncement(`${task?.title || 'Task'} moved to ${newStatus}.`)
  }

  return (
    <div className="kanban-page page-enter">
      <header className="board-hero">
        <div className="board-hero__copy">
          <span className="hero-kicker hero-kicker--dark">
            <Sparkles size={14} aria-hidden="true" />
            Your shared flow
          </span>
          <h1>Kanban Board</h1>
          <p>
            Plan clearly, move intentionally, and keep every handoff visible to the team.
          </p>
        </div>

        <div className="board-hero__aside">
          <div className="mini-progress">
            <div className="mini-progress__topline">
              <span>Board progress</span>
              <strong>{completionRate}%</strong>
            </div>
            <div className="mini-progress__track" aria-hidden="true">
              <span style={{ width: `${completionRate}%` }} />
            </div>
            <small>{summary.done} of {summary.total} tasks completed</small>
          </div>
          <button className="button button--primary" type="button" onClick={openCreateForm}>
            <Plus size={18} />
            New task
          </button>
        </div>
      </header>

      <section className="board-toolbar" aria-label="Board filters">
        <label className="search-field">
          <Search size={17} aria-hidden="true" />
          <span className="sr-only">Search tasks</span>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search the board…"
          />
        </label>
        <label className="filter-field">
          <Filter size={16} aria-hidden="true" />
          <span className="sr-only">Filter by category</span>
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
          >
            <option value="ALL">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>
        <div className="board-toolbar__note">
          <span>{visibleTasks.length}</span> visible task{visibleTasks.length === 1 ? '' : 's'}
        </div>
      </section>

      <div id="board-scroll-help" className="board-scroll-hint">
        Scroll sideways to explore every column
      </div>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {movementAnnouncement}
      </div>

      <section
        className="kanban-board"
        aria-label="Kanban board"
        aria-describedby="board-scroll-help"
        tabIndex="0"
      >
        {STATUSES.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={visibleTasks.filter((task) => normalizeStatus(task.status) === status)}
            onMove={handleMove}
            onEdit={openEditForm}
            onDelete={confirmDelete}
            emptyMessage={filtersAreActive ? 'No tasks match these filters.' : undefined}
          />
        ))}
      </section>

      {isFormOpen && (
        <TaskForm
          task={editingTask}
          categories={categories}
          onSubmit={saveTask}
          onAddCategory={addCategory}
          onClose={closeForm}
        />
      )}
    </div>
  )
}

export default KanbanPage
