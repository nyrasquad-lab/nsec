'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const services = [
  'Infrastructure Management',
  'Cloud Solutions',
  'Cybersecurity',
  'Network Services',
  'Data Backup & Recovery',
  'Help Desk Support',
  'Other',
];

export default function AssessmentPage() {
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
      <div className="container flex min-h-[60vh] items-center justify-center py-20">
        <Card className="max-w-lg text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold">Assessment Requested!</h2>
            <p className="mt-2 text-muted-foreground">
              Thank you for reaching out. Our team will contact you within 24 hours to schedule your free IT assessment.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Free IT Assessment</h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get a comprehensive evaluation of your IT infrastructure — no obligation.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Request Your Assessment</CardTitle>
            <CardDescription>Fill out the form below and we&apos;ll be in touch within 24 hours.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name *</Label>
                <Input id="full_name" name="full_name" required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required placeholder="john@company.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input id="organization" name="organization" placeholder="Company Inc." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="service">Service of Interest</Label>
                <Select id="service" name="service" defaultValue="">
                  <option value="" disabled>Select a service</option>
                  {services.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Tell us about your needs *</Label>
                <Textarea id="message" name="message" required rows={4} placeholder="Describe your current IT challenges..." />
              </div>

              {status === 'error' && (
                <p className="text-sm text-destructive">{errorMsg}</p>
              )}

              <Button type="submit" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Assessment Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
