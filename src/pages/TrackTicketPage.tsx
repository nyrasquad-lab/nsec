import { useState } from 'react'
import { supabase } from '../lib/supabase'
import {
  STATUS_LABELS, STATUS_COLORS, CATEGORY_LABELS, PRIORITY_LABELS, PRIORITY_COLORS,
  type Ticket, type TicketReply,
} from '../lib/types'
import { Search, AlertCircle, Clock, User, Headset } from 'lucide-react'

export default function TrackTicketPage() {
  const [ticketNumber, setTicketNumber] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [replies, setReplies] = useState<TicketReply[]>([])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setTicket(null)
    setReplies([])

    const num = parseInt(ticketNumber.trim(), 10)
    if (!num || !email.trim()) {
      setError('Please enter both your ticket number and email.')
      return
    }

    setLoading(true)
    try {
      const { data, error: queryError } = await supabase
        .from('tickets')
        .select('*')
        .eq('ticket_number', num)
        .eq('email', email.trim().toLowerCase())
        .maybeSingle()

      if (queryError) throw queryError
      if (!data) {
        setError('No ticket found with that number and email. Please double-check and try again.')
        return
      }

      setTicket(data as Ticket)

      const { data: replyData, error: replyError } = await supabase
        .from('ticket_replies')
        .select('*')
        .eq('ticket_id', (data as Ticket).id)
        .order('created_at', { ascending: true })

      if (replyError) throw replyError
      setReplies((replyData as TicketReply[]) || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Search size={26} color="var(--primary)" /> Track Your Ticket
        </h1>
        <p style={{ color: 'var(--neutral-500)', marginTop: '8px' }}>
          Enter your ticket number and email to check the current status and any updates.
        </p>
      </div>

      <form onSubmit={handleSearch} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label>Ticket Number *</label>
            <input
              type="text"
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              placeholder="e.g. 42"
            />
          </div>
          <div>
            <label>Email *</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
            />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {loading ? <span className="spinner" /> : <Search size={18} />}
          {loading ? 'Searching...' : 'Find Ticket'}
        </button>
      </form>

      {error && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--error)',
          fontSize: '14px',
        }}>
          <AlertCircle size={16} /> {error}
        </div>
      )}

      {ticket && (
        <div className="fade-in">
          {/* Ticket summary */}
          <div className="card" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <div style={{ fontSize: '14px', color: 'var(--neutral-500)', marginBottom: '4px' }}>
                  Ticket #{String(ticket.ticket_number).padStart(4, '0')}
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 600 }}>{ticket.subject}</h2>
              </div>
              <span className="badge" style={{ background: STATUS_COLORS[ticket.status] }}>
                {STATUS_LABELS[ticket.status]}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--neutral-500)', marginBottom: '16px' }}>
              <span>Category: <strong style={{ color: 'var(--neutral-700)' }}>{CATEGORY_LABELS[ticket.category]}</strong></span>
              <span>Priority: <strong style={{ color: PRIORITY_COLORS[ticket.priority] }}>{PRIORITY_LABELS[ticket.priority]}</strong></span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} /> {new Date(ticket.created_at).toLocaleDateString()}
              </span>
            </div>

            <div style={{
              background: 'var(--neutral-50)',
              borderRadius: '8px',
              padding: '16px',
              fontSize: '14px',
              color: 'var(--neutral-700)',
              lineHeight: 1.6,
            }}>
              {ticket.description}
            </div>
          </div>

          {/* Replies / timeline */}
          <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px' }}>Updates & Replies</h3>
          {replies.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', color: 'var(--neutral-500)', fontSize: '14px' }}>
              No updates yet. Our team is reviewing your ticket.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {replies.map((reply) => (
                <div key={reply.id} className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    {reply.author_role === 'admin' ? (
                      <Headset size={16} color="var(--primary)" />
                    ) : (
                      <User size={16} color="var(--neutral-500)" />
                    )}
                    <span style={{ fontSize: '13px', fontWeight: 600, color: reply.author_role === 'admin' ? 'var(--primary)' : 'var(--neutral-600)' }}>
                      {reply.author_role === 'admin' ? 'Support Team' : 'You'}
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
        </div>
      )}
    </div>
  )
}
