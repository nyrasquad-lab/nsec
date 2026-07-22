'use client';

import { useState } from 'react';
import { Shield, Twitter, Linkedin, Github, Youtube, ArrowRight, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';

const QUICK_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Industries', href: '#industries' },
  { label: 'Research', href: '#research' },
  { label: 'Careers', href: '#careers' },
];

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Security Disclosure', href: '#' },
  { label: 'Cookie Policy', href: '#' },
];

const SOCIAL = [
  { icon: Twitter, label: 'Twitter', href: '#' },
  { icon: Linkedin, label: 'LinkedIn', href: '#' },
  { icon: Github, label: 'GitHub', href: '#' },
  { icon: Youtube, label: 'YouTube', href: '#' },
];

export default function SiteFooter() {
  const [sent, setSent] = useState(false);
  const subscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <footer className="relative border-t border-white/10 bg-cyber-bg">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyber-primary/50 to-transparent" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-80 w-[60%] -translate-x-1/2 rounded-full bg-cyber-primary/5 blur-3xl" />

      <div className="container-wide relative px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* brand + newsletter */}
          <div className="lg:col-span-5">
            <a href="#home" className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyber-primary/40 bg-cyber-primary/10">
                <Shield className="h-5 w-5 text-cyber-primary" />
              </span>
              <span className="font-display text-sm font-semibold tracking-wide text-white">
                NSEC <span className="text-cyber-primary">Intelligence Group</span>
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-cyber-muted">
              Protecting Organizations Against Modern Cyber Threats. Elite,
              enterprise-grade cybersecurity — from offensive validation to
              continuous defense.
            </p>

            <form onSubmit={subscribe} className="mt-6 max-w-sm">
              <label className="mb-2 block text-xs font-medium uppercase tracking-wider text-cyber-muted">
                Threat briefing newsletter
              </label>
              <div className="flex gap-2">
                <Input
                  type="email"
                  required
                  placeholder="you@company.com"
                  className="border-white/10 bg-white/[0.03] text-white placeholder:text-cyber-muted/60 focus-visible:ring-cyber-primary/60"
                />
                <button
                  type="submit"
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cyber-primary px-4 text-sm font-semibold text-cyber-bg transition-all hover:glow-primary"
                >
                  {sent ? 'Subscribed' : 'Subscribe'}
                  {!sent && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          </div>

          {/* quick links */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold text-white">Navigate</h3>
            <ul className="mt-4 space-y-3">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-cyber-muted transition-colors hover:text-cyber-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* legal */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-sm font-semibold text-white">Legal</h3>
            <ul className="mt-4 space-y-3">
              {LEGAL_LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="text-sm text-cyber-muted transition-colors hover:text-cyber-accent"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* contact + social */}
          <div className="lg:col-span-3">
            <h3 className="font-display text-sm font-semibold text-white">Connect</h3>
            <a
              href="mailto:contact@nsecintelligence.com"
              className="mt-4 inline-flex items-center gap-2 text-sm text-cyber-muted transition-colors hover:text-cyber-accent"
            >
              <Mail className="h-4 w-4" />
              contact@nsecintelligence.com
            </a>
            <div className="mt-5 flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.02] text-cyber-muted transition-all hover:border-cyber-primary/40 hover:text-cyber-primary hover:glow-primary"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-cyber-muted">
            © {new Date().getFullYear()} NSEC Intelligence Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
