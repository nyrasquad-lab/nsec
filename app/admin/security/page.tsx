'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/admin/auth-context';
import type { SecurityEvent, LoginHistory } from '@/lib/types';
import { Loader2, ShieldAlert, LogIn, AlertTriangle } from 'lucide-react';

export default function SecurityPage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!token) return;
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
      try {
        const [eventsRes, historyRes] = await Promise.all([
          fetch(`${supabaseUrl}/functions/v1/admin-security-events`, {
            headers: { 'X-Admin-Token': token },
          }),
          fetch(`${supabaseUrl}/functions/v1/admin-login-history`, {
            headers: { 'X-Admin-Token': token },
          }),
        ]);

        if (eventsRes.ok) setEvents(await eventsRes.json());
        if (historyRes.ok) setLoginHistory(await historyRes.json());
      } catch {}
      setLoading(false);
    }
    fetchData();
  }, [token]);

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Security Center</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Security Events</h2>
          {events.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No security events recorded.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                      <ShieldAlert className="h-4 w-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{event.event_type}</span>
                      </div>
                      {event.ip_address && <p className="text-xs text-muted-foreground">IP: {event.ip_address}</p>}
                      {event.details && (
                        <pre className="mt-1 overflow-x-auto rounded bg-secondary p-2 text-xs">
                          {JSON.stringify(event.details, null, 2)}
                        </pre>
                      )}
                      <p className="mt-1 text-xs text-muted-foreground">{new Date(event.created_at).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Login History</h2>
          {loginHistory.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground">No login attempts recorded.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {loginHistory.map((entry) => (
                <Card key={entry.id}>
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${entry.success ? 'bg-success/10' : 'bg-destructive/10'}`}>
                      {entry.success ? <LogIn className="h-4 w-4 text-success" /> : <AlertTriangle className="h-4 w-4 text-destructive" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{entry.email}</span>
                        <Badge variant={entry.success ? 'success' : 'destructive'}>
                          {entry.success ? 'Success' : 'Failed'}
                        </Badge>
                      </div>
                      {entry.failure_reason && <p className="text-xs text-destructive">{entry.failure_reason}</p>}
                      {entry.ip_address && <p className="text-xs text-muted-foreground">IP: {entry.ip_address}</p>}
                      <p className="mt-1 text-xs text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
