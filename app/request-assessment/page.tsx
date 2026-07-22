'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { CheckCircle, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const services = [
  'SOC Monitoring',
  'Threat Intelligence',
  'Penetration Testing',
  'Incident Response',
  'Compliance & Audit',
  'Network Security',
  'Other',
];

export default function RequestAssessmentPage() {
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

  if (status === 'success') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-20">
        <div className="max-w-lg text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-cyan-500/30 bg-cyan-500/10">
            <CheckCircle className="h-8 w-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Assessment Requested</h2>
          <p className="mt-3 text-white/50">
            Thank you for reaching out. Our security team will contact you within 24 hours to schedule your cybersecurity assessment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-[#080f1d]">
      <div className="pointer-events-none absolute left-0 top-0 h-[400px] w-[400px] -translate-x-1/4 -translate-y-1/4 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="container relative z-10 py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="font-mono text-xs text-cyan-500/60">[</span>
              <ShieldCheck className="h-4 w-4 text-cyan-400" />
              <span className="text-sm font-medium text-white/80">Free Security Assessment</span>
              <span className="font-mono text-xs text-cyan-500/60">]</span>
            </div>
            <h1 className="text-4xl font-bold text-white">Request a Security Assessment</h1>
            <p className="mt-4 text-white/40">
              Get a comprehensive evaluation of your security posture — no obligation.
            </p>
          </div>

          <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-8 backdrop-blur-sm">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-white/70">Full Name *</Label>
                <Input id="full_name" name="full_name" required placeholder="John Doe" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/70">Email *</Label>
                <Input id="email" name="email" type="email" required placeholder="john@company.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization" className="text-white/70">Organization</Label>
                <Input id="organization" name="organization" placeholder="Company Inc." className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service" className="text-white/70">Service of Interest</Label>
                <Select id="service" name="service" defaultValue="" className="bg-white/5 border-white/10 text-white">
                  <option value="" disabled className="bg-[#0a1628]">Select a service</option>
                  {services.map((s) => <option key={s} value={s} className="bg-[#0a1628]">{s}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-white/70">Tell us about your security needs *</Label>
                <Textarea id="message" name="message" required rows={4} placeholder="Describe your current security challenges..." className="bg-white/5 border-white/10 text-white placeholder:text-white/20" />
              </div>

              {status === 'error' && <p className="text-sm text-red-400">{errorMsg}</p>}

              <Button type="submit" className="w-full bg-cyan-500 text-[#080f1d] hover:bg-cyan-400" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Assessment Request'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
