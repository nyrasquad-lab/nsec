'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase-client'
import { EDGE_FUNCTION_URL } from '@/lib/api'
import { STATUS_LABELS, STATUS_COLORS, PRIORITY_COLORS, PRIORITY_LABELS, type Ticket, type Admin } from '@/lib/types'
import { Ticket as TicketIcon, Clock, CheckCircle, AlertCircle, TrendingUp, Activity, ArrowRight } from 'lucide-react'
import { cn, timeAgo } from '@/lib/utils'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ open: 0, in_progress: 0, resolved: 0, closed: 0, total: 0 })
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false })
      const tickets = (data as Ticket[]) || []
      setStats({
        open: tickets.filter(t => t.status === 'open').length,
        in_progress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length,
        total: tickets.length,
      })
      setRecentTickets(tickets.slice(0, 5))
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const cards = [
    { label: 'Total Tickets', value: stats.total, icon: TicketIcon, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/30' },
    { label: 'Open', value: stats.open, icon: AlertCircle, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/30' },
    { label: 'In Progress', value: stats.in_progress, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Overview of your support system</p>
      </div>

      {/* Analytics cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-28" />)
        ) : (
          cards.map((card) => (
            <div key={card.label} className="card p-5 animate-slide-up">
              <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg', card.bg)}>
                <card.icon size={20} className={card.color} />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{card.value}</div>
              <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{card.label}</div>
            </div>
          ))
        )}
      </div>

      {/* Recent activity + quick stats */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent tickets */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-slate-700">
              <h2 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white">
                <Activity size={18} className="text-brand-500" /> Recent Tickets
              </h2>
              <Link href="/admin/tickets" className="flex items-center gap-1 text-sm text-brand-500 hover:text-brand-600">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {loading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton h-16" />)}
              </div>
            ) : recentTickets.length === 0 ? (
              <div className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">No tickets yet.</div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {recentTickets.map((ticket) => (
                  <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`} className="flex items-center gap-4 p-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <div className="flex-shrink-0 text-center">
                      <div className="text-xs text-slate-400">#</div>
                      <div className="text-sm font-bold text-slate-700 dark:text-slate-300">{String(ticket.ticket_number).padStart(4, '0')}</div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-900 dark:text-white">{ticket.subject}</div>
                      <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{ticket.name} · {timeAgo(ticket.created_at)}</div>
                    </div>
                    <span className={cn('badge flex-shrink-0', STATUS_COLORS[ticket.status])}>{STATUS_LABELS[ticket.status]}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white">
              <TrendingUp size={16} className="text-brand-500" /> Resolution Rate
            </h3>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.total > 0 ? Math.round(((stats.resolved + stats.closed) / stats.total) * 100) : 0}%
              </span>
              <span className="mb-1 text-xs text-slate-500 dark:text-slate-400">{stats.resolved + stats.closed} of {stats.total}</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
              <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${stats.total > 0 ? ((stats.resolved + stats.closed) / stats.total) * 100 : 0}%` }} />
            </div>
          </div>

          <div className="card p-5">
            <h3 className="mb-4 text-sm font-semibold text-slate-900 dark:text-white">Priority Breakdown</h3>
            <div className="space-y-2">
              {(['urgent', 'high', 'medium', 'low'] as const).map((p) => {
                const count = recentTickets.filter(t => t.priority === p).length
                return (
                  <div key={p} className="flex items-center justify-between text-sm">
                    <span className={cn('badge', PRIORITY_COLORS[p])}>{PRIORITY_LABELS[p]}</span>
                    <span className="text-slate-500 dark:text-slate-400">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
