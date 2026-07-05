'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Loader2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import SectionHeading from '../section-heading';
import Reveal from '../reveal';
import { supabase } from '@/lib/supabase-client';

type Status = 'idle' | 'loading' | 'sent' | 'error';

const DETAILS = [
  { icon: Mail, label: 'Email', value: 'contact@nsecintelligence.com' },
  { icon: Phone, label: 'Phone', value: '+1 (555) 010-2025' },
  { icon: MapPin, label: 'HQ', value: '1200 Cyber Plaza, Arlington, VA' },
  { icon: Clock, label: 'SOC', value: '24/7 · 365 days a year' },
];

export default function Contact() {
  const [status, setStatus] = useState<Status>('idle');
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    organization: '',
    service: '',
    message: '',
  });

  const update =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== 'idle') return;
    setStatus('loading');
    const { error } = await supabase.from('assessments').insert({
      full_name: form.full_name,
      email: form.email,
      organization: form.organization || null,
      service: form.service || null,
      message: form.message,
    });
    if (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5200);
      return;
    }
    setStatus('sent');
    setForm({ full_name: '', email: '', organization: '', service: '', message: '' });
    setTimeout(() => setStatus('idle'), 5200);
  };

  return (
    <section id="contact" className="section-padding relative overflow-hidden">
      <div className="pointer-events-none absolute -left-40 top-20 h-80 w-80 rounded-full bg-cyber-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-cyber-accent/10 blur-3xl" />

      <div className="container-wide relative">
        <SectionHeading
          eyebrow="Contact"
          title={
            <>
              Request your <span className="text-gradient">security assessment</span>
            </>
          }
          subtitle="Tell us about your environment and priorities. Our team will respond within one business day to scope a tailored engagement."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-5">
          {/* form */}
          <Reveal className="lg:col-span-3">
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-white/10 bg-cyber-surface/50 p-6 backdrop-blur-2xl sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  <Input
                    required
                    value={form.full_name}
                    onChange={update('full_name')}
                    placeholder="Jane Doe"
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-cyber-muted/60 focus-visible:ring-cyber-primary/60"
                  />
                </Field>
                <Field label="Work email">
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    placeholder="jane@company.com"
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-cyber-muted/60 focus-visible:ring-cyber-primary/60"
                  />
                </Field>
                <Field label="Organization">
                  <Input
                    value={form.organization}
                    onChange={update('organization')}
                    placeholder="Company Inc."
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-cyber-muted/60 focus-visible:ring-cyber-primary/60"
                  />
                </Field>
                <Field label="Service of interest">
                  <Input
                    value={form.service}
                    onChange={update('service')}
                    placeholder="Penetration testing, IR retainer…"
                    className="border-white/10 bg-white/[0.03] text-white placeholder:text-cyber-muted/60 focus-visible:ring-cyber-primary/60"
                  />
                </Field>
              </div>

              <div className="mt-5">
                <Field label="How can we help?">
                  <Textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="Briefly describe your environment, timeline and goals."
                    className="resize-none border-white/10 bg-white/[0.03] text-white placeholder:text-cyber-muted/60 focus-visible:ring-cyber-primary/60"
                  />
                </Field>
              </div>

              <button
                type="submit"
                disabled={status !== 'idle'}
                className="group relative mt-6 inline-flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-lg bg-gradient-to-r from-cyber-primary to-cyber-secondary font-semibold text-cyber-bg transition-all hover:glow-primary disabled:opacity-90"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {status === 'idle' && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-flex items-center gap-2"
                    >
                      Request Assessment
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </motion.span>
                  )}
                  {status === 'loading' && (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-flex items-center gap-2"
                    >
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending…
                    </motion.span>
                  )}
                  {status === 'sent' && (
                    <motion.span
                      key="sent"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-flex items-center gap-2"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      Request received
                    </motion.span>
                  )}
                  {status === 'error' && (
                    <motion.span
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="inline-flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      Something went wrong — try again
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </form>
          </Reveal>

          {/* details + map */}
          <Reveal delay={0.1} className="lg:col-span-2">
            <div className="flex h-full flex-col gap-6">
              <div className="rounded-3xl border border-white/10 bg-cyber-surface/50 p-6 backdrop-blur-2xl">
                <h3 className="font-display text-lg font-semibold text-white">
                  Get in touch
                </h3>
                <ul className="mt-5 space-y-4">
                  {DETAILS.map((d) => (
                    <li key={d.label} className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-cyber-primary/30 bg-cyber-primary/10 text-cyber-primary">
                        <d.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-cyber-muted">
                          {d.label}
                        </p>
                        <p className="text-sm text-white">{d.value}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* interactive map (stylized) */}
              <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-cyber-surface/50 backdrop-blur-2xl">
                <div className="absolute inset-0 bg-grid opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyber-primary/10 via-transparent to-cyber-accent/10" />
                {/* world dots */}
                <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full opacity-60">
                  {[
                    [80, 70], [120, 90], [200, 60], [240, 110], [300, 80],
                    [60, 130], [180, 140], [260, 150], [320, 120], [150, 100],
                  ].map(([cx, cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="2" fill="#00C8FF" opacity="0.5" />
                  ))}
                  <line x1="80" y1="70" x2="200" y2="60" stroke="#00C8FF" strokeWidth="0.5" opacity="0.3" />
                  <line x1="200" y1="60" x2="300" y2="80" stroke="#00C8FF" strokeWidth="0.5" opacity="0.3" />
                  <line x1="120" y1="90" x2="240" y2="110" stroke="#00FFD5" strokeWidth="0.5" opacity="0.3" />
                </svg>
                <motion.div
                  animate={{ scale: [1, 1.15, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                >
                  <span className="relative flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyber-accent opacity-75" />
                    <span className="relative grid h-4 w-4 place-items-center rounded-full bg-cyber-accent">
                      <MapPin className="h-2.5 w-2.5 text-cyber-bg" />
                    </span>
                  </span>
                </motion.div>
                <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-cyber-bg/70 px-3 py-2 backdrop-blur-md">
                  <p className="text-xs font-medium text-white">Arlington, VA — HQ</p>
                  <p className="text-[10px] text-cyber-muted">38.8796° N, 77.1068° W</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-cyber-muted">
        {label}
      </span>
      {children}
    </label>
  );
}
