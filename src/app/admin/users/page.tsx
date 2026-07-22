'use client'

import { useEffect, useState, useCallback } from 'react'
import { EDGE_FUNCTION_URL } from '@/lib/api'
import { Users, Plus, Trash2, Shield, Loader2, AlertCircle, UserCog } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ROLE_LABELS, type Admin } from '@/lib/types'

export default function UsersPage() {
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [newAdmin, setNewAdmin] = useState({ name: '', email: '', password: '', role: 'admin' })
  const [adding, setAdding] = useState(false)

  const fetchAdmins = useCallback(async () => {
    const token = getCookie('admin_session')
    if (!token) return
    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/admin-list`, { headers: { 'X-Admin-Token': token } })
      if (res.ok) setAdmins(await res.json())
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAdmins() }, [fetchAdmins])

  const handleAdd = async () => {
    setError(null)
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) { setError('All fields required.'); return }
    if (newAdmin.password.length < 8) { setError('Password must be 8+ characters.'); return }

    setAdding(true)
    try {
      const token = getCookie('admin_session')
      const res = await fetch(`${EDGE_FUNCTION_URL}/admin-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token! },
        body: JSON.stringify(newAdmin),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Failed' }))
        throw new Error(err.error || 'Failed to create admin')
      }
      setNewAdmin({ name: '', email: '', password: '', role: 'admin' })
      setShowAdd(false)
      fetchAdmins()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create admin.')
    } finally { setAdding(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to deactivate this admin?')) return
    const token = getCookie('admin_session')
    try {
      await fetch(`${EDGE_FUNCTION_URL}/admin-delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token! },
        body: JSON.stringify({ admin_id: id }),
      })
      fetchAdmins()
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold text-slate-900 dark:text-white">
            <Users size={26} className="text-brand-500" /> User Management
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage admin accounts and roles</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="btn-primary"><Plus size={16} /> Add Admin</button>
      </div>

      {error && <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-800 dark:bg-red-900/20 dark:text-red-400"><AlertCircle size={16} /> {error}</div>}

      {showAdd && (
        <div className="card animate-slide-up space-y-4 p-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-slate-900 dark:text-white"><UserCog size={18} className="text-brand-500" /> Create New Admin</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div><label className="label">Name</label><input className="input" value={newAdmin.name} onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })} placeholder="John Doe" /></div>
            <div><label className="label">Email</label><input className="input" type="email" value={newAdmin.email} onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })} placeholder="john@example.com" /></div>
            <div><label className="label">Password (min 8 chars)</label><input className="input" type="password" value={newAdmin.password} onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })} placeholder="••••••••" /></div>
            <div><label className="label">Role</label><select className="input" value={newAdmin.role} onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}><option value="admin">Admin</option><option value="viewer">Viewer</option><option value="super_admin">Super Admin</option></select></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="btn-primary" disabled={adding}>{adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} {adding ? 'Creating...' : 'Create Admin'}</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-brand-500" /></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Name</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Email</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Role</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400">Last Login</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {admins.map(admin => (
                  <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">{admin.name.charAt(0).toUpperCase()}</div>
                        <span className="font-medium text-slate-900 dark:text-white">{admin.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{admin.email}</td>
                    <td className="px-4 py-3"><span className={cn('badge', admin.role === 'super_admin' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' : admin.role === 'admin' ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300')}>{ROLE_LABELS[admin.role]}</span></td>
                    <td className="px-4 py-3">{admin.is_active ? <span className="flex items-center gap-1 text-emerald-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Active</span> : <span className="flex items-center gap-1 text-slate-400"><span className="h-2 w-2 rounded-full bg-slate-400" /> Inactive</span>}</td>
                    <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400">{admin.last_login_at ? new Date(admin.last_login_at).toLocaleDateString() : 'Never'}</td>
                    <td className="px-4 py-3"><button onClick={() => handleDelete(admin.id)} className="text-slate-400 transition-colors hover:text-red-500"><Trash2 size={16} /></button></td>
                  </tr>
                ))}
                {admins.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500 dark:text-slate-400">No admins found.</td></tr>}
              </tbody>
            </table>
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
