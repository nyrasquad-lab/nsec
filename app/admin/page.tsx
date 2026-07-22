'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Github,
  Loader2,
  FolderKanban,
  Search,
  LayoutDashboard,
  ArrowLeft,
} from 'lucide-react';
import { getSupabase } from '@/lib/supabase-client';
import { cn } from '@/lib/utils';

type ProjectStatus = 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'archived';

interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  hosting_provider: string | null;
  hosting_url: string | null;
  repository_url: string | null;
  tech_stack: string[] | null;
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<ProjectStatus, { label: string; color: string; dot: string }> = {
  planning: { label: 'Planning', color: 'text-amber-400 border-amber-400/30 bg-amber-400/10', dot: 'bg-amber-400' },
  in_progress: { label: 'In Progress', color: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10', dot: 'bg-cyan-400' },
  on_hold: { label: 'On Hold', color: 'text-orange-400 border-orange-400/30 bg-orange-400/10', dot: 'bg-orange-400' },
  completed: { label: 'Completed', color: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10', dot: 'bg-emerald-400' },
  archived: { label: 'Archived', color: 'text-slate-400 border-slate-400/30 bg-slate-400/10', dot: 'bg-slate-400' },
};

const STATUSES = Object.keys(STATUS_CONFIG) as ProjectStatus[];

const emptyForm = {
  name: '',
  description: '',
  status: 'planning' as ProjectStatus,
  hosting_provider: '',
  hosting_url: '',
  repository_url: '',
  tech_stack: '',
  start_date: '',
  due_date: '',
};

export default function AdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await getSupabase()
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setProjects(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.hosting_provider || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: projects.length,
    inProgress: projects.filter((p) => p.status === 'in_progress').length,
    completed: projects.filter((p) => p.status === 'completed').length,
    planning: projects.filter((p) => p.status === 'planning').length,
  };

  function openCreate() {
    setForm(emptyForm);
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(p: Project) {
    setForm({
      name: p.name,
      description: p.description || '',
      status: p.status,
      hosting_provider: p.hosting_provider || '',
      hosting_url: p.hosting_url || '',
      repository_url: p.repository_url || '',
      tech_stack: (p.tech_stack || []).join(', '),
      start_date: p.start_date || '',
      due_date: p.due_date || '',
    });
    setEditingId(p.id);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      name: form.name,
      description: form.description || null,
      status: form.status,
      hosting_provider: form.hosting_provider || null,
      hosting_url: form.hosting_url || null,
      repository_url: form.repository_url || null,
      tech_stack: form.tech_stack
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      start_date: form.start_date || null,
      due_date: form.due_date || null,
      completed_at: form.status === 'completed' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    };

    const supabase = getSupabase();
    let result;
    if (editingId) {
      result = await supabase.from('projects').update(payload).eq('id', editingId);
    } else {
      result = await supabase.from('projects').insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
      return;
    }

    setSaving(false);
    setModalOpen(false);
    fetchProjects();
  }

  async function handleDelete() {
    if (!deleteId) return;
    const { error } = await getSupabase().from('projects').delete().eq('id', deleteId);
    if (error) {
      setError(error.message);
    } else {
      setDeleteId(null);
      fetchProjects();
    }
  }

  return (
    <main className="relative min-h-screen bg-cyber-bg">
      <div className="pointer-events-none fixed inset-0 z-0 bg-grid opacity-20" />
      <div className="pointer-events-none fixed inset-0 z-0 bg-radial-fade" />

      <div className="relative z-10">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-white/10 bg-cyber-bg/80 backdrop-blur-xl">
          <div className="container-wide flex h-16 items-center justify-between px-6 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg border border-cyber-primary/40 bg-cyber-primary/10">
                <LayoutDashboard className="h-5 w-5 text-cyber-primary" />
              </span>
              <div>
                <h1 className="font-display text-sm font-semibold text-white">Admin Panel</h1>
                <p className="text-xs text-cyber-muted">Project Management</p>
              </div>
            </div>
            <a
              href="/"
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyber-muted transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Site
            </a>
          </div>
        </header>

        <div className="container-wide px-6 py-8 sm:px-8 lg:px-12">
          {/* Stats */}
          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              { label: 'Total Projects', value: stats.total, color: 'text-white' },
              { label: 'In Progress', value: stats.inProgress, color: 'text-cyan-400' },
              { label: 'Planning', value: stats.planning, color: 'text-amber-400' },
              { label: 'Completed', value: stats.completed, color: 'text-emerald-400' },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-white/10 bg-cyber-surface/50 p-5 backdrop-blur-xl"
              >
                <p className="text-xs uppercase tracking-wider text-cyber-muted">{s.label}</p>
                <p className={cn('mt-2 font-display text-3xl font-bold', s.color)}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative max-w-xs flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyber-muted" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-cyber-surface/50 py-2 pl-10 pr-4 text-sm text-white placeholder-cyber-muted outline-none transition-colors focus:border-cyber-primary/50"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as ProjectStatus | 'all')}
                className="rounded-lg border border-white/10 bg-cyber-surface/50 px-4 py-2 text-sm text-white outline-none transition-colors focus:border-cyber-primary/50"
              >
                <option value="all">All Statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-cyber-primary/40 bg-cyber-primary/10 px-4 py-2 text-sm font-medium text-cyber-primary transition-all hover:bg-cyber-primary/20 hover:glow-primary"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Project Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-24">
              <Loader2 className="h-8 w-8 animate-spin text-cyber-primary" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <FolderKanban className="h-12 w-12 text-cyber-muted/50" />
              <p className="mt-4 text-sm text-cyber-muted">
                {projects.length === 0 ? 'No projects yet. Create your first one.' : 'No projects match your filters.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filtered.map((p) => {
                  const sc = STATUS_CONFIG[p.status];
                  return (
                    <motion.div
                      key={p.id}
                      layout
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="group relative flex flex-col rounded-xl border border-white/10 bg-cyber-surface/50 p-5 backdrop-blur-xl transition-colors hover:border-white/20"
                    >
                      <div className="mb-3 flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-semibold text-white">{p.name}</h3>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
                            sc.color
                          )}
                        >
                          <span className={cn('h-1.5 w-1.5 rounded-full', sc.dot)} />
                          {sc.label}
                        </span>
                      </div>

                      {p.description && (
                        <p className="mb-4 line-clamp-2 text-sm text-cyber-muted">{p.description}</p>
                      )}

                      {p.tech_stack && p.tech_stack.length > 0 && (
                        <div className="mb-4 flex flex-wrap gap-1.5">
                          {p.tech_stack.slice(0, 4).map((t) => (
                            <span
                              key={t}
                              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-cyber-muted"
                            >
                              {t}
                            </span>
                          ))}
                          {p.tech_stack.length > 4 && (
                            <span className="px-2 py-0.5 text-xs text-cyber-muted">
                              +{p.tech_stack.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-auto space-y-1.5 text-xs text-cyber-muted">
                        {p.hosting_provider && (
                          <p>
                            <span className="text-cyber-muted/60">Host:</span> {p.hosting_provider}
                          </p>
                        )}
                        {p.start_date && (
                          <p>
                            <span className="text-cyber-muted/60">Started:</span>{' '}
                            {new Date(p.start_date).toLocaleDateString()}
                          </p>
                        )}
                        {p.due_date && (
                          <p>
                            <span className="text-cyber-muted/60">Due:</span>{' '}
                            {new Date(p.due_date).toLocaleDateString()}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                        {p.hosting_url && (
                          <a
                            href={p.hosting_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-cyber-muted transition-colors hover:text-cyber-accent"
                            title="Visit hosted project"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {p.repository_url && (
                          <a
                            href={p.repository_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-cyber-muted transition-colors hover:text-cyber-accent"
                            title="View repository"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        <div className="flex-1" />
                        <button
                          onClick={() => openEdit(p)}
                          className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-cyber-muted transition-colors hover:text-cyber-primary"
                          title="Edit project"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(p.id)}
                          className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-cyber-muted transition-colors hover:text-red-400"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-cyber-surface p-6 shadow-2xl"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-white">
                  {editingId ? 'Edit Project' : 'New Project'}
                </h2>
                <button
                  onClick={() => setModalOpen(false)}
                  className="grid h-8 w-8 place-items-center rounded-md border border-white/10 bg-white/5 text-cyber-muted transition-colors hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-cyber-muted">
                    Project Name *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-cyber-bg/50 px-4 py-2.5 text-sm text-white placeholder-cyber-muted/50 outline-none transition-colors focus:border-cyber-primary/50"
                    placeholder="My Security Project"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-cyber-muted">
                    Description
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3}
                    className="w-full rounded-lg border border-white/10 bg-cyber-bg/50 px-4 py-2.5 text-sm text-white placeholder-cyber-muted/50 outline-none transition-colors focus:border-cyber-primary/50"
                    placeholder="Brief description of the project..."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-cyber-muted">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
                      className="w-full rounded-lg border border-white/10 bg-cyber-bg/50 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyber-primary/50"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {STATUS_CONFIG[s].label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-cyber-muted">
                      Hosting Provider
                    </label>
                    <input
                      type="text"
                      value={form.hosting_provider}
                      onChange={(e) => setForm({ ...form, hosting_provider: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-cyber-bg/50 px-4 py-2.5 text-sm text-white placeholder-cyber-muted/50 outline-none transition-colors focus:border-cyber-primary/50"
                      placeholder="Vercel, AWS, GCP..."
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-cyber-muted">
                      Hosting URL
                    </label>
                    <input
                      type="url"
                      value={form.hosting_url}
                      onChange={(e) => setForm({ ...form, hosting_url: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-cyber-bg/50 px-4 py-2.5 text-sm text-white placeholder-cyber-muted/50 outline-none transition-colors focus:border-cyber-primary/50"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-cyber-muted">
                      Repository URL
                    </label>
                    <input
                      type="url"
                      value={form.repository_url}
                      onChange={(e) => setForm({ ...form, repository_url: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-cyber-bg/50 px-4 py-2.5 text-sm text-white placeholder-cyber-muted/50 outline-none transition-colors focus:border-cyber-primary/50"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-cyber-muted">
                    Tech Stack (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={form.tech_stack}
                    onChange={(e) => setForm({ ...form, tech_stack: e.target.value })}
                    className="w-full rounded-lg border border-white/10 bg-cyber-bg/50 px-4 py-2.5 text-sm text-white placeholder-cyber-muted/50 outline-none transition-colors focus:border-cyber-primary/50"
                    placeholder="React, Next.js, Supabase, Tailwind..."
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-cyber-muted">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={form.start_date}
                      onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-cyber-bg/50 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyber-primary/50"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-cyber-muted">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={form.due_date}
                      onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                      className="w-full rounded-lg border border-white/10 bg-cyber-bg/50 px-4 py-2.5 text-sm text-white outline-none transition-colors focus:border-cyber-primary/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyber-muted transition-colors hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg border border-cyber-primary/40 bg-cyber-primary/10 px-4 py-2 text-sm font-medium text-cyber-primary transition-all hover:bg-cyber-primary/20 hover:glow-primary disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                    {editingId ? 'Save Changes' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl border border-white/10 bg-cyber-surface p-6 text-center shadow-2xl"
            >
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-red-500/30 bg-red-500/10">
                <Trash2 className="h-6 w-6 text-red-400" />
              </div>
              <h3 className="font-display text-base font-semibold text-white">Delete Project?</h3>
              <p className="mt-2 text-sm text-cyber-muted">
                This action cannot be undone. The project will be permanently removed.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-cyber-muted transition-colors hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
