'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/lib/types'
import { CheckCircle, AlertCircle, PlusCircle } from 'lucide-react'
import { PublicNav } from '@/components/PublicNav'

export default function CreateTicketPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '', email: '', phone: '', category: '', priority: '', subject: '', description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ ticketNumber: number } | null>(null)

  const handleChange = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.name || !form.email || !form.category || !form.priority || !form.subject || !form.description) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    try {
      const { data, error: insertError } = await supabase
        .from('tickets')
        .insert({
          name: form.name, email: form.email, phone: form.phone || null,
          category: form.category, priority: form.priority,
          subject: form.subject, description: form.description,
        })
        .select('ticket_number')
        .single()

      if (insertError) throw insertError
      setSuccess({ ticketNumber: data.ticket_number })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit ticket. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen">
        <PublicNav />
        <div className="mx-auto max-w-lg px-6 pt-16">
          <div className="card p-10 text-center animate-fade-in">
            <CheckCircle size={56} className="mx-auto mb-5 text-emerald-500" />
            <h1 className="mb-2 text-2xl font-bold">Ticket Submitted!</h1>
            <p className="mb-6 text-slate-500 dark:text-slate-400">Your ticket number is</p>
            <div className="mb-6 text-4xl font-bold tracking-widest text-brand-600 dark:text-brand-400">
              #{String(success.ticketNumber).padStart(4, '0')}
            </div>
            <p className="mb-8 text-sm text-slate-500 dark:text-slate-400">
              Save this number. You&apos;ll need it along with your email to track your ticket status.
            </p>
            <div className="flex justify-center gap-3">
              <button className="btn-primary" onClick={() => router.push('/track')}>Track This Ticket</button>
              <button className="btn-secondary" onClick={() => {
                setSuccess(null)
                setForm({ name: '', email: '', phone: '', category: '', priority: '', subject: '', description: '' })
              }}>Create Another</button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PublicNav />
      <div className="mx-auto max-w-2xl px-6 py-12">
        <div className="mb-8">
          <h1 className="flex items-center gap-2.5 text-3xl font-bold">
            <PlusCircle size={26} className="text-brand-500" /> Create a Support Ticket
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">Fill out the form below and our team will get on it right away.</p>
        </div>

        {error && (
          <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card flex flex-col gap-5 p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Full Name *</label>
              <input className="input" type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="John Doe" />
            </div>
            <div>
              <label className="label">Phone (optional)</label>
              <input className="input" type="tel" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="+1 555 000 0000" />
            </div>
          </div>

          <div>
            <label className="label">Email *</label>
            <input className="input" type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="john@example.com" />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="label">Category *</label>
              <select className="input" value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
                <option value="">Select...</option>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Priority *</label>
              <select className="input" value={form.priority} onChange={(e) => handleChange('priority', e.target.value)}>
                <option value="">Select...</option>
                {Object.entries(PRIORITY_LABELS).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Subject *</label>
            <input className="input" type="text" value={form.subject} onChange={(e) => handleChange('subject', e.target.value)} placeholder="Brief summary of the issue" />
          </div>

          <div>
            <label className="label">Description *</label>
            <textarea className="input" value={form.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="Describe the problem in detail. Include error messages, steps to reproduce, and any troubleshooting you've already tried." rows={6} />
          </div>

          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> : <PlusCircle size={18} />}
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>
      </div>
    </div>
  )
}
