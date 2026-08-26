export const STORAGE_KEYS = {
  tasks: 'kanban_tasks_v1',
  categories: 'kanban_categories_v1',
}

export function loadStoredValue(key, fallbackValue) {
  try {
    const storedValue = window.localStorage.getItem(key)
    return storedValue === null ? fallbackValue : JSON.parse(storedValue)
  } catch {
    return fallbackValue
  }
}

export function saveStoredValue(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // The app remains usable when browser storage is unavailable.
  }
}
