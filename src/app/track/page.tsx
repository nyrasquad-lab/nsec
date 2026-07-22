'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import {
  STATUS_LABELS, STATUS_COLORS, CATEGORY_LABELS, PRIORITY_LABELS, PRIORITY_COLORS,
  type Ticket, type TicketReply,
} from '@/lib/types'
import { Search, AlertCircle, Clock, User, Headset } from 'lucide-react'
import { PublicNav } from '@/components/PublicNav'
import { cn, formatDateTime } from '@/lib/utils'

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
    if (!num || !email.trim()) { setError('Please enter both your ticket number and email.'); return }

    setLoading(true)
    try {
      const { data, error: queryError } = await supabase
        .from('tickets').select('*')
        .eq('ticket_number', num).eq('email', email.trim().toLowerCase()).maybeSingle()

      if (queryError) throw queryError
      if (!data) { setError('No ticket found with that number and email.'); return }

      setTicket(data as Ticket)
      const { data: replyData } = await supabase
        .from('ticket_replies').select('*')
        .eq('ticket_id', (data as Ticket).id).order('created_at', { ascending: true })
      setReplies((replyData as TicketReply[]) || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen">
      <PublicNav />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <h1 className="flex items-center gap-2.5 text-3xl font-bold">
            <Search size={26} className="text-brand-500" /> Track Your Ticket
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Enter your ticket number and email to check the current status and any updates.</p>
        </div>

        <form onSubmit={handleSearch} className="card mb-8 flex flex-col gap-5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Ticket Number *</label>
              <input className="input" type="text" value={ticketNumber} onChange={(e) => setTicketNumber(e.target.value)} placeholder="e.g. 42" />
            </div>
            <div>
              <label className="label">Email *</label>
              <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
            </div>
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <Search size={18} />}
            {loading ? 'Searching...' : 'Find Ticket'}
          </button>
        </form>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {ticket && (
          <div className="animate-fade-in">
            <div className="card mb-6 p-6">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="mb-1 text-sm text-slate-500 dark:text-slate-400">Ticket #{String(ticket.ticket_number).padStart(4, '0')}</div>
                  <h2 className="text-xl font-semibold">{ticket.subject}</h2>
                </div>
                <span className={cn('badge', STATUS_COLORS[ticket.status])}>{STATUS_LABELS[ticket.status]}</span>
              </div>
              <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-500 dark:text-slate-400">
                <span>Category: <strong className="text-slate-700 dark:text-slate-300">{CATEGORY_LABELS[ticket.category]}</strong></span>
                <span>Priority: <strong className={PRIORITY_COLORS[ticket.priority].split(' ').find(c => c.startsWith('text'))}>{PRIORITY_LABELS[ticket.priority]}</strong></span>
                <span className="flex items-center gap-1"><Clock size={12} /> {new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
              <div className="rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
                {ticket.description}
              </div>
            </div>

            <h3 className="mb-4 text-lg font-semibold">Updates &amp; Replies</h3>
            {replies.length === 0 ? (
              <div className="card p-6 text-center text-sm text-slate-500 dark:text-slate-400">No updates yet. Our team is reviewing your ticket.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {replies.map((reply) => (
                  <div key={reply.id} className="card p-4">
                    <div className="mb-2 flex items-center gap-2">
                      {reply.author_role === 'admin' ? <Headset size={16} className="text-brand-500" /> : <User size={16} className="text-slate-400" />}
                      <span className={cn('text-sm font-semibold', reply.author_role === 'admin' ? 'text-brand-600 dark:text-brand-400' : 'text-slate-600 dark:text-slate-400')}>
                        {reply.author_role === 'admin' ? 'Support Team' : 'You'}
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
        )}
      </div>
    </div>
  )
}
