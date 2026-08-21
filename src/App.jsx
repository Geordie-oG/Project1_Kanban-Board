import { lazy, Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import KanbanPage from './pages/KanbanPage.jsx'

const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))

function RouteLoader() {
  return (
    <div className="route-loader" role="status">
      <span aria-hidden="true" />
      <p>Preparing your dashboard…</p>
    </div>
  )
}

function RouteFocusManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 })
    const mainContent = document.querySelector('#main-content')
    let observer

    function focusHeading() {
      const heading = document.querySelector('#main-content h1')
      if (heading) {
        heading.setAttribute('tabindex', '-1')
        heading.focus()
        observer?.disconnect()
        return true
      }
      return false
    }

    const focusFrame = window.requestAnimationFrame(() => {
      if (!focusHeading() && mainContent) {
        observer = new MutationObserver(focusHeading)
        observer.observe(mainContent, { childList: true, subtree: true })
      }
    })

    return () => {
      window.cancelAnimationFrame(focusFrame)
      observer?.disconnect()
    }
  }, [pathname])

  return null
}

function App() {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Navbar />
      <main id="main-content" className="page-shell">
        <RouteFocusManager />
        <Suspense fallback={<RouteLoader />}>
          <Routes>
            <Route path="/" element={<Navigate to="/kanban" replace />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/kanban" replace />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App
