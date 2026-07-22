'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { LifeBuoy, Mail, Lock, User, AlertCircle, Loader2, CheckCircle, ShieldCheck } from 'lucide-react'
import { EDGE_FUNCTION_URL } from '@/lib/api'

export default function SetupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [setupAllowed, setSetupAllowed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${EDGE_FUNCTION_URL}/admin-status`)
        const data = await res.json()
        if (data.admins_exist) {
          router.push('/login')
          return
        }
        setSetupAllowed(true)
      } catch {
        setSetupAllowed(true)
      } finally {
        setChecking(false)
      }
    }
    checkStatus()
  }, [router])

  // Particle animation (same as login)
  useEffect(() => {
    if (!setupAllowed) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    const particles: { x: number; y: number; vx: number; vy: number; r: number; opacity: number }[] = []
    const count = 40

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.1,
      })
    }

    const animate = () => {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            ctx!.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 120)})`
            ctx!.lineWidth = 0.5
            ctx!.beginPath()
            ctx!.moveTo(particles[i].x, particles[i].y)
            ctx!.lineTo(particles[j].x, particles[j].y)
            ctx!.stroke()
          }
        }
      }
      for (const p of particles) {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas!.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas!.height) p.vy *= -1
        ctx!.fillStyle = `rgba(16, 185, 129, ${p.opacity})`
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx!.fill()
      }
      animationId = requestAnimationFrame(animate)
    }
    animate()
    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize) }
  }, [setupAllowed])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.name || !form.email || !form.password) { setError('All fields are required.'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return }

    setLoading(true)
    try {
      const response = await fetch(`${EDGE_FUNCTION_URL}/admin-setup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      })

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({ error: 'Setup failed' }))
        throw new Error(errBody.error || 'Setup failed')
      }

      setSuccess(true)
      setTimeout(() => router.push('/login'), 2500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Setup failed.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <Loader2 size={32} className="animate-spin text-brand-400" />
      </div>
    )
  }

  if (success) {
    return (
      <div className="animated-gradient flex min-h-screen items-center justify-center">
        <div className="glass rounded-2xl p-10 text-center animate-slide-up max-w-md">
          <CheckCircle size={56} className="mx-auto mb-5 text-emerald-400" />
          <h1 className="mb-2 text-2xl font-bold text-white">Admin Created!</h1>
          <p className="text-slate-300">Redirecting to login...</p>
          <Loader2 size={24} className="mx-auto mt-6 animate-spin text-brand-400" />
        </div>
      </div>
    )
  }

  if (!setupAllowed) return null

  return (
    <div className="animated-gradient relative flex min-h-screen items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl animate-float" />
      <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-brand-500/15 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 w-full max-w-md px-6 animate-slide-up">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-brand-500 shadow-lg shadow-emerald-500/30">
              <ShieldCheck size={28} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Initial Setup</h1>
            <p className="mt-1.5 text-sm text-slate-300">Create the first administrator account</p>
          </div>

          <div className="mb-5 rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-300">
            This page is only available before the first admin is created. After setup, new admins must be invited from the dashboard.
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300 animate-fade-in">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Full Name</label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Admin Name"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30" autoFocus />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="admin@example.com"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Password (min 8 chars)</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="••••••••"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-200">Confirm Password</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} placeholder="••••••••"
                  className="w-full rounded-lg border border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/30" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-brand-500 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:from-emerald-600 hover:to-brand-600 active:scale-[0.98] disabled:opacity-50">
              {loading ? <Loader2 size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
              {loading ? 'Creating...' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
