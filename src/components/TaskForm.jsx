import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, X } from 'lucide-react'
import { people } from '../data/people.js'
import DatePicker from './DatePicker.jsx'

const EMPTY_TASK = {
  title: '',
  description: '',
  category: '',
  startDate: '',
  dueDate: '',
  responsiblePersonId: '',
  status: 'TODO',
}

function TaskForm({ task, categories, onSubmit, onAddCategory, onClose }) {
  const [formData, setFormData] = useState(() => ({ ...EMPTY_TASK, ...task }))
  const [errors, setErrors] = useState({})
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const titleInputRef = useRef(null)
  const modalRef = useRef(null)
  const formRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const previousBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    titleInputRef.current?.focus()

    function handleDialogKeys(event) {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusableElements = [
        ...modalRef.current.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [href]',
        ),
      ]
      if (!focusableElements.length) return
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }
    document.addEventListener('keydown', handleDialogKeys)
    return () => {
      document.removeEventListener('keydown', handleDialogKeys)
      document.body.style.overflow = previousBodyOverflow
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  function updateField(event) {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: '' }))
  }

  function validate() {
    const nextErrors = {}
    if (!formData.title.trim()) nextErrors.title = 'Please enter a task title.'
    if (!categories.includes(formData.category)) {
      nextErrors.category = 'Please choose a valid category.'
    }
    if (
      !people.some(
        (person) => String(person.id) === String(formData.responsiblePersonId),
      )
    ) {
      nextErrors.responsiblePersonId = 'Please assign a responsible person.'
    }
    if (!formData.startDate) nextErrors.startDate = 'Please choose a start date.'
    if (!formData.dueDate) nextErrors.dueDate = 'Please choose a due date.'
    if (
      formData.startDate &&
      formData.dueDate &&
      formData.startDate > formData.dueDate
    ) {
      nextErrors.dueDate = 'Due date must be on or after the start date.'
    }
    setErrors(nextErrors)
    return nextErrors
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate()
    if (Object.keys(nextErrors).length) {
      window.requestAnimationFrame(() => {
        formRef.current?.querySelector('[aria-invalid="true"]')?.focus()
      })
      return
    }
    onSubmit({ ...formData, title: formData.title.trim(), description: formData.description.trim() })
  }

  function handleAddCategory() {
    const cleanName = newCategory.trim()
    if (!cleanName) return
    const existingCategory = categories.find(
      (category) => category.toLowerCase() === cleanName.toLowerCase(),
    )
    const categoryToUse = existingCategory || cleanName
    if (!existingCategory) onAddCategory(cleanName)
    setFormData((current) => ({ ...current, category: categoryToUse }))
    setNewCategory('')
    setShowCategoryInput(false)
    setErrors((current) => ({ ...current, category: '' }))
  }

  return createPortal(
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        ref={modalRef}
        className="task-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
      >
        <header className="task-modal__header">
          <div>
            <span className="section-eyebrow">{task ? 'Update details' : 'Plan something new'}</span>
            <h2 id="task-form-title">{task ? 'Edit task' : 'Create a task'}</h2>
          </div>
          <button className="modal-close" type="button" onClick={onClose} aria-label="Close task form">
            <X size={19} />
          </button>
        </header>

        <form ref={formRef} className="task-form" onSubmit={handleSubmit} noValidate>
          <label className="form-field form-field--wide">
            <span>Task title <b aria-hidden="true">*</b></span>
            <input
              ref={titleInputRef}
              name="title"
              value={formData.title}
              onChange={updateField}
              placeholder="What needs to happen?"
              maxLength="100"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && <small id="title-error" className="field-error">{errors.title}</small>}
          </label>

          <label className="form-field form-field--wide">
            <span>Description</span>
            <textarea
              name="description"
              value={formData.description}
              onChange={updateField}
              placeholder="Add a little context for your team…"
              rows="3"
              maxLength="500"
            />
          </label>

          <div className="form-field form-field--wide">
            <div className="field-label-row">
              <span>Category <b aria-hidden="true">*</b></span>
              <button
                type="button"
                className="text-button"
                onClick={() => setShowCategoryInput((current) => !current)}
              >
                <Plus size={13} /> New category
              </button>
            </div>
            <select
              name="category"
              value={formData.category}
              onChange={updateField}
              aria-label="Task category"
              required
              aria-required="true"
              aria-invalid={Boolean(errors.category)}
              aria-describedby={errors.category ? 'category-error' : undefined}
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            {showCategoryInput && (
              <div className="inline-category-form">
                <input
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder="Category name"
                  aria-label="New category name"
                  maxLength="40"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault()
                      handleAddCategory()
                    }
                  }}
                />
                <button type="button" onClick={handleAddCategory}>Add</button>
              </div>
            )}
            {errors.category && <small id="category-error" className="field-error">{errors.category}</small>}
          </div>

          <label className="form-field">
            <span>Responsible person <b aria-hidden="true">*</b></span>
            <select
              name="responsiblePersonId"
              value={formData.responsiblePersonId}
              onChange={updateField}
              required
              aria-required="true"
              aria-invalid={Boolean(errors.responsiblePersonId)}
              aria-describedby={errors.responsiblePersonId ? 'person-error' : undefined}
            >
              <option value="">Choose a person</option>
              {people.map((person) => (
                <option key={person.id} value={String(person.id)}>{person.name}</option>
              ))}
            </select>
            {errors.responsiblePersonId && <small id="person-error" className="field-error">{errors.responsiblePersonId}</small>}
          </label>

          <label className="form-field">
            <span>Status</span>
            <select name="status" value={formData.status} onChange={updateField}>
              <option value="TODO">TO DO</option>
              <option value="DOING">DOING</option>
              <option value="DONE">DONE</option>
            </select>
          </label>

          <DatePicker
            name="startDate"
            label="Start date"
            value={formData.startDate}
            onChange={updateField}
            error={errors.startDate}
          />

          <DatePicker
            name="dueDate"
            label="Due date"
            value={formData.dueDate}
            onChange={updateField}
            error={errors.dueDate}
          />

          <footer className="task-form__actions">
            <button className="button button--ghost" type="button" onClick={onClose}>Cancel</button>
            <button className="button button--primary" type="submit">
              {task ? 'Save changes' : 'Create task'}
            </button>
          </footer>
        </form>
      </section>
    </div>,
    document.body,
  )
}

export default TaskForm
