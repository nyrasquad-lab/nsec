'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Mail, Building, Clock, LogOut, Loader2, Trash2, Search } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Assessment {
  id: string;
  full_name: string;
  email: string;
  organization: string | null;
  service: string | null;
  message: string | null;
  created_at: string;
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.replace('/login'); return; }
      await fetchAssessments();
      setLoading(false);
    })();
  }, [router]);

  async function fetchAssessments() {
    const { data } = await supabase.from('assessments').select('*').order('created_at', { ascending: false });
    setAssessments(data || []);
  }

  async function handleDelete(id: string) {
    setDeleting(id);
    await supabase.from('assessments').delete().eq('id', id);
    setAssessments((prev) => prev.filter((a) => a.id !== id));
    setDeleting(null);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace('/login');
  }

  const filtered = assessments.filter((a) =>
    a.full_name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    (a.organization || '').toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080f1d]">
        <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080f1d]">
      {/* Admin header */}
      <div className="border-b border-white/5 bg-[#0a1628]/90 backdrop-blur-lg">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-cyan-500/40 bg-cyan-500/10">
              <Shield className="h-5 w-5 text-cyan-400" />
            </div>
            <div>
              <span className="text-base font-bold text-white">Admin Panel</span>
              <span className="ml-2 font-mono text-xs text-cyan-400">NSEC Intelligence</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-white/40 hover:text-white">View Site</Link>
            <button onClick={handleSignOut} className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2 text-sm text-white/60 transition-all hover:border-red-500/30 hover:text-red-400">
              <LogOut className="h-4 w-4" /> Sign Out
            </button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/30">Total Submissions</div>
            <div className="mt-2 font-mono text-2xl font-bold text-cyan-400">{assessments.length}</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/30">Unique Organizations</div>
            <div className="mt-2 font-mono text-2xl font-bold text-cyan-400">{new Set(assessments.map((a) => a.organization).filter(Boolean)).size}</div>
          </div>
          <div className="rounded-xl border border-white/5 bg-white/[0.03] p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/30">Latest Submission</div>
            <div className="mt-2 font-mono text-sm font-medium text-white/70">
              {assessments[0] ? new Date(assessments[0].created_at).toLocaleDateString() : '—'}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search by name, email, or organization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 pl-10 pr-3 py-2 text-sm text-white placeholder:text-white/20 focus:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/[0.03]">
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-white/30">No assessment submissions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-white/30">Name</th>
                    <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-white/30">Email</th>
                    <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-white/30">Organization</th>
                    <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-white/30">Service</th>
                    <th className="px-4 py-3 text-left font-mono text-[10px] uppercase tracking-widest text-white/30">Date</th>
                    <th className="px-4 py-3 text-right font-mono text-[10px] uppercase tracking-widest text-white/30">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
                    <tr key={a.id} className="border-b border-white/5 transition-colors hover:bg-white/[0.02]">
                      <td className="px-4 py-3 text-sm text-white">{a.full_name}</td>
                      <td className="px-4 py-3 text-sm text-white/60">{a.email}</td>
                      <td className="px-4 py-3 text-sm text-white/60">{a.organization || '—'}</td>
                      <td className="px-4 py-3 text-sm">
                        {a.service ? <span className="rounded border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 text-xs text-cyan-400">{a.service}</span> : '—'}
                      </td>
                      <td className="px-4 py-3 text-sm text-white/40">{new Date(a.created_at).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDelete(a.id)}
                          disabled={deleting === a.id}
                          className="inline-flex items-center justify-center rounded-md p-1.5 text-white/30 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                        >
                          {deleting === a.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
