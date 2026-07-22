'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/#about', label: 'About' },
  { href: '/#services', label: 'Services' },
  { href: '/#industries', label: 'Industries' },
  { href: '/#research', label: 'Research' },
  { href: '/#resources', label: 'Resources' },
  { href: '/#careers', label: 'Careers' },
  { href: '/#contact', label: 'Contact' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#0a1628]/90 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10">
            <svg className="h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L3 7v6c0 5 4 9.4 9 10.9 5-1.5 9-5.9 9-10.9V7L12 2z" />
            </svg>
          </div>
          <span className="text-base font-bold tracking-tight">
            <span className="text-white">NSEC </span>
            <span className="text-white/70 font-normal">Intelligence</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-white/60 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden items-center lg:flex">
          <Link href="/request-assessment">
            <button className="flex items-center gap-2 rounded-lg border border-cyan-500/60 bg-transparent px-5 py-2 text-sm font-medium text-cyan-400 transition-all hover:bg-cyan-500/10 hover:border-cyan-400">
              Request Assessment
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden text-white/60" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={cn('border-t border-white/5 lg:hidden', open ? 'block' : 'hidden')}>
        <nav className="container flex flex-col gap-2 py-4">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-white/60 hover:text-white py-1" onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          <Link href="/request-assessment" className="mt-2">
            <button className="w-full rounded-lg border border-cyan-500/60 px-4 py-2 text-sm font-medium text-cyan-400">
              Request Assessment
            </button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
