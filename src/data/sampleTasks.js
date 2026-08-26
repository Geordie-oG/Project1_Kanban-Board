function formatLocalDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function dateFromToday(offset) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offset)
  return formatLocalDate(date)
}

export const sampleCategories = ['Design', 'Development', 'Research', 'Content']

export function createSampleTasks() {
  return [
    {
      id: 'sample-brief',
      title: 'Shape the project brief',
      description: 'Align the team around the core problem, audience, and success criteria.',
      category: 'Research',
      startDate: dateFromToday(-2),
      dueDate: dateFromToday(2),
      completeDate: '',
      responsiblePersonId: 'person-1',
      status: 'TODO',
    },
    {
      id: 'sample-copy',
      title: 'Write onboarding copy',
      description: 'Draft concise empty states and friendly helper text for first-time users.',
      category: 'Content',
      startDate: dateFromToday(-4),
      dueDate: dateFromToday(-1),
      completeDate: '',
      responsiblePersonId: 'person-2',
      status: 'TODO',
    },
    {
      id: 'sample-components',
      title: 'Build the component library',
      description: 'Create reusable buttons, fields, cards, badges, and page-level patterns.',
      category: 'Development',
      startDate: dateFromToday(-3),
      dueDate: dateFromToday(1),
      completeDate: '',
      responsiblePersonId: 'person-3',
      status: 'DOING',
    },
    {
      id: 'sample-mobile',
      title: 'Review mobile layouts',
      description: 'Check touch targets, card density, and horizontal board scrolling.',
      category: 'Design',
      startDate: dateFromToday(-5),
      dueDate: dateFromToday(-2),
      completeDate: '',
      responsiblePersonId: 'person-3',
      status: 'DOING',
    },
    {
      id: 'sample-tokens',
      title: 'Define visual tokens',
      description: 'Document the shared palette, typography, spacing, and elevation system.',
      category: 'Design',
      startDate: dateFromToday(-9),
      dueDate: dateFromToday(-6),
      completeDate: dateFromToday(-7),
      responsiblePersonId: 'person-1',
      status: 'DONE',
    },
    {
      id: 'sample-storage',
      title: 'Map the Local Storage flow',
      description: 'Confirm storage keys and recovery behavior with the task-management owner.',
      category: 'Development',
      startDate: dateFromToday(-8),
      dueDate: dateFromToday(-4),
      completeDate: dateFromToday(-4),
      responsiblePersonId: 'person-3',
      status: 'DONE',
    },
    {
      id: 'sample-tests',
      title: 'Run an accessibility pass',
      description: 'Verify focus states, semantic labels, keyboard flow, and color contrast.',
      category: 'Research',
      startDate: dateFromToday(-7),
      dueDate: dateFromToday(-3),
      completeDate: dateFromToday(-1),
      responsiblePersonId: 'person-2',
      status: 'DONE',
    },
  ]
}
