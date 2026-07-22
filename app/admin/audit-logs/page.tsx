'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/components/admin/auth-context';
import type { AuditLog } from '@/lib/types';
import { Loader2, ScrollText } from 'lucide-react';

export default function AuditLogsPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLogs() {
      if (!token) return;
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
      try {
        const res = await fetch(`${supabaseUrl}/functions/v1/admin-audit-logs`, {
          headers: { 'X-Admin-Token': token },
        });
        if (res.ok) {
          const data = await res.json();
          setLogs(data);
        }
      } catch {}
      setLoading(false);
    }
    fetchLogs();
  }, [token]);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Audit Logs</h1>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : logs.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No audit logs found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {logs.map((log) => (
            <Card key={log.id}>
              <CardContent className="flex items-start gap-3 p-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <ScrollText className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{log.action}</span>
                    {log.entity_type && (
                      <span className="text-xs text-muted-foreground">on {log.entity_type}</span>
                    )}
                  </div>
                  {log.ip_address && (
                    <p className="text-xs text-muted-foreground">IP: {log.ip_address}</p>
                  )}
                  {log.details && (
                    <pre className="mt-1 overflow-x-auto rounded bg-secondary p-2 text-xs">
                      {JSON.stringify(log.details, null, 2)}
                    </pre>
                  )}
                  <p className="mt-1 text-xs text-muted-foreground">
                    {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
