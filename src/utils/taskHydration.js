import { normalizeStatus } from './taskCalculations.js'

const VALID_STATUSES = ['TODO', 'DOING', 'DONE']
const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

function defaultIdFactory() {
  return globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}`
}

export function toCanonicalStatus(status) {
  const normalizedStatus = normalizeStatus(status)
  return VALID_STATUSES.includes(normalizedStatus) ? normalizedStatus : 'TODO'
}

export function cleanDateKey(value) {
  if (typeof value !== 'string') return ''
  const dateKey = value.trim()
  const match = ISO_DATE_PATTERN.exec(dateKey)
  if (!match) return ''

  const [, year, month, day] = match
  const parsed = new Date(`${year}-${month}-${day}T00:00:00.000Z`)
  if (
    Number.isNaN(parsed.getTime()) ||
    parsed.getUTCFullYear() !== Number(year) ||
    parsed.getUTCMonth() + 1 !== Number(month) ||
    parsed.getUTCDate() !== Number(day)
  ) {
    return ''
  }
  return dateKey
}

export function hydrateTasks(storedTasks, fallbackTasks = [], idFactory = defaultIdFactory) {
  if (!Array.isArray(storedTasks)) return fallbackTasks

  const usedTaskIds = new Set()

  return storedTasks
    .filter((task) => task && typeof task === 'object' && !Array.isArray(task))
    .map((task, index) => {
      const status = toCanonicalStatus(task.status)
      const requestedId = typeof task.id === 'string' ? task.id.trim() : ''
      const baseId = requestedId || idFactory()
      let id = baseId
      let collisionNumber = index + 1
      while (usedTaskIds.has(id)) {
        id = `${baseId}-${collisionNumber}`
        collisionNumber += 1
      }
      usedTaskIds.add(id)

      return {
        id,
        title: typeof task.title === 'string' ? task.title : 'Untitled task',
        description: typeof task.description === 'string' ? task.description : '',
        category: typeof task.category === 'string' ? task.category.trim() : '',
        startDate: cleanDateKey(task.startDate),
        dueDate: cleanDateKey(task.dueDate),
        completeDate: status === 'DONE' ? cleanDateKey(task.completeDate) : '',
        responsiblePersonId:
          typeof task.responsiblePersonId === 'string' ||
          typeof task.responsiblePersonId === 'number'
            ? String(task.responsiblePersonId)
            : '',
        status,
      }
    })
}

export function hydrateCategories(storedCategories, fallbackCategories = [], tasks = []) {
  const categorySource = Array.isArray(storedCategories)
    ? storedCategories
    : fallbackCategories

  return [...categorySource, ...tasks.map((task) => task.category)].reduce(
    (uniqueCategories, category) => {
      if (typeof category !== 'string' || !category.trim()) return uniqueCategories
      const cleanName = category.trim()
      const exists = uniqueCategories.some(
        (savedCategory) => savedCategory.toLowerCase() === cleanName.toLowerCase(),
      )
      return exists ? uniqueCategories : [...uniqueCategories, cleanName]
    },
    [],
  )
}

export function hydrateAppData({
  storedTasks,
  storedCategories,
  fallbackTasks = [],
  fallbackCategories = [],
  idFactory,
}) {
  const tasks = hydrateTasks(storedTasks, fallbackTasks, idFactory)
  const categories = hydrateCategories(storedCategories, fallbackCategories, tasks)
  const canonicalCategories = new Map(
    categories.map((category) => [category.toLowerCase(), category]),
  )

  return {
    categories,
    tasks: tasks.map((task) => ({
      ...task,
      category: canonicalCategories.get(task.category.toLowerCase()) || task.category,
    })),
  }
}
