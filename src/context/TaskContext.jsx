import { useEffect, useState } from 'react'
import { sampleCategories, createSampleTasks } from '../data/sampleTasks.js'
import { getTodayDateKey } from '../utils/taskCalculations.js'
import { hydrateAppData, toCanonicalStatus } from '../utils/taskHydration.js'
import { loadStoredValue, saveStoredValue, STORAGE_KEYS } from '../utils/storage.js'
import TaskContext from './taskContext.js'

function makeTaskId() {
  return globalThis.crypto?.randomUUID?.() ?? `task-${Date.now()}`
}

function initializeAppData() {
  return hydrateAppData({
    storedTasks: loadStoredValue(STORAGE_KEYS.tasks, null),
    storedCategories: loadStoredValue(STORAGE_KEYS.categories, null),
    fallbackTasks: createSampleTasks(),
    fallbackCategories: sampleCategories,
    idFactory: makeTaskId,
  })
}

function applyStatusDates(task, requestedStatus) {
  const status = toCanonicalStatus(requestedStatus)

  return {
    ...task,
    status,
    completeDate:
      status === 'DONE' ? task.completeDate || getTodayDateKey() : '',
  }
}

export function TaskProvider({ children }) {
  const [initialData] = useState(initializeAppData)
  const [tasks, setTasks] = useState(initialData.tasks)
  const [categories, setCategories] = useState(initialData.categories)

  useEffect(() => {
    saveStoredValue(STORAGE_KEYS.tasks, tasks)
  }, [tasks])

  useEffect(() => {
    saveStoredValue(STORAGE_KEYS.categories, categories)
  }, [categories])

  function ensureCategory(categoryName) {
    if (typeof categoryName !== 'string' || !categoryName.trim()) return
    const cleanName = categoryName.trim()
    setCategories((currentCategories) => {
      const exists = currentCategories.some(
        (category) => category.toLowerCase() === cleanName.toLowerCase(),
      )
      return exists ? currentCategories : [...currentCategories, cleanName]
    })
  }

  function addTask(taskData) {
    ensureCategory(taskData.category)
    const newTask = applyStatusDates(
      { ...taskData, id: makeTaskId(), completeDate: taskData.completeDate || '' },
      taskData.status || 'TODO',
    )
    setTasks((currentTasks) => [...currentTasks, newTask])
    return newTask
  }

  function updateTask(taskId, taskData) {
    ensureCategory(taskData.category)
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId
          ? applyStatusDates({ ...task, ...taskData, id: task.id }, taskData.status ?? task.status)
          : task,
      ),
    )
  }

  function deleteTask(taskId) {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== taskId))
  }

  function moveTask(taskId, newStatus) {
    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === taskId ? applyStatusDates(task, newStatus) : task,
      ),
    )
  }

  function addCategory(categoryName) {
    const cleanName = categoryName.trim()
    if (!cleanName) return false

    const exists = categories.some(
      (category) => category.toLowerCase() === cleanName.toLowerCase(),
    )
    if (exists) return false

    setCategories((currentCategories) => {
      const alreadyAdded = currentCategories.some(
        (category) => category.toLowerCase() === cleanName.toLowerCase(),
      )
      return alreadyAdded ? currentCategories : [...currentCategories, cleanName]
    })
    return true
  }

  const value = {
    tasks,
    categories,
    addTask,
    updateTask,
    deleteTask,
    moveTask,
    addCategory,
  }

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}
