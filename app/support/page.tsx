'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Loader2, Search, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const categories = ['Hardware', 'Software', 'Network', 'Email', 'Security', 'Account Access', 'Other'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];

export default function SupportPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [ticketNumber, setTicketNumber] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<{ ticket_number: number; status: string; subject: string } | null>(null);
  const [searchError, setSearchError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');

    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      category: formData.get('category'),
      priority: formData.get('priority'),
      subject: formData.get('subject'),
      description: formData.get('description'),
    };

    const { data, error } = await supabase.from('tickets').insert(payload).select('ticket_number').single();
    if (error) {
      setStatus('error');
      setErrorMsg(error.message);
    } else {
      setTicketNumber(data.ticket_number);
      setStatus('success');
    }
  }

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSearchError('');
    setSearchResult(null);

    if (!searchQuery.trim()) return;

    const num = parseInt(searchQuery, 10);
    if (isNaN(num)) {
      setSearchError('Please enter a valid ticket number');
      return;
    }

    const { data, error } = await supabase
      .from('tickets')
      .select('ticket_number, status, subject')
      .eq('ticket_number', num)
      .maybeSingle();

    if (error) {
      setSearchError(error.message);
    } else if (!data) {
      setSearchError('Ticket not found');
    } else {
      setSearchResult(data);
    }
  }

  if (status === 'success' && ticketNumber !== null) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-20">
        <Card className="max-w-lg text-center">
          <CardContent className="pt-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold">Ticket Submitted!</h2>
            <p className="mt-2 text-muted-foreground">
              Your support ticket number is{' '}
              <span className="font-bold text-primary">#{String(ticketNumber).padStart(4, '0')}</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Save this number to check your ticket status later.
            </p>
            <Button className="mt-6" onClick={() => { setStatus('idle'); setTicketNumber(null); }}>
              Submit Another Ticket
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">IT Support Center</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Submit a support ticket or check the status of an existing one.
        </p>
      </div>

      <div className="mx-auto max-w-2xl space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" /> Check Ticket Status
            </CardTitle>
            <CardDescription>Enter your ticket number to check its current status.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g. 42"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button type="submit" variant="outline">Search</Button>
            </form>
            {searchError && <p className="mt-2 text-sm text-destructive">{searchError}</p>}
            {searchResult && (
              <div className="mt-4 rounded-lg border bg-secondary/50 p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">#{String(searchResult.ticket_number).padStart(4, '0')}</span>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {searchResult.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{searchResult.subject}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Submit a New Ticket
            </CardTitle>
            <CardDescription>Fill out the form below and our team will respond promptly.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input id="name" name="name" required placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required placeholder="john@company.com" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" placeholder="(555) 123-4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select id="category" name="category" required defaultValue="">
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select id="priority" name="priority" required defaultValue="">
                  <option value="" disabled>Select priority</option>
                  {priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" name="subject" required placeholder="Brief description of the issue" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" name="description" required rows={4} placeholder="Provide detailed information about your issue..." />
              </div>

              {status === 'error' && <p className="text-sm text-destructive">{errorMsg}</p>}

              <Button type="submit" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                ) : (
                  'Submit Ticket'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
