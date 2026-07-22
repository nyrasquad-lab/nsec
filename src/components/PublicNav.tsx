'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LifeBuoy, Home, PlusCircle, Search, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export function PublicNav() {
  const pathname = usePathname()

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/create', label: 'Create Ticket', icon: PlusCircle },
    { href: '/track', label: 'Track Ticket', icon: Search },
    { href: '/admin', label: 'Admin', icon: Settings },
  ]

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-700 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
        <Link href="/" className="flex items-center gap-2.5 text-slate-900 dark:text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-cyan-400">
            <LifeBuoy size={18} className="text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">IT Support Hub</span>
        </Link>

        <div className="flex gap-1">
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href))
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
                )}
              >
                <link.icon size={15} />
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
