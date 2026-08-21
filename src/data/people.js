// Replace this demo list with the responsible-person data provided by your instructor.
export const people = [
  { id: 'person-1', name: 'Avery Morgan', initials: 'AM', color: '#cfe8df' },
  { id: 'person-2', name: 'Kai Rivera', initials: 'KR', color: '#f6d7c9' },
  { id: 'person-3', name: 'Mina Patel', initials: 'MP', color: '#d9def7' },
  { id: 'person-4', name: 'Leo Anders', initials: 'LA', color: '#f4e3ad' },
]

export function getPersonById(personId) {
  return people.find((person) => String(person.id) === String(personId))
}
