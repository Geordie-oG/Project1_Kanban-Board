import assert from 'node:assert/strict'
import test from 'node:test'

import {
  cleanDateKey,
  hydrateAppData,
  hydrateCategories,
  hydrateTasks,
  toCanonicalStatus,
} from '../src/utils/taskHydration.js'

test('hydration falls back only when the stored collection is not an array', () => {
  const fallbackTasks = [{ id: 'fallback' }]
  assert.equal(hydrateTasks(null, fallbackTasks), fallbackTasks)
  assert.deepEqual(hydrateTasks([], fallbackTasks), [])
})

test('hydration repairs malformed task fields and canonicalizes statuses', () => {
  const tasks = hydrateTasks(
    [
      {
        id: 'same-id',
        title: null,
        category: ' Design ',
        status: 'to do',
        startDate: '2026-02-30',
        dueDate: '2026-08-21',
        completeDate: '2026-08-20',
        responsiblePersonId: 42,
      },
      { id: 'same-id', status: 'completed', completeDate: '2026-08-20' },
      { status: 'unknown' },
      null,
    ],
    [],
    () => 'generated-id',
  )

  assert.equal(tasks.length, 3)
  assert.deepEqual(tasks.map((task) => task.status), ['TODO', 'DONE', 'TODO'])
  assert.equal(tasks[0].title, 'Untitled task')
  assert.equal(tasks[0].startDate, '')
  assert.equal(tasks[0].dueDate, '2026-08-21')
  assert.equal(tasks[0].completeDate, '')
  assert.equal(tasks[0].responsiblePersonId, '42')
  assert.notEqual(tasks[0].id, tasks[1].id)
})

test('categories trim, deduplicate by case, and include task categories', () => {
  assert.deepEqual(
    hydrateCategories(['Design', ' design ', null], [], [
      { category: 'Development' },
      { category: 'DESIGN' },
    ]),
    ['Design', 'Development'],
  )
})

test('app hydration uses canonical category spelling in tasks', () => {
  const result = hydrateAppData({
    storedTasks: [{ id: '1', status: 'TODO', category: 'design' }],
    storedCategories: ['Design'],
  })

  assert.equal(result.tasks[0].category, 'Design')
  assert.deepEqual(result.categories, ['Design'])
})

test('date and status sanitation is strict and predictable', () => {
  assert.equal(cleanDateKey('2024-02-29'), '2024-02-29')
  assert.equal(cleanDateKey('2026-02-29'), '')
  assert.equal(toCanonicalStatus('in progress'), 'DOING')
  assert.equal(toCanonicalStatus('blocked'), 'TODO')
})
