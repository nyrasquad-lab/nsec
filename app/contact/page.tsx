'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Globe, Loader2, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const contactInfo = [
  { icon: Phone, label: 'Call Us', value: '+1 (555) 637-3274', sub: 'Mon–Fri 9am–6pm EST' },
  { icon: Mail, label: 'Email Us', value: 'intel@nsecintelligence.com', sub: 'Response within 2 hours' },
  { icon: MapPin, label: 'Headquarters', value: 'Cyber Defense Center, Arlington, VA', sub: '22201' },
  { icon: Clock, label: 'SOC Hours', value: '24 / 7 / 365', sub: 'Always operational' },
];

const services = [
  'SOC Monitoring',
  'Threat Intelligence',
  'Penetration Testing',
  'Incident Response',
  'Compliance & Audit',
  'Network Security',
  'Other',
];

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    const formData = new FormData(e.currentTarget);
    const payload = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      organization: formData.get('organization'),
      service: formData.get('service'),
      message: formData.get('message'),
    };
    const { error } = await supabase.from('assessments').insert(payload);
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setStatus('success');
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#080f1d]">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/5 blur-3xl" />

      <div className="container relative z-10 py-20">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-2">
            <span className="font-mono text-xs text-cyan-500/60">[</span>
            <span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)]" />
            <span className="text-sm font-medium text-white/80">Contact NSEC Intelligence</span>
            <span className="font-mono text-xs text-cyan-500/60">]</span>
          </div>
          <h1 className="text-4xl font-bold text-white md:text-5xl">Get In Touch</h1>
          <p className="mt-4 text-lg text-white/40">
            Reach out to our security team — we&apos;ll respond within 2 hours during business days.
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-5">
          {/* Left: Contact info cards + map */}
          <div className="lg:col-span-2 space-y-4">
            {contactInfo.map((info) => (
              <div
                key={info.label}
                className="flex items-start gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-5 transition-all hover:border-cyan-500/20"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-500/20 bg-cyan-500/10">
                  <info.icon className="h-5 w-5 text-cyan-400" />
                </div>
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-white/30">{info.label}</p>
                  <p className="mt-1 text-sm font-medium text-white">{info.value}</p>
                  <p className="mt-0.5 text-xs text-white/30">{info.sub}</p>
                </div>
              </div>
            ))}

            {/* Map widget */}
            <div className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.03]">
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-cyan-400/70" />
                  <span className="font-mono text-xs text-white/50">nsec-hq · arlington, va</span>
                </div>
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
                </span>
              </div>
              <div className="relative h-48 bg-[#0a1628]">
                <svg viewBox="0 0 400 200" className="h-full w-full">
                  {/* Grid */}
                  <defs>
                    <pattern id="mapgrid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,212,255,0.06)" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="400" height="200" fill="url(#mapgrid)" />
                  {/* Roads */}
                  <path d="M 0 100 L 400 100" stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
                  <path d="M 200 0 L 200 200" stroke="rgba(0,212,255,0.1)" strokeWidth="1" />
                  <path d="M 0 50 L 400 150" stroke="rgba(0,212,255,0.05)" strokeWidth="0.5" />
                  <path d="M 50 0 L 350 200" stroke="rgba(0,212,255,0.05)" strokeWidth="0.5" />
                  {/* Pin */}
                  <circle cx="200" cy="100" r="20" fill="rgba(0,212,255,0.08)" />
                  <circle cx="200" cy="100" r="10" fill="rgba(0,212,255,0.15)" />
                  <circle cx="200" cy="100" r="4" fill="#22d3ee" />
                  <circle cx="200" cy="100" r="4" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.5">
                    <animate attributeName="r" from="4" to="30" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
                <div className="absolute bottom-2 left-3 font-mono text-[10px] text-white/30">
                  38.8816° N, 77.0927° W
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm">
              {status === 'success' ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">
                    <CheckCircle className="h-8 w-8 text-cyan-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Message Sent</h2>
                  <p className="mt-3 max-w-sm text-white/50">
                    Thank you for reaching out. Our security team will contact you within 2 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="full_name" className="text-sm font-medium text-white/70">Full Name *</label>
                      <input
                        id="full_name" name="full_name" required
                        placeholder="John Doe"
                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium text-white/70">Email *</label>
                      <input
                        id="email" name="email" type="email" required
                        placeholder="john@company.com"
                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <label htmlFor="organization" className="text-sm font-medium text-white/70">Organization</label>
                      <input
                        id="organization" name="organization"
                        placeholder="Company Inc."
                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="service" className="text-sm font-medium text-white/70">Service of Interest</label>
                      <select
                        id="service" name="service" defaultValue=""
                        className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                      >
                        <option value="" disabled className="bg-[#0a1628]">Select a service</option>
                        {services.map((s) => <option key={s} value={s} className="bg-[#0a1628]">{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="message" className="text-sm font-medium text-white/70">Message *</label>
                    <textarea
                      id="message" name="message" required rows={6}
                      placeholder="Tell us about your security needs..."
                      className="flex min-h-[120px] w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                    />
                  </div>

                  {status === 'error' && (
                    <p className="text-sm text-red-400">{errorMsg}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-500 px-6 py-3 text-sm font-semibold text-[#080f1d] transition-all hover:bg-cyan-400 disabled:opacity-50"
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /> Sending...</>
                    ) : (
                      <>Send Message <ArrowRight className="h-4 w-4" /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
