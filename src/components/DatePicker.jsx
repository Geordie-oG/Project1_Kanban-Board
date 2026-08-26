import { useRef, useState } from 'react'

function getToday() {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function formatDate(date) {
  if (!date) return ''

  const [year, month, day] = date.split('-')

  return `${day}/${month}/${year}`
}

function DatePicker({ value, onChange, name, label, error }) {
  const [isOpen, setIsOpen] = useState(false)
  const [tempDate, setTempDate] = useState(value || '')
  const triggerRef = useRef(null)
  const inputRef = useRef(null)
  const labelId = `${name}-label`
  const valueId = `${name}-value`
  const popupId = `${name}-picker`
  const errorId = `${name}-error`

  function openPicker() {
    setTempDate(value || '')
    setIsOpen(true)
    window.requestAnimationFrame(() => inputRef.current?.focus())
  }

  function handleConfirm() {
    if (!tempDate) return

    onChange({
      target: {
        name,
        value: tempDate,
      },
    })

    closePicker()
  }

  function handleToday() {
    setTempDate(getToday())
  }

  function closePicker() {
    setIsOpen(false)
    window.requestAnimationFrame(() => triggerRef.current?.focus())
  }

  return (
    <div
      className="date-picker"
      onKeyDown={(event) => {
        if (isOpen && event.key === 'Escape') {
          event.stopPropagation()
          closePicker()
        }
      }}
    >
      <span id={labelId}>
        {label} <b aria-hidden="true">*</b>
        <span className="sr-only"> required</span>
      </span>

      <button
        ref={triggerRef}
        type="button"
        className={`date-picker__input${error ? ' is-error' : ''}`}
        onClick={openPicker}
        aria-labelledby={`${labelId} ${valueId}`}
        aria-expanded={isOpen}
        aria-controls={popupId}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
      >
        <span id={valueId}>{value ? formatDate(value) : 'Select date'}</span>
      </button>

      {error && (
        <small id={errorId} className="field-error" role="alert">
          {error}
        </small>
      )}

      {isOpen && (
        <div
          id={popupId}
          className="date-picker__popup"
          role="group"
          aria-labelledby={labelId}
        >
          <div className="date-picker__header">
            <strong>{label}</strong>

            <button
              type="button"
              className="date-picker__close"
              onClick={closePicker}
              aria-label={`Close ${label.toLowerCase()} picker`}
            >
              ×
            </button>
          </div>

          <input
            ref={inputRef}
            type="date"
            value={tempDate}
            onChange={(event) => setTempDate(event.target.value)}
            aria-label={`Choose ${label.toLowerCase()}`}
          />

          <div className="date-picker__actions">
            <button
              type="button"
              className="date-picker__today"
              onClick={handleToday}
            >
              Today
            </button>

            <button
              type="button"
              className="date-picker__confirm"
              disabled={!tempDate}
              onClick={handleConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
