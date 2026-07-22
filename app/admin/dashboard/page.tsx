'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Ticket, FolderKanban, FileText, ShieldAlert } from 'lucide-react';
import { useAuth } from '@/components/admin/auth-context';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const { admin, token } = useAuth();
  const [stats, setStats] = useState({ openTickets: 0, totalTickets: 0, projects: 0, assessments: 0 });

  useEffect(() => {
    async function fetchStats() {
      const [ticketsRes, openTicketsRes, projectsRes, assessmentsRes] = await Promise.all([
        supabase.from('tickets').select('*', { count: 'exact', head: true }),
        supabase.from('tickets').select('*', { count: 'exact', head: true }).neq('status', 'closed'),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('assessments').select('*', { count: 'exact', head: true }),
      ]);

      setStats({
        totalTickets: ticketsRes.count || 0,
        openTickets: openTicketsRes.count || 0,
        projects: projectsRes.count || 0,
        assessments: assessmentsRes.count || 0,
      });
    }
    fetchStats();
  }, []);

  const cards = [
    { title: 'Total Tickets', value: stats.totalTickets, icon: Ticket, desc: 'All submitted tickets' },
    { title: 'Open Tickets', value: stats.openTickets, icon: Ticket, desc: 'Tickets not yet closed' },
    { title: 'Projects', value: stats.projects, icon: FolderKanban, desc: 'Active and planned projects' },
    { title: 'Assessments', value: stats.assessments, icon: FileText, desc: 'Assessment requests' },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Dashboard</h1>
      <p className="mb-6 text-muted-foreground">Welcome back, {admin?.name}.</p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
