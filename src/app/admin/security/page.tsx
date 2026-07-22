'use client'

import { useEffect, useState, useCallback } from 'react'
import { EDGE_FUNCTION_URL } from '@/lib/api'
import { Shield, LogIn, AlertTriangle, Clock, Key, Smartphone, Monitor, Globe, Activity, Lock, Eye, EyeOff, Loader2, CheckCircle, XCircle } from 'lucide-react'
import { cn, formatDateTime, timeAgo } from '@/lib/utils'
import type { LoginHistoryEntry, SecurityEvent } from '@/lib/types'

export default function SecurityCenterPage() {
  const [loginHistory, setLoginHistory] = useState<LoginHistoryEntry[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<'overview' | 'logins' | 'events' | '2fa'>('overview')

  const fetchData = useCallback(async () => {
    const token = getCookie('admin_session')
    if (!token) return
    try {
      const [loginRes, eventRes] = await Promise.all([
        fetch(`${EDGE_FUNCTION_URL}/admin-login-history`, { headers: { 'X-Admin-Token': token } }),
        fetch(`${EDGE_FUNCTION_URL}/admin-security-events`, { headers: { 'X-Admin-Token': token } }),
      ])
      if (loginRes.ok) setLoginHistory(await loginRes.json())
      if (eventRes.ok) setSecurityEvents(await eventRes.json())
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const failedLogins = loginHistory.filter(l => !l.success)
  const successfulLogins = loginHistory.filter(l => l.success)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-slate-900 dark:text-white">
          <Shield size={26} className="text-brand-500" /> Security Center
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Monitor security events, sessions, and access</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {[
          { key: 'overview', label: 'Overview' },
          { key: 'logins', label: 'Login History' },
          { key: 'events', label: 'Security Events' },
          { key: '2fa', label: 'Two-Factor Auth' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as typeof tab)}
            className={cn('border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
              tab === t.key ? 'border-brand-500 text-brand-600 dark:text-brand-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200')}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-brand-500" /></div>
      ) : tab === 'overview' ? (
        <OverviewTab failedLogins={failedLogins.length} successfulLogins={successfulLogins.length} securityEvents={securityEvents} loginHistory={loginHistory} />
      ) : tab === 'logins' ? (
        <LoginHistoryTab entries={loginHistory} />
      ) : tab === 'events' ? (
        <SecurityEventsTab events={securityEvents} />
      ) : (
        <TwoFactorTab />
      )}
    </div>
  )
}

function OverviewTab({ failedLogins, successfulLogins, securityEvents, loginHistory }: {
  failedLogins: number; successfulLogins: number; securityEvents: SecurityEvent[]; loginHistory: LoginHistoryEntry[]
}) {
  const cards = [
    { label: 'Successful Logins', value: successfulLogins, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/30' },
    { label: 'Failed Attempts', value: failedLogins, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/30' },
    { label: 'Security Events', value: securityEvents.length, icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/30' },
    { label: 'Active Sessions', value: 1, icon: Activity, color: 'text-brand-500', bg: 'bg-brand-50 dark:bg-brand-900/30' },
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map(c => (
          <div key={c.label} className="card p-5">
            <div className={cn('mb-3 flex h-10 w-10 items-center justify-center rounded-lg', c.bg)}><c.icon size={20} className={c.color} /></div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{c.value}</div>
            <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><Clock size={16} className="text-brand-500" /> Recent Activity</h3>
        <div className="space-y-3">
          {securityEvents.slice(0, 8).map(event => (
            <div key={event.id} className="flex items-center gap-3 text-sm">
              <div className={cn('h-2 w-2 rounded-full', event.event_type.includes('failed') ? 'bg-red-500' : event.event_type.includes('success') ? 'bg-emerald-500' : 'bg-amber-500')} />
              <span className="flex-1 capitalize text-slate-700 dark:text-slate-300">{event.event_type.replace(/_/g, ' ')}</span>
              <span className="text-xs text-slate-400">{timeAgo(event.created_at)}</span>
            </div>
          ))}
          {securityEvents.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400">No security events recorded.</p>}
        </div>
      </div>
    </div>
  )
}

function LoginHistoryTab({ entries }: { entries: LoginHistoryEntry[] }) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Status</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Email</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">IP Address</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">User Agent</th>
              <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {entries.map(entry => (
              <tr key={entry.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                <td className="px-4 py-3">
                  {entry.success ? <CheckCircle size={16} className="text-emerald-500" /> : <XCircle size={16} className="text-red-500" />}
                </td>
                <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{entry.email}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{entry.ip_address || '—'}</td>
                <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px] truncate">{entry.user_agent || '—'}</td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{formatDateTime(entry.created_at)}</td>
              </tr>
            ))}
            {entries.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No login history.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function SecurityEventsTab({ events }: { events: SecurityEvent[] }) {
  return (
    <div className="space-y-3">
      {events.map(event => (
        <div key={event.id} className="card flex items-start gap-4 p-4">
          <div className={cn('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
            event.event_type.includes('failed') ? 'bg-red-50 text-red-500 dark:bg-red-900/30' :
            event.event_type.includes('success') ? 'bg-emerald-50 text-emerald-500 dark:bg-emerald-900/30' :
            'bg-amber-50 text-amber-500 dark:bg-amber-900/30')}>
            <AlertTriangle size={18} />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium capitalize text-slate-900 dark:text-white">{event.event_type.replace(/_/g, ' ')}</div>
            <div className="mt-1 flex gap-4 text-xs text-slate-500 dark:text-slate-400">
              {event.ip_address && <span className="flex items-center gap-1"><Globe size={11} /> {event.ip_address}</span>}
              <span className="flex items-center gap-1"><Clock size={11} /> {formatDateTime(event.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
      {events.length === 0 && <div className="card p-8 text-center text-sm text-slate-500 dark:text-slate-400">No security events recorded.</div>}
    </div>
  )
}

function TwoFactorTab() {
  const [enabled, setEnabled] = useState(false)
  const [showSecret, setShowSecret] = useState(false)

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30"><Key size={20} className="text-brand-500" /></div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{enabled ? 'Enabled' : 'Not enabled'} — Add an extra layer of security</p>
            </div>
          </div>
          <button onClick={() => setEnabled(!enabled)} className={cn('relative h-7 w-12 rounded-full transition-colors', enabled ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600')}>
            <span className={cn('absolute top-1 h-5 w-5 rounded-full bg-white transition-all', enabled ? 'left-6' : 'left-1')} />
          </button>
        </div>
      </div>

      {enabled && (
        <div className="card p-6 animate-fade-in">
          <h3 className="mb-4 text-base font-semibold text-slate-900 dark:text-white">Setup TOTP</h3>
          <div className="space-y-4">
            <div>
              <label className="label">Secret Key</label>
              <div className="flex gap-2">
                <input className="input" type={showSecret ? 'text' : 'password'} value="JBSWY3DPEHPK3PXP" readOnly />
                <button onClick={() => setShowSecret(!showSecret)} className="btn-secondary">{showSecret ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            <div>
              <label className="label">Enter Verification Code</label>
              <input className="input" placeholder="6-digit code" maxLength={6} />
            </div>
            <button className="btn-primary"><Lock size={16} /> Verify &amp; Enable</button>
          </div>
        </div>
      )}

      <div className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><Smartphone size={18} className="text-brand-500" /> Recovery Codes</h3>
        <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Generate one-time recovery codes to use if you lose access to your authenticator.</p>
        <button className="btn-secondary">Generate Recovery Codes</button>
      </div>
    </div>
  )
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}
