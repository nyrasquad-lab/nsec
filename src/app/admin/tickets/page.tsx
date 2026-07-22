'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase-client'
import {
  STATUS_LABELS, STATUS_COLORS, CATEGORY_LABELS, PRIORITY_LABELS, PRIORITY_COLORS,
  type Ticket, type TicketReply,
} from '@/lib/types'
import {
  Search, RefreshCw, Inbox, ChevronRight, X, Clock, Mail, Phone, Tag,
  Headset, AlertCircle, AlertTriangle,
} from 'lucide-react'
import { cn, formatDateTime } from '@/lib/utils'
import { EDGE_FUNCTION_URL } from '@/lib/api'

const STATUSES = ['open', 'in_progress', 'resolved', 'closed']

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Ticket | null>(null)

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('tickets').select('*').order('created_at', { ascending: false })
    setTickets((data as Ticket[]) || [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchTickets() }, [fetchTickets])

  const filtered = tickets.filter(t => {
    const matchesFilter = filter === 'all' || t.status === filter
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || t.subject.toLowerCase().includes(q) || t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || String(t.ticket_number).includes(q)
    return matchesFilter && matchesSearch
  })

  if (selected) {
    return <TicketDetail ticket={selected} onClose={() => setSelected(null)} onUpdate={fetchTickets} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tickets</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage and respond to support tickets</p>
        </div>
        <button onClick={fetchTickets} className="btn-secondary"><RefreshCw size={16} /> Refresh</button>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input className="input pl-10" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, subject, or ticket #..." />
        </div>
        <div className="flex flex-wrap gap-1">
          {['all', ...STATUSES].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={cn('rounded-lg border px-3 py-1.5 text-sm font-medium transition-all',
                filter === s ? 'border-brand-500 bg-brand-500 text-white' : 'border-slate-300 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700')}>
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton h-20" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="card flex flex-col items-center p-12 text-slate-500 dark:text-slate-400">
          <Inbox size={40} className="mb-3" />
          <p>No tickets found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(ticket => (
            <div key={ticket.id} onClick={() => setSelected(ticket)}
              className="card flex cursor-pointer items-center gap-4 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex-shrink-0 text-center">
                <div className="text-xs text-slate-400">#</div>
                <div className="text-base font-bold text-slate-700 dark:text-slate-300">{String(ticket.ticket_number).padStart(4, '0')}</div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-semibold text-slate-900 dark:text-white">{ticket.subject}</span>
                  <span className={cn('badge flex-shrink-0', PRIORITY_COLORS[ticket.priority])}>{PRIORITY_LABELS[ticket.priority]}</span>
                </div>
                <div className="mt-1 flex gap-3 text-xs text-slate-500 dark:text-slate-400">
                  <span>{ticket.name}</span>
                  <span className="flex items-center gap-1"><Tag size={10} /> {CATEGORY_LABELS[ticket.category]}</span>
                  <span className="flex items-center gap-1"><Clock size={10} /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                </div>
              </div>
              <span className={cn('badge flex-shrink-0', STATUS_COLORS[ticket.status])}>{STATUS_LABELS[ticket.status]}</span>
              <ChevronRight size={18} className="flex-shrink-0 text-slate-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TicketDetail({ ticket, onClose, onUpdate }: { ticket: Ticket; onClose: () => void; onUpdate: () => void }) {
  const [replies, setReplies] = useState<TicketReply[]>([])
  const [newReply, setNewReply] = useState('')
  const [newStatus, setNewStatus] = useState(ticket.status)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('ticket_replies').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true })
      .then(({ data }) => setReplies((data as TicketReply[]) || []))
  }, [ticket.id])

  const handleUpdate = async () => {
    setUpdating(true); setError(null)
    try {
      const token = getCookie('admin_session')
      const response = await fetch(`${EDGE_FUNCTION_URL}/admin-update-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { 'X-Admin-Token': token } : {}) },
        body: JSON.stringify({ ticket_id: ticket.id, status: newStatus, message: newReply.trim() || null, status_changed: newStatus !== ticket.status }),
      })
      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Update failed' }))
        throw new Error(err.error || 'Update failed')
      }
      setNewReply('')
      const { data } = await supabase.from('ticket_replies').select('*').eq('ticket_id', ticket.id).order('created_at', { ascending: true })
      setReplies((data as TicketReply[]) || [])
      onUpdate()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed.')
    } finally { setUpdating(false) }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button onClick={onClose} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
        <X size={16} /> Close ticket
      </button>

      <div className="card p-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="mb-1 text-sm text-slate-500 dark:text-slate-400">Ticket #{String(ticket.ticket_number).padStart(4, '0')}</div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-white">{ticket.subject}</h1>
          </div>
          <span className={cn('badge', STATUS_COLORS[ticket.status])}>{STATUS_LABELS[ticket.status]}</span>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <Meta icon={Clock} label="Created" value={formatDateTime(ticket.created_at)} />
          <Meta icon={Tag} label="Category" value={CATEGORY_LABELS[ticket.category]} />
          <Meta icon={AlertTriangle} label="Priority" value={PRIORITY_LABELS[ticket.priority]} />
          <Meta icon={Clock} label="Updated" value={formatDateTime(ticket.updated_at)} />
        </div>
        <div className="mb-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
          <Meta icon={Mail} label="Email" value={ticket.email} />
          <Meta icon={Phone} label="Phone" value={ticket.phone || 'N/A'} />
        </div>
        <div className="rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-900/50 dark:text-slate-300">{ticket.description}</div>
      </div>

      <div>
        <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">Conversation</h3>
        {replies.length === 0 ? (
          <div className="card mb-4 p-6 text-center text-sm text-slate-500 dark:text-slate-400">No replies yet.</div>
        ) : (
          <div className="space-y-3">
            {replies.map(reply => (
              <div key={reply.id} className="card p-4">
                <div className="mb-2 flex items-center gap-2">
                  {reply.author_role === 'admin' ? <Headset size={16} className="text-brand-500" /> : <Mail size={16} className="text-slate-400" />}
                  <span className={cn('text-sm font-semibold', reply.author_role === 'admin' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400')}>
                    {reply.author_role === 'admin' ? 'Support Team' : ticket.name}
                  </span>
                  <span className="text-xs text-slate-400">{formatDateTime(reply.created_at)}</span>
                  {reply.status_change && <span className="badge bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300">{reply.status_change}</span>}
                </div>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{reply.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="card space-y-4 p-6">
        <h3 className="text-base font-semibold text-slate-900 dark:text-white">Update Ticket</h3>
        {error && <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"><AlertCircle size={14} /> {error}</div>}
        <div>
          <label className="label">Change Status</label>
          <select className="input" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Reply to User (optional)</label>
          <textarea className="input" value={newReply} onChange={(e) => setNewReply(e.target.value)} placeholder="Type a message..." rows={4} />
        </div>
        <button className="btn-primary" onClick={handleUpdate} disabled={updating || (newStatus === ticket.status && !newReply.trim())}>
          {updating ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Headset size={18} />}
          {updating ? 'Updating...' : 'Save Update & Notify'}
        </button>
      </div>
    </div>
  )
}

function Meta({ icon: Icon, label, value }: { icon: React.ComponentType<any>; label: string; value: string }) {
  return (
    <div>
      <div className="mb-0.5 flex items-center gap-1 text-xs text-slate-400"><Icon size={11} /> {label}</div>
      <div className="font-medium text-slate-700 dark:text-slate-300">{value}</div>
    </div>
  )
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}
