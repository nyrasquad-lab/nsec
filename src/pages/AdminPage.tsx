import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import {
  STATUS_LABELS, STATUS_COLORS, CATEGORY_LABELS, PRIORITY_LABELS, PRIORITY_COLORS,
  type Ticket, type TicketReply,
} from '../lib/types'
import {
  Settings, Search, AlertCircle, X, Clock, Mail, Phone, Tag,
  ChevronRight, Headset, RefreshCw, Inbox, CheckCircle, Loader, AlertTriangle,
} from 'lucide-react'

const STATUSES = ['open', 'in_progress', 'resolved', 'closed']

export default function AdminPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [replies, setReplies] = useState<TicketReply[]>([])
  const [newReply, setNewReply] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [updating, setUpdating] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [stats, setStats] = useState({ open: 0, in_progress: 0, resolved: 0, closed: 0, total: 0 })

  const fetchTickets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error: queryError } = await supabase
        .from('tickets')
        .select('*')
        .order('created_at', { ascending: false })

      if (queryError) throw queryError
      const rows = (data as Ticket[]) || []
      setTickets(rows)
      setStats({
        open: rows.filter((t) => t.status === 'open').length,
        in_progress: rows.filter((t) => t.status === 'in_progress').length,
        resolved: rows.filter((t) => t.status === 'resolved').length,
        closed: rows.filter((t) => t.status === 'closed').length,
        total: rows.length,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tickets.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchTickets()
  }, [fetchTickets])

  const fetchReplies = useCallback(async (ticketId: string) => {
    const { data, error: queryError } = await supabase
      .from('ticket_replies')
      .select('*')
      .eq('ticket_id', ticketId)
      .order('created_at', { ascending: true })

    if (queryError) throw queryError
    setReplies((data as TicketReply[]) || [])
  }, [])

  const openTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setNewStatus(ticket.status)
    setNewReply('')
    setUpdateError(null)
    try {
      await fetchReplies(ticket.id)
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to load replies.')
    }
  }

  const closeTicket = () => {
    setSelectedTicket(null)
    setReplies([])
    setNewReply('')
    setNewStatus('')
    setUpdateError(null)
  }

  const handleUpdate = async () => {
    if (!selectedTicket) return
    setUpdating(true)
    setUpdateError(null)

    try {
      const response = await fetch('/functions/v1/admin-update-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          ticket_id: selectedTicket.id,
          status: newStatus,
          message: newReply.trim() || null,
          status_changed: newStatus !== selectedTicket.status,
        }),
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}))
        throw new Error(errBody.error || `Request failed (${response.status})`)
      }

      const result = await response.json()

      // Update local ticket
      const updatedTicket = { ...selectedTicket, status: newStatus, updated_at: new Date().toISOString() }
      setSelectedTicket(updatedTicket)
      setTickets((prev) => prev.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)))

      // Refresh replies if a reply was added
      if (result.reply_added) {
        await fetchReplies(selectedTicket.id)
      }

      setNewReply('')
      setStats((prev) => {
        const newStats = { ...prev }
        const oldKey = selectedTicket.status as keyof typeof prev
        const newKey = newStatus as keyof typeof prev
        if (oldKey in newStats) newStats[oldKey]--
        if (newKey in newStats) newStats[newKey]++
        return newStats
      })
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update ticket.')
    } finally {
      setUpdating(false)
    }
  }

  const filtered = tickets.filter((t) => {
    const matchesFilter = filter === 'all' || t.status === filter
    const q = search.trim().toLowerCase()
    const matchesSearch = !q ||
      t.subject.toLowerCase().includes(q) ||
      t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      String(t.ticket_number).includes(q)
    return matchesFilter && matchesSearch
  })

  if (selectedTicket) {
    return (
      <TicketDetail
        ticket={selectedTicket}
        replies={replies}
        newReply={newReply}
        setNewReply={setNewReply}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        updating={updating}
        updateError={updateError}
        onUpdate={handleUpdate}
        onClose={closeTicket}
      />
    )
  }

  return (
    <div className="container fade-in">
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={26} color="var(--primary)" /> Admin Panel
          </h1>
          <p style={{ color: 'var(--neutral-500)', marginTop: '8px' }}>Manage and respond to support tickets.</p>
        </div>
        <button className="btn-secondary" onClick={fetchTickets} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        {[
          { label: 'Total', value: stats.total, icon: Inbox, color: 'var(--primary)' },
          { label: 'Open', value: stats.open, icon: AlertCircle, color: '#3b82f6' },
          { label: 'In Progress', value: stats.in_progress, icon: Loader, color: '#f59e0b' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: '#10b981' },
          { label: 'Closed', value: stats.closed, icon: CheckCircle, color: 'var(--neutral-400)' },
        ].map((s) => (
          <div key={s.label} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <s.icon size={24} color={s.color} />
            <div>
              <div style={{ fontSize: '22px', fontWeight: 700 }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--neutral-500)' }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters + search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '200px' }}>
          <Search size={16} color="var(--neutral-400)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, subject, or ticket #..."
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {['all', ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '500',
                background: filter === s ? 'var(--primary)' : 'white',
                color: filter === s ? 'white' : 'var(--neutral-600)',
                border: '1px solid',
                borderColor: filter === s ? 'var(--primary)' : 'var(--neutral-300)',
                transition: 'all 0.2s',
              }}
            >
              {s === 'all' ? 'All' : STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div style={{
          background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
          padding: '12px 16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px',
          color: 'var(--error)', fontSize: '14px',
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {/* Ticket list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px' }}>
          <span className="spinner" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px', color: 'var(--neutral-500)' }}>
          <Inbox size={40} style={{ margin: '0 auto 12px' }} />
          <p>No tickets found.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map((ticket) => (
            <div
              key={ticket.id}
              className="card"
              onClick={() => openTicket(ticket)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow)' }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)' }}
            >
              <div style={{ flexShrink: 0, width: '48px', textAlign: 'center' }}>
                <div style={{ fontSize: '11px', color: 'var(--neutral-400)' }}>#</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--neutral-700)' }}>
                  {String(ticket.ticket_number).padStart(4, '0')}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--neutral-900)' }}>{ticket.subject}</span>
                  <span className="badge" style={{ background: PRIORITY_COLORS[ticket.priority], fontSize: '11px' }}>
                    {PRIORITY_LABELS[ticket.priority]}
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--neutral-500)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span>{ticket.name}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Tag size={11} /> {CATEGORY_LABELS[ticket.category]}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={11} /> {new Date(ticket.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <span className="badge" style={{ background: STATUS_COLORS[ticket.status], flexShrink: 0 }}>
                {STATUS_LABELS[ticket.status]}
              </span>
              <ChevronRight size={20} color="var(--neutral-400)" style={{ flexShrink: 0 }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TicketDetail({
  ticket, replies, newReply, setNewReply, newStatus, setNewStatus,
  updating, updateError, onUpdate, onClose,
}: {
  ticket: Ticket
  replies: TicketReply[]
  newReply: string
  setNewReply: (v: string) => void
  newStatus: string
  setNewStatus: (v: string) => void
  updating: boolean
  updateError: string | null
  onUpdate: () => void
  onClose: () => void
}) {
  return (
    <div className="container fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      {/* Back button */}
      <button onClick={onClose} style={{
        background: 'none', border: 'none', color: 'var(--neutral-500)',
        display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', marginBottom: '20px', padding: '4px 0',
      }}>
        <X size={16} /> Close ticket
      </button>

      {/* Ticket header */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ fontSize: '13px', color: 'var(--neutral-500)', marginBottom: '4px' }}>
              Ticket #{String(ticket.ticket_number).padStart(4, '0')}
            </div>
            <h1 style={{ fontSize: '22px', fontWeight: 600 }}>{ticket.subject}</h1>
          </div>
          <span className="badge" style={{ background: STATUS_COLORS[ticket.status] }}>
            {STATUS_LABELS[ticket.status]}
          </span>
        </div>

        {/* Meta info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
          <MetaItem icon={Clock} label="Created" value={new Date(ticket.created_at).toLocaleString()} />
          <MetaItem icon={Tag} label="Category" value={CATEGORY_LABELS[ticket.category]} />
          <MetaItem icon={AlertTriangle} label="Priority" value={PRIORITY_LABELS[ticket.priority]} valueColor={PRIORITY_COLORS[ticket.priority]} />
          <MetaItem icon={Clock} label="Updated" value={new Date(ticket.updated_at).toLocaleString()} />
        </div>

        {/* Contact info */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px', fontSize: '13px' }}>
          <MetaItem icon={Mail} label="Email" value={ticket.email} />
          <MetaItem icon={Phone} label="Phone" value={ticket.phone || 'N/A'} />
        </div>

        {/* Description */}
        <div style={{
          background: 'var(--neutral-50)', borderRadius: '8px', padding: '16px',
          fontSize: '14px', color: 'var(--neutral-700)', lineHeight: 1.6,
        }}>
          {ticket.description}
        </div>
      </div>

      {/* Replies timeline */}
      <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Conversation</h3>
      {replies.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--neutral-500)', fontSize: '14px', marginBottom: '24px' }}>
          No replies yet. Respond below to start the conversation.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {replies.map((reply) => (
            <div key={reply.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {reply.author_role === 'admin' ? (
                  <Headset size={16} color="var(--primary)" />
                ) : (
                  <Mail size={16} color="var(--neutral-500)" />
                )}
                <span style={{ fontSize: '13px', fontWeight: 600, color: reply.author_role === 'admin' ? 'var(--primary)' : 'var(--neutral-600)' }}>
                  {reply.author_role === 'admin' ? 'Support Team' : ticket.name}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--neutral-400)' }}>
                  {new Date(reply.created_at).toLocaleString()}
                </span>
                {reply.status_change && (
                  <span className="badge" style={{ background: 'var(--neutral-400)', fontSize: '11px' }}>
                    {reply.status_change}
                  </span>
                )}
              </div>
              <p style={{ fontSize: '14px', color: 'var(--neutral-700)', lineHeight: 1.6 }}>{reply.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Admin reply + status update */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 600 }}>Update Ticket</h3>

        {updateError && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
            padding: '10px 14px', display: 'flex', alignItems: 'center', gap: '8px',
            color: 'var(--error)', fontSize: '13px',
          }}>
            <AlertCircle size={14} /> {updateError}
          </div>
        )}

        <div>
          <label>Change Status</label>
          <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Reply to User (optional)</label>
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Type a message to the user. They'll see it when they track their ticket. An email notification will be sent."
            rows={4}
          />
        </div>

        <button
          className="btn-primary"
          onClick={onUpdate}
          disabled={updating || (newStatus === ticket.status && !newReply.trim())}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
        >
          {updating ? <span className="spinner" /> : <Headset size={18} />}
          {updating ? 'Updating...' : 'Save Update & Notify'}
        </button>
      </div>
    </div>
  )
}

function MetaItem({ icon: Icon, label, value, valueColor }: { icon: React.ComponentType<{ size?: number | string; color?: string }>; label: string; value: string; valueColor?: string }) {
  return (
    <div>
      <div style={{ fontSize: '11px', color: 'var(--neutral-400)', marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Icon size={11} /> {label}
      </div>
      <div style={{ fontWeight: '500', color: valueColor || 'var(--neutral-700)' }}>{value}</div>
    </div>
  )
}
