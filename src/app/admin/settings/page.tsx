'use client'

import { Settings, Globe, Bell, Shield, Mail, Save } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'IT Support Hub',
    supportEmail: 'support@itsupporthub.com',
    notifyOnNewTicket: true,
    notifyOnReply: true,
    sessionTimeout: '7',
    allowRegistrations: false,
    rateLimiting: true,
    twoFactorRequired: false,
  })

  const handleSave = () => {
    // In production this would save to the database
    alert('Settings saved successfully!')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-slate-900 dark:text-white">
          <Settings size={26} className="text-brand-500" /> Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Configure your support system</p>
      </div>

      {/* General */}
      <div className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><Globe size={18} className="text-brand-500" /> General</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div><label className="label">Site Name</label><input className="input" value={settings.siteName} onChange={(e) => setSettings({ ...settings, siteName: e.target.value })} /></div>
          <div><label className="label">Support Email</label><input className="input" type="email" value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} /></div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><Bell size={18} className="text-brand-500" /> Notifications</h3>
        <div className="space-y-4">
          <Toggle label="Notify on new ticket" desc="Send email when a new ticket is submitted" checked={settings.notifyOnNewTicket} onChange={(v) => setSettings({ ...settings, notifyOnNewTicket: v })} />
          <Toggle label="Notify on reply" desc="Send email when admin replies to a ticket" checked={settings.notifyOnReply} onChange={(v) => setSettings({ ...settings, notifyOnReply: v })} />
        </div>
      </div>

      {/* Security */}
      <div className="card p-6">
        <h3 className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><Shield size={18} className="text-brand-500" /> Security</h3>
        <div className="space-y-4">
          <div><label className="label">Session Timeout (days)</label><input className="input" type="number" value={settings.sessionTimeout} onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })} /></div>
          <Toggle label="Rate Limiting" desc="Limit login attempts to prevent brute force attacks" checked={settings.rateLimiting} onChange={(v) => setSettings({ ...settings, rateLimiting: v })} />
          <Toggle label="Require 2FA for all admins" desc="Force all admin accounts to use two-factor authentication" checked={settings.twoFactorRequired} onChange={(v) => setSettings({ ...settings, twoFactorRequired: v })} />
          <Toggle label="Allow public admin registration" desc="Allow anyone to create an admin account (not recommended)" checked={settings.allowRegistrations} onChange={(v) => setSettings({ ...settings, allowRegistrations: v })} />
        </div>
      </div>

      <button onClick={handleSave} className="btn-primary"><Save size={16} /> Save Settings</button>
    </div>
  )
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <div className="text-sm font-medium text-slate-900 dark:text-white">{label}</div>
        <div className="text-xs text-slate-500 dark:text-slate-400">{desc}</div>
      </div>
      <button onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 rounded-full transition-colors ${checked ? 'bg-brand-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'left-6' : 'left-1'}`} />
      </button>
    </div>
  )
}
