import { CalendarDays, Columns3, LayoutDashboard } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigationItems = [
  { to: '/kanban', label: 'Kanban', icon: Columns3 },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
]

function formatToday() {
  return new Intl.DateTimeFormat('en', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date())
}

function Navbar() {
  return (
    <header className="topbar">
      <div className="topbar__inner">
        <NavLink className="brand" to="/kanban" aria-label="Flowboard home">
          <span className="brand__mark" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <span className="brand__copy">
            <strong>flowboard</strong>
            <small>team workspace</small>
          </span>
        </NavLink>

        <nav className="primary-nav" aria-label="Primary navigation">
          {navigationItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `primary-nav__link${isActive ? ' is-active' : ''}`
              }
            >
              <Icon size={17} strokeWidth={2} aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="topbar__meta">
          <div className="today-chip">
            <CalendarDays size={16} aria-hidden="true" />
            <span>{formatToday()}</span>
          </div>
          <div className="team-avatar" aria-label="Team workspace">
            FB
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
