/* eslint-disable no-undef */
import fs from 'node:fs'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

const output = new URL('./team-learning-guide.pdf', import.meta.url)
const pdf = await PDFDocument.create()
const regular = await pdf.embedFont(StandardFonts.Helvetica)
const bold = await pdf.embedFont(StandardFonts.HelveticaBold)
const W = 595.28
const H = 841.89
const colors = {
  ink: rgb(0.125, 0.2, 0.18),
  muted: rgb(0.35, 0.41, 0.39),
  green: rgb(0.13, 0.30, 0.25),
  mint: rgb(0.86, 0.94, 0.90),
  blue: rgb(0.86, 0.91, 0.98),
  gold: rgb(1, 0.94, 0.78),
  lilac: rgb(0.93, 0.89, 0.97),
  coral: rgb(0.98, 0.88, 0.84),
  paper: rgb(0.97, 0.98, 0.96),
  white: rgb(1, 1, 1),
  line: rgb(0.78, 0.83, 0.80),
}

const pages = [
  ['Understanding Our React Application', 'A team guide for understanding, presenting, testing, and confidently maintaining the work in our Kanban Board.', ['3 board stages', '5 live dashboard metrics', '3 responsible people'], 'Kanban Board / Dashboard / Storage'],
  ['What does our application do?', 'It gives a team one place to organize tasks, move work through a three-stage workflow, and review progress from live data.', ['Kanban Board: TO DO, DOING, DONE', 'Dashboard: five metrics and three charts', 'Required: CRUD, assignment, dates, persistence'], 'Product areas and required behavior'],
  ['How does task data move?', 'A single shared context keeps the Board and Dashboard synchronized.', ['Local Storage reads saved data', 'Hydration repairs and normalizes fields', 'TaskContext shares state with pages', 'Calculations create metrics and charts'], 'main.jsx -> App.jsx -> pages -> context -> utilities'],
  ['Lazy-loaded Dashboard', 'The Dashboard bundle is requested when its route is opened.', ['Optional performance feature', 'React lazy loads DashboardPage', 'Suspense displays a loading fallback', 'The /dashboard route stays unchanged'], 'Keep it when the team can explain code splitting; simplify it when the smallest codebase matters.'],
  ['Keyboard focus management', 'Because React changes screens without a full document refresh, focus is deliberately returned to meaningful content.', ['Route focus: App.jsx focuses the new H1', 'MutationObserver waits for lazy content', 'Task movement returns focus to the moved card', 'Live regions announce status changes'], 'requestAnimationFrame / MutationObserver / tabindex="-1"'],
  ['Accessible task editing', 'The create and edit form behaves like a keyboard-friendly dialog.', ['Initial title focus', 'Escape closes the dialog', 'Tab and Shift+Tab wrap inside it', 'Invalid fields receive focus', 'Focus returns to the opener'], 'Test: open task, press Shift+Tab, submit invalid data, press Escape.'],
  ['Defensive Local Storage validation', 'Browser storage can be missing, old, malformed, or manually edited. The app repairs data before trusting it.', ['storage.js safely reads and writes JSON', 'taskHydration.js sanitizes IDs, dates, fields, and status', 'Invalid arrays use fallback data', 'Completion dates stay consistent with DONE'], 'Keep safe parsing and valid-array checks; they protect required persistence.'],
  ['Required behavior to explain', 'The visual interface is backed by small, testable rules.', ['Entering DONE records today as completeDate', 'Leaving DONE clears completeDate', 'Overdue means due date passed and status is not DONE', 'Dashboard derives all values from current tasks'], 'Lihout Van / Ye Htet Aung / Zaw Zaw Naing'],
  ['Responsive custom CSS', 'The stylesheet provides the visual system and responsive behavior for both pages.', ['Shared variables, Grid, and Flexbox', 'Visible focus rings and readable contrast', 'Desktop, tablet, and mobile breakpoints', 'Reduced-motion support and responsive board scrolling'], 'npm test / npm run lint / npm run build / npm run dev'],
  ['Can we present the project confidently?', 'Every member should demonstrate the workflow and explain the data flow in their own words.', ['Trace Local Storage to TaskContext, pages, cards, and charts', 'Create, edit, delete, assign, search, filter, and move a task', 'Add a category, refresh, and confirm it remains', 'Explain one optional feature and one required behavior'], 'Trace the flow. Test together. Present honestly.'],
]

function wrap(text, font, size, maxWidth) {
  const words = text.split(/\s+/)
  const lines = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line)
      line = word
    } else line = candidate
  }
  if (line) lines.push(line)
  return lines
}

function text(page, value, x, y, size, font = regular, color = colors.ink, maxWidth = 0) {
  const lines = maxWidth ? wrap(value, font, size, maxWidth) : [value]
  lines.forEach((line, index) => page.drawText(line, { x, y: y - index * (size + 4), size, font, color }))
  return y - lines.length * (size + 4)
}

function box(page, x, y, width, height, fill, title, body) {
  page.drawRectangle({ x, y: y - height, width, height, color: fill, borderColor: colors.line, borderWidth: 0.8 })
  text(page, title.toUpperCase(), x + 14, y - 23, 11, bold, colors.green, width - 28)
  text(page, body, x + 14, y - 47, 10.5, regular, colors.ink, width - 28)
}

pages.forEach(([title, intro, items, footer], index) => {
  const page = pdf.addPage([W, H])
  const cover = index === 0
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: cover ? colors.green : colors.paper })
  page.drawCircle({ x: cover ? W - 20 : W - 10, y: H + 10, size: 125, color: cover ? rgb(0.17, 0.36, 0.31) : rgb(0.91, 0.94, 0.91) })
  const ink = cover ? colors.white : colors.ink
  const muted = cover ? rgb(0.86, 0.93, 0.90) : colors.muted
  text(page, `PROJECT 1 / KANBAN BOARD WITH DASHBOARD`, 43, H - 48, 10, bold, cover ? colors.mint : colors.green, 500)
  text(page, title, 43, H - 92, cover ? 31 : 27, bold, ink, 500)
  text(page, intro, 43, H - (cover ? 195 : 155), cover ? 15 : 13, regular, muted, 500)
  if (cover) {
    items.forEach((item, i) => {
      const x = 43 + i * 170
      page.drawRectangle({ x, y: 450, width: 170, height: 105, color: rgb(0.16, 0.34, 0.29), borderColor: rgb(0.35, 0.48, 0.43), borderWidth: 0.7 })
      text(page, item.split(' ')[0], x + 14, 520, 28, bold, colors.white)
      text(page, item.slice(item.indexOf(' ') + 1), x + 14, 478, 10, regular, colors.white, 140)
    })
    box(page, 43, 390, 510, 70, colors.white, 'Team guide', footer)
  } else {
    box(page, 43, H - 210, 510, 88, index % 3 === 0 ? colors.mint : index % 3 === 1 ? colors.blue : colors.gold, 'In plain English', intro)
    text(page, 'What the team should know', 43, H - 350, 17, bold, colors.ink)
    items.forEach((item, i) => {
      const y = H - 385 - i * 55
      page.drawRectangle({ x: 43, y: y - 35, width: 510, height: 43, color: i % 2 ? colors.white : rgb(0.94, 0.96, 0.94), borderColor: colors.line, borderWidth: 0.5 })
      text(page, `${String(i + 1).padStart(2, '0')}  ${item}`, 57, y - 18, 11, regular, colors.ink, 480)
    })
    const noteY = 190
    box(page, 43, noteY, 510, 90, index % 2 ? colors.lilac : colors.mint, 'Presentation answer', footer)
  }
  page.drawLine({ start: { x: 43, y: 47 }, end: { x: 553, y: 47 }, thickness: 0.7, color: cover ? rgb(0.32, 0.46, 0.41) : colors.line })
  text(page, 'Understand it. Test it. Explain it in your own words.', 43, 28, 8.5, regular, cover ? colors.mint : colors.muted)
  text(page, `PAGE ${index + 1}`, 510, 28, 8.5, regular, cover ? colors.mint : colors.muted)
})

fs.writeFileSync(output, await pdf.save())
console.log(`Created ${output.pathname}`)
