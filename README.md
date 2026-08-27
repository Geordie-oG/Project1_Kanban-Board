# Kanban Board with Dashboard

A responsive team-workflow application built with React. Plan work on a three-stage Kanban board, keep task details in one place, and turn the same live data into a visual progress dashboard—all without a backend or account.

[**Live Demo**](https://geordie-og.github.io/Project1_Kanban-Board/) · [**Source Code**](https://github.com/Geordie-oG/Project1_Kanban-Board)

## Project Overview

The application combines day-to-day task management with lightweight delivery analytics. Team members can create and assign tasks, move them from **TO DO** to **DOING** to **DONE**, and immediately see the effect on completion, workload, overdue, category, and performance metrics.

Data is shared between both pages through React Context and saved to the browser's Local Storage. A first visit starts with realistic sample tasks, so the board and dashboard can be explored immediately.

## Screenshots

### Kanban workspace

Create, filter, assign, edit, and move work across the complete three-stage workflow.

![Kanban Board desktop view](docs/screenshots/kanban-board.png)

### Live dashboard

Review status totals, completion progress, delivery performance, and the category work mix.

![Dashboard desktop view](docs/screenshots/dashboard.png)

### Responsive mobile board

<p align="center">
  <img src="docs/screenshots/mobile-view.png" alt="Responsive Kanban Board mobile view" width="360">
</p>

## Highlights

### Kanban Board

- Create, edit, and delete tasks with a confirmation step for destructive actions
- Move work forward or backward through **TO DO**, **DOING**, and **DONE**
- Record completion dates automatically when work enters **DONE**
- Assign a responsible person, category, description, start date, and due date
- Add reusable custom categories directly from the task form
- Search titles and descriptions, filter by category, and see the visible task count
- Highlight overdue unfinished work and show overall completion progress

### Dashboard

- Live totals for all tasks, TO DO, DOING, DONE, and overdue work
- Doughnut chart for status distribution
- Category chart for the team's work mix
- Performance chart comparing early, on-time, and late completions
- Metrics derived from the same task state as the Kanban board

### User Experience

- Responsive desktop, tablet, and mobile layouts
- Keyboard-accessible navigation, dialogs, task movement, and focus states
- Accessible labels, live movement announcements, and reduced-motion support
- Useful empty states and seven ready-to-use demonstration tasks on first launch

## Tech Stack

| Area | Technology |
| --- | --- |
| Interface | React 19, custom CSS |
| Build tooling | Vite 8 |
| Routing | React Router 7 with hash-based routes |
| Charts | Recharts 3 |
| Icons | Lucide React |
| State and persistence | React Context, Browser Local Storage |
| Quality checks | Node.js test runner, ESLint |
| Delivery | GitHub Actions, GitHub Pages |

## Getting Started

### Prerequisites

- Node.js `20.19.0` or newer
- npm

No backend, database, environment variables, or external services are required.

### Run locally

```bash
git clone https://github.com/Geordie-oG/Project1_Kanban-Board.git
cd Project1_Kanban-Board
npm ci
npm run dev
```

Open the URL printed by Vite. The application routes are:

- `#/kanban` — task board
- `#/dashboard` — progress dashboard

### Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create an optimized production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run calculation and data-hydration unit tests |
| `npm run lint` | Check the project with ESLint |

## How It Works

`TaskProvider` is the application's single source of truth for tasks and categories. Both routes consume that shared state:

```text
Kanban Board ──> Task Context <──> Local Storage
                       │
                       └──> Dashboard calculations ──> Summary cards and charts
```

- **Task lifecycle:** CRUD and movement operations update the shared task array. Moving a task into **DONE** records today's date; moving it out clears that completion date.
- **Persistence:** Tasks and categories are restored at startup and saved after every change. Stored values are normalized before reaching the interface.
- **Analytics:** Pure calculation helpers derive totals and chart data from the current tasks. Overdue work is unfinished work whose due date has passed.
- **Sample state:** New visitors receive seven tasks across all statuses, categories, and completion outcomes so every main feature has meaningful data.

Local data is stored under these keys:

| Key | Value |
| --- | --- |
| `kanban_tasks_v1` | Task records |
| `kanban_categories_v1` | Reusable category names |

Remove both keys from the site's Local Storage to reset the application to its demonstration data.

## Project Structure

```text
src/
├── components/       Reusable board, form, card, navigation, and chart UI
├── context/          Shared task state, CRUD actions, and persistence effects
├── data/             Sample tasks, categories, and team members
├── pages/            Kanban and dashboard routes
├── utils/            Storage, hydration, and analytics helpers
├── App.jsx            Route layout and focus management
├── dashboard-ui.css   Dashboard-specific responsive styling
└── styles.css         Shared design system and board styling
```

The dashboard route is lazy-loaded. `HashRouter` and relative Vite asset paths keep both routes refresh-safe when the project is hosted below a GitHub Pages repository path.

## Testing and Deployment

The unit suite covers status normalization, task totals, overdue rules, chart calculations, category handling, and stored-data hydration. Every push to `main` runs the tests and linter, creates the production build, and deploys `dist/` through GitHub Actions to [GitHub Pages](https://geordie-og.github.io/Project1_Kanban-Board/).

## Team Members

- Lihout Van
- Ye Htet Aung
- Zaw Zaw Naing
