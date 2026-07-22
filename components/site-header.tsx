'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/#services', label: 'Services' },
  { href: '/#why-us', label: 'Why Us' },
  { href: '/#process', label: 'Process' },
  { href: '/#contact', label: 'Contact' },
  { href: '/blog', label: 'Blog' },
  { href: '/support', label: 'Support' },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <ShieldCheck className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold tracking-tight">IT Support Hub</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/admin/login">
            <Button variant="ghost" size="sm">Admin</Button>
          </Link>
          <Link href="/assessment">
            <Button size="sm">Get Assessment</Button>
          </Link>
        </div>

        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <div className={cn('border-t md:hidden', open ? 'block' : 'hidden')}>
        <nav className="container flex flex-col gap-2 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 pt-2">
            <Link href="/admin/login" className="flex-1">
              <Button variant="outline" size="sm" className="w-full">Admin</Button>
            </Link>
            <Link href="/assessment" className="flex-1">
              <Button size="sm" className="w-full">Get Assessment</Button>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
