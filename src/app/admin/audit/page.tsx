'use client'

import { useEffect, useState, useCallback } from 'react'
import { EDGE_FUNCTION_URL } from '@/lib/api'
import { ScrollText, Loader2 } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { AuditLog } from '@/lib/types'

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  const fetchLogs = useCallback(async () => {
    const token = getCookie('admin_session')
    if (!token) return
    try {
      const res = await fetch(`${EDGE_FUNCTION_URL}/admin-audit-logs`, { headers: { 'X-Admin-Token': token } })
      if (res.ok) setLogs(await res.json())
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchLogs() }, [fetchLogs])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2.5 text-2xl font-bold text-slate-900 dark:text-white">
          <ScrollText size={26} className="text-brand-500" /> Audit Logs
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Track all administrative actions</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 size={24} className="animate-spin text-brand-500" /></div>
      ) : logs.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500 dark:text-slate-400">No audit logs recorded.</div>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <div key={log.id} className="card flex items-start gap-4 p-4">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                <ScrollText size={14} className="text-slate-500" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-slate-900 dark:text-white">{log.action}</div>
                {log.entity_type && <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">Entity: {log.entity_type} {log.entity_id && `(${log.entity_id})`}</div>}
                {log.ip_address && <div className="mt-0.5 text-xs text-slate-400">IP: {log.ip_address}</div>}
              </div>
              <span className="text-xs text-slate-400">{formatDateTime(log.created_at)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : null
}
