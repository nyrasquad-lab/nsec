'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import type { Ticket } from '@/lib/types';
import { Loader2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

const statusColors: Record<string, 'default' | 'secondary' | 'success' | 'warning' | 'destructive'> = {
  open: 'warning',
  in_progress: 'default',
  resolved: 'success',
  closed: 'secondary',
};

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    async function fetchTickets() {
      let query = supabase.from('tickets').select('*').order('created_at', { ascending: false });
      if (filter !== 'all') query = query.eq('status', filter);
      const { data } = await query;
      setTickets((data || []) as Ticket[]);
      setLoading(false);
    }
    fetchTickets();
  }, [filter]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Support Tickets</h1>

      <div className="mb-6 flex gap-2">
        {['all', 'open', 'in_progress', 'resolved', 'closed'].map((s) => (
          <Button
            key={s}
            variant={filter === s ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(s)}
          >
            {s === 'all' ? 'All' : s.replace('_', ' ')}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : tickets.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No tickets found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <Link key={ticket.id} href={`/admin/tickets/${ticket.id}`}>
              <Card className="cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm text-muted-foreground">
                        #{String(ticket.ticket_number).padStart(4, '0')}
                      </span>
                      <Badge variant={statusColors[ticket.status] || 'default'}>
                        {ticket.status.replace('_', ' ')}
                      </Badge>
                      <Badge variant="outline">{ticket.priority}</Badge>
                    </div>
                    <h3 className="mt-2 font-semibold">{ticket.subject}</h3>
                    <p className="text-sm text-muted-foreground">
                      {ticket.name} · {ticket.email} · {ticket.category}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
