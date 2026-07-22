import { PublicNav } from '@/components/PublicNav'
import { LifeBuoy, ShieldCheck, Clock, Mail, Wrench, Network, Monitor, KeyRound, HelpCircle, PlusCircle, Search } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <PublicNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-white to-white dark:from-slate-800 dark:via-slate-900 dark:to-slate-900" />
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-brand-200/30 blur-3xl dark:bg-brand-900/20" />
        <div className="absolute top-40 -left-20 h-80 w-80 rounded-full bg-cyan-200/20 blur-3xl dark:bg-cyan-900/10" />

        <div className="relative mx-auto max-w-4xl px-6 py-20 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-brand-100 px-4 py-1.5 text-sm font-semibold text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
            <ShieldCheck size={14} /> Trusted by 500+ teams
          </div>
          <h1 className="mb-5 text-5xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Tech problems?<br />We&apos;ve got you covered.
          </h1>
          <p className="mx-auto mb-8 max-w-xl text-lg text-slate-500 dark:text-slate-400">
            Submit a support ticket in under two minutes. Track its progress in real time and get notified when it&apos;s resolved.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/create" className="btn-primary">
              <PlusCircle size={18} /> Create a Ticket
            </Link>
            <Link href="/track" className="btn-secondary">
              <Search size={18} /> Track a Ticket
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Clock, label: 'Avg Response', value: '< 2 hours' },
            { icon: ShieldCheck, label: 'Resolution Rate', value: '98.5%' },
            { icon: Mail, label: 'Tickets Solved', value: '12,000+' },
            { icon: LifeBuoy, label: 'Support Agents', value: '24/7' },
          ].map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <stat.icon size={26} className="mx-auto mb-3 text-brand-500" />
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-6 pb-16">
        <h2 className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">What can we help with?</h2>
        <p className="mb-8 text-slate-500 dark:text-slate-400">We troubleshoot a wide range of technical issues across five categories.</p>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: Monitor, title: 'Hardware', desc: 'Laptops, servers, peripherals, and device failures.' },
            { icon: Wrench, title: 'Software', desc: 'App crashes, installation issues, and software bugs.' },
            { icon: Network, title: 'Network', desc: 'Connectivity, VPN, firewall, and internet problems.' },
            { icon: KeyRound, title: 'Account', desc: 'Login issues, password resets, and access management.' },
            { icon: HelpCircle, title: 'Other', desc: 'Anything else tech-related that needs troubleshooting.' },
          ].map((cat) => (
            <div
              key={cat.title}
              className="card p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 dark:bg-brand-900/30">
                <cat.icon size={22} className="text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="mb-1.5 text-base font-semibold text-slate-900 dark:text-white">{cat.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{cat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <h2 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">How it works</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { step: '1', title: 'Submit a Ticket', desc: 'Describe your issue, pick a category and priority, and share your contact info.' },
            { step: '2', title: 'We Investigate', desc: 'Our team reviews your ticket, updates the status, and starts troubleshooting.' },
            { step: '3', title: 'Track Progress', desc: 'Check your ticket status anytime using your ticket number and email.' },
            { step: '4', title: 'Get Notified', desc: 'Receive an email notification when your ticket is resolved or updated.' },
          ].map((item) => (
            <div key={item.step} className="flex gap-4">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-brand-600 text-base font-bold text-white">
                {item.step}
              </div>
              <div>
                <h3 className="mb-1 text-base font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-slate-900 py-8 text-center text-sm text-slate-400 dark:border-slate-700">
        IT Support Hub &copy; 2025 — Reliable tech help, one ticket at a time.
      </footer>
    </div>
  )
}
