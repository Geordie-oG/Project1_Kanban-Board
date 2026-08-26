import { useState } from 'react'

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

  function openPicker() {
    setTempDate(value || '')
    setIsOpen(true)
  }

  function handleConfirm() {
    if (!tempDate) return

    onChange({
      target: {
        name,
        value: tempDate,
      },
    })

    setIsOpen(false)
  }

  function handleToday() {
    setTempDate(getToday())
  }

  return (
    <div className="date-picker">
      <span>
        {label} <b aria-hidden="true"></b>
      </span>

      <button
        type="button"
        className={`date-picker__input ${error ? 'is-error' : ''}`}
        onClick={openPicker}
      >
        {value ? formatDate(value) : 'Select date'}
      </button>

      {error && (
        <small className="field-error">
          {error}
        </small>
      )}

      {isOpen && (
        <div className="date-picker__popup">
          <div className="date-picker__header">
            <strong>{label}</strong>

            <button
              type="button"
              className="date-picker__close"
              onClick={() => setIsOpen(false)}
            >
              ×
            </button>
          </div>

          <input
            type="date"
            value={tempDate}
            onChange={(event) => setTempDate(event.target.value)}
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