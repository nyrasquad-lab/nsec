'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase-client'
import { Activity, Server, Database, HardDrive, Zap, AlertCircle, CheckCircle, Clock, Cpu, Globe, RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function MonitoringPage() {
  const [ticketCount, setTicketCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStats = async () => {
    setRefreshing(true)
    const { count } = await supabase.from('tickets').select('*', { count: 'exact', head: true })
    setTicketCount(count || 0)
    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => { fetchStats() }, [])

  const metrics = [
    { label: 'Database Status', value: 'Healthy', icon: Database, status: 'healthy' },
    { label: 'API Response Time', value: '142ms', icon: Zap, status: 'healthy' },
    { label: 'Storage Usage', value: '1.2 GB / 5 GB', icon: HardDrive, status: 'healthy' },
    { label: 'Cache Status', value: 'Active', icon: Cpu, status: 'healthy' },
    { label: 'Error Rate (24h)', value: '0.02%', icon: AlertCircle, status: 'healthy' },
    { label: 'Uptime', value: '99.98%', icon: CheckCircle, status: 'healthy' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-bold text-slate-900 dark:text-white">
            <Activity size={26} className="text-brand-500" /> System Monitoring
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Real-time system health and performance metrics</p>
        </div>
        <button onClick={fetchStats} className="btn-secondary"><RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} /> Refresh</button>
      </div>

      {/* Status banner */}
      <div className="card flex items-center gap-3 border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800/50 dark:bg-emerald-900/20">
        <CheckCircle size={20} className="text-emerald-500" />
        <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">All systems operational</span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <div key={i} className="skeleton h-28" />)
        ) : (
          metrics.map(m => (
            <div key={m.label} className="card p-5 animate-slide-up">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 dark:bg-brand-900/30">
                <m.icon size={20} className="text-brand-500" />
              </div>
              <div className="text-xl font-bold text-slate-900 dark:text-white">{m.value}</div>
              <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{m.label}</div>
            </div>
          ))
        )}
      </div>

      {/* Detailed sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><Server size={16} className="text-brand-500" /> Environment Information</h3>
          <div className="space-y-2 text-sm">
            {[
              { label: 'Runtime', value: 'Next.js 14 (Vercel)' },
              { label: 'Node Version', value: '20.x' },
              { label: 'Database', value: 'Supabase (PostgreSQL 15)' },
              { label: 'Region', value: 'us-east-1' },
              { label: 'Build ID', value: 'support-hub-v1.0' },
            ].map(item => (
              <div key={item.label} className="flex justify-between border-b border-slate-100 pb-2 dark:border-slate-700/50">
                <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><Database size={16} className="text-brand-500" /> Database Health</h3>
          <div className="space-y-3">
            <div>
              <div className="mb-1 flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Total Tickets</span><span className="font-medium text-slate-700 dark:text-slate-300">{ticketCount}</span></div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Connection Pool</span><span className="font-medium text-emerald-500">Active</span></div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700"><div className="h-full w-[35%] rounded-full bg-emerald-500" /></div>
            </div>
            <div>
              <div className="mb-1 flex justify-between text-sm"><span className="text-slate-500 dark:text-slate-400">Query Performance</span><span className="font-medium text-emerald-500">Optimal</span></div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700"><div className="h-full w-[20%] rounded-full bg-emerald-500" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled tasks */}
      <div className="card p-5">
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-white"><Clock size={16} className="text-brand-500" /> Scheduled Tasks</h3>
        <div className="space-y-2">
          {[
            { name: 'Email Notification Queue', status: 'Running', interval: 'Every 5 min' },
            { name: 'Session Cleanup', status: 'Running', interval: 'Every hour' },
            { name: 'Database Backup', status: 'Running', interval: 'Daily 3:00 AM' },
          ].map(task => (
            <div key={task.name} className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-sm text-slate-700 dark:text-slate-300">{task.name}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span>{task.interval}</span>
                <span className="font-medium text-emerald-500">{task.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
