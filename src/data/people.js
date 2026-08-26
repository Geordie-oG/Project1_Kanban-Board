export const people = [
  { id: 'person-1', name: 'Lihout Van', initials: 'LV', color: '#cfe8df' },
  { id: 'person-2', name: 'Ye Htet Aung', initials: 'YH', color: '#f6d7c9' },
  { id: 'person-3', name: 'Zaw Zaw Naing', initials: 'ZZ', color: '#d9def7' },
]

export function getPersonById(personId) {
  return people.find((person) => String(person.id) === String(personId))
}
