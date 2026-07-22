'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LifeBuoy, LayoutDashboard, Ticket, Shield, Activity, Users, Settings,
  Search, Moon, Sun, LogOut, Menu, X, Command, ChevronRight, Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/ThemeProvider'
import { EDGE_FUNCTION_URL } from '@/lib/api'
import type { Admin } from '@/lib/types'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/tickets', label: 'Tickets', icon: Ticket },
  { href: '/admin/security', label: 'Security Center', icon: Shield },
  { href: '/admin/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
]

const COMMAND_ITEMS = [
  ...NAV_ITEMS,
  { href: '/admin/audit', label: 'Audit Logs', icon: ChevronRight },
  { href: '/', label: 'Back to Site', icon: ChevronRight },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, toggle } = useTheme()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAdmin = useCallback(async () => {
    const token = getCookie('admin_session')
    if (!token) { router.push('/login'); return }
    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/admin-me`, { headers: { 'X-Admin-Token': token } })
      if (!res.ok) { router.push('/login'); return }
      const data = await res.json()
      setAdmin(data.admin)
    } catch {
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchAdmin() }, [fetchAdmin])

  // Keyboard shortcut for command palette
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setPaletteOpen((v) => !v)
      }
      if (e.key === 'Escape') setPaletteOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const handleLogout = async () => {
    const token = getCookie('admin_session')
    try {
      await fetch(`${EDGE_FUNCTION_URL}/admin-logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
    } catch { /* ignore */ }
    document.cookie = 'admin_session=; path=/; max-age=0'
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-500/30 border-t-brand-500" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar - desktop */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-64 transform border-r border-slate-200 bg-white transition-transform dark:border-slate-700 dark:bg-slate-800 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-6 dark:border-slate-700">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-cyan-400">
            <LifeBuoy size={16} className="text-white" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">Support Hub</span>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  active ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
                         : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700/50'
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-4 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
              {admin?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-slate-900 dark:text-white">{admin?.name}</div>
              <div className="truncate text-xs text-slate-500 dark:text-slate-400">{admin?.email}</div>
            </div>
            <button onClick={handleLogout} className="text-slate-400 transition-colors hover:text-red-500" aria-label="Logout">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/80 px-4 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-500" aria-label="Open menu">
              <Menu size={22} />
            </button>
            <button onClick={() => setPaletteOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-400 transition-all hover:border-slate-300 dark:border-slate-600 dark:bg-slate-700/50 dark:hover:border-slate-500">
              <Search size={15} />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden rounded border border-slate-300 px-1.5 py-0.5 text-xs dark:border-slate-600 sm:inline-block">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={toggle} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700" aria-label="Notifications">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 animate-fade-in">{children}</main>
      </div>

      {/* Command palette */}
      {paletteOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => setPaletteOpen(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          <div className="relative w-full max-w-lg rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-700 dark:bg-slate-800 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 border-b border-slate-200 px-3 py-2.5 dark:border-slate-700">
              <Command size={16} className="text-slate-400" />
              <input
                type="text" placeholder="Type a command or search..." autoFocus
                className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
                onKeyDown={(e) => { if (e.key === 'Escape') setPaletteOpen(false) }}
              />
              <kbd className="rounded border border-slate-300 px-1.5 py-0.5 text-xs dark:border-slate-600">ESC</kbd>
            </div>
            <div className="py-2">
              {COMMAND_ITEMS.map((item) => (
                <button key={item.href} onClick={() => { router.push(item.href); setPaletteOpen(false) }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700">
                  <item.icon size={16} className="text-slate-400" />
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}
