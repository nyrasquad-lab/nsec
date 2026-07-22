import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { CATEGORY_LABELS, PRIORITY_LABELS, type Ticket } from '../lib/types'
import { CheckCircle, AlertCircle, PlusCircle } from 'lucide-react'

export default function CreateTicketPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: '',
    priority: '',
    subject: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ ticketNumber: number } | null>(null)

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

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
          name: form.name,
          email: form.email,
          phone: form.phone || null,
          category: form.category,
          priority: form.priority,
          subject: form.subject,
          description: form.description,
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
      <div className="container fade-in" style={{ maxWidth: '520px', margin: '0 auto', paddingTop: '48px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '48px 32px' }}>
          <CheckCircle size={56} color="var(--success)" style={{ margin: '0 auto 20px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '8px' }}>Ticket Submitted!</h1>
          <p style={{ color: 'var(--neutral-500)', marginBottom: '24px' }}>
            Your ticket number is
          </p>
          <div style={{
            fontSize: '36px',
            fontWeight: 700,
            color: 'var(--primary)',
            marginBottom: '24px',
            letterSpacing: '2px',
          }}>
            #{String(success.ticketNumber).padStart(4, '0')}
          </div>
          <p style={{ color: 'var(--neutral-500)', marginBottom: '32px', fontSize: '14px' }}>
            Save this number. You'll need it along with your email to track your ticket status.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn-primary" onClick={() => navigate('/track')}>
              Track This Ticket
            </button>
            <button className="btn-secondary" onClick={() => {
              setSuccess(null)
              setForm({ name: '', email: '', phone: '', category: '', priority: '', subject: '', description: '' })
            }}>
              Create Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container fade-in" style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <PlusCircle size={26} color="var(--primary)" /> Create a Support Ticket
        </h1>
        <p style={{ color: 'var(--neutral-500)', marginTop: '8px' }}>
          Fill out the form below and our team will get on it right away.
        </p>
      </div>

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

      <form onSubmit={handleSubmit} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label>Full Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="John Doe"
            />
          </div>
          <div>
            <label>Phone (optional)</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="+1 555 000 0000"
            />
          </div>
        </div>

        <div>
          <label>Email *</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="john@example.com"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label>Category *</label>
            <select value={form.category} onChange={(e) => handleChange('category', e.target.value)}>
              <option value="">Select...</option>
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Priority *</label>
            <select value={form.priority} onChange={(e) => handleChange('priority', e.target.value)}>
              <option value="">Select...</option>
              {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label>Subject *</label>
          <input
            type="text"
            value={form.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Brief summary of the issue"
          />
        </div>

        <div>
          <label>Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe the problem in detail. Include error messages, steps to reproduce, and any troubleshooting you've already tried."
            rows={6}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={submitting} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          {submitting ? <span className="spinner" /> : <PlusCircle size={18} />}
          {submitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </form>
    </div>
  )
}
