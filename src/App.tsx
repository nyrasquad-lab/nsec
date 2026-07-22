import { Routes, Route, NavLink } from 'react-router-dom'
import { LifeBuoy, Home, PlusCircle, Search, Settings } from 'lucide-react'
import HomePage from './pages/HomePage'
import CreateTicketPage from './pages/CreateTicketPage'
import TrackTicketPage from './pages/TrackTicketPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        background: 'white',
        borderBottom: '1px solid var(--neutral-200)',
        padding: '16px 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-sm)',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--neutral-900)' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <LifeBuoy size={20} color="white" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 700, letterSpacing: '-0.3px' }}>IT Support Hub</span>
          </NavLink>

          <div style={{ display: 'flex', gap: '4px' }}>
            <NavLink to="/" end style={navLinkStyle}>
              <Home size={16} /> Home
            </NavLink>
            <NavLink to="/create" style={navLinkStyle}>
              <PlusCircle size={16} /> Create Ticket
            </NavLink>
            <NavLink to="/track" style={navLinkStyle}>
              <Search size={16} /> Track Ticket
            </NavLink>
            <NavLink to="/admin" style={navLinkStyle}>
              <Settings size={16} /> Admin
            </NavLink>
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '32px 0 64px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/create" element={<CreateTicketPage />} />
          <Route path="/track" element={<TrackTicketPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      <footer style={{
        background: 'var(--neutral-900)',
        color: 'var(--neutral-400)',
        textAlign: 'center',
        padding: '24px',
        fontSize: '14px',
      }}>
        IT Support Hub &copy; 2025 &mdash; Reliable tech help, one ticket at a time.
      </footer>
    </div>
  )
}

function navLinkStyle({ isActive }: { isActive: boolean }): React.CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    color: isActive ? 'var(--primary)' : 'var(--neutral-600)',
    background: isActive ? 'var(--primary-light)' : 'transparent',
    transition: 'all 0.2s',
  }
}
