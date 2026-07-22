'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/admin/auth-context';
import type { Ticket, TicketReply } from '@/lib/types';
import { Loader2, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const statusColors: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  open: 'warning',
  in_progress: 'default',
  resolved: 'success',
  closed: 'secondary',
};

export default function TicketDetailPage() {
  const { token } = useAuth();
  const params = useParams();
  const ticketId = params.id as string;
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [newStatus, setNewStatus] = useState('');
  const [message, setMessage] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const [ticketRes, repliesRes] = await Promise.all([
        supabase.from('tickets').select('*').eq('id', ticketId).maybeSingle(),
        supabase.from('ticket_replies').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true }),
      ]);
      setTicket(ticketRes.data as Ticket | null);
      setReplies((repliesRes.data || []) as TicketReply[]);
      if (ticketRes.data) setNewStatus((ticketRes.data as Ticket).status);
      setLoading(false);
    }
    fetchData();
  }, [ticketId]);

  async function handleUpdate() {
    if (!token) return;
    setUpdating(true);

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
    try {
      const res = await fetch(`${supabaseUrl}/functions/v1/admin-update-ticket`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Admin-Token': token },
        body: JSON.stringify({
          ticket_id: ticketId,
          status: newStatus,
          message,
          status_changed: newStatus !== ticket?.status,
        }),
      });

      if (res.ok) {
        const [ticketRes, repliesRes] = await Promise.all([
          supabase.from('tickets').select('*').eq('id', ticketId).maybeSingle(),
          supabase.from('ticket_replies').select('*').eq('ticket_id', ticketId).order('created_at', { ascending: true }),
        ]);
        setTicket(ticketRes.data as Ticket | null);
        setReplies((repliesRes.data || []) as TicketReply[]);
        setMessage('');
      }
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  if (!ticket) {
    return <Card><CardContent className="py-12 text-center text-muted-foreground">Ticket not found.</CardContent></Card>;
  }

  return (
    <div>
      <Link href="/admin/tickets" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Tickets
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-muted-foreground">#{String(ticket.ticket_number).padStart(4, '0')}</span>
          <Badge variant={statusColors[ticket.status] || 'default'}>{ticket.status.replace('_', ' ')}</Badge>
          <Badge variant="outline">{ticket.priority}</Badge>
        </div>
        <h1 className="mt-2 text-2xl font-bold">{ticket.subject}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {ticket.name} · {ticket.email} · {ticket.category} · {new Date(ticket.created_at).toLocaleDateString()}
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader><CardTitle className="text-base">Description</CardTitle></CardHeader>
        <CardContent><p className="whitespace-pre-wrap text-sm">{ticket.description}</p></CardContent>
      </Card>

      <div className="mb-6 space-y-3">
        <h2 className="text-lg font-semibold">Conversation</h2>
        {replies.length === 0 ? (
          <p className="text-sm text-muted-foreground">No replies yet.</p>
        ) : (
          replies.map((reply) => (
            <Card key={reply.id} className={reply.author_role === 'admin' ? 'border-primary/30' : ''}>
              <CardContent className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant={reply.author_role === 'admin' ? 'default' : 'secondary'}>
                    {reply.author_role}
                  </Badge>
                  {reply.status_change && (
                    <Badge variant="outline">Status: {reply.status_change}</Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(reply.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="whitespace-pre-wrap text-sm">{reply.message}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Update Ticket</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">Reply Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Type your reply to the customer..."
            />
          </div>
          <Button onClick={handleUpdate} disabled={updating || (!message && newStatus === ticket.status)}>
            {updating ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating...</> : <><Send className="h-4 w-4" /> Update Ticket</>}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
