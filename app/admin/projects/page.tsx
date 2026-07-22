'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import type { Project } from '@/lib/types';
import { Loader2, Plus, ExternalLink, GitBranch } from 'lucide-react';

const statusColors: Record<string, 'default' | 'secondary' | 'success' | 'warning'> = {
  planning: 'warning',
  'in-progress': 'default',
  completed: 'success',
  'on-hold': 'secondary',
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects((data || []) as Project[]);
    setLoading(false);
  }

  useEffect(() => { fetchProjects(); }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData(e.currentTarget);
    const techStackStr = formData.get('tech_stack') as string;
    const payload = {
      name: formData.get('name'),
      description: formData.get('description'),
      status: formData.get('status'),
      hosting_provider: formData.get('hosting_provider'),
      hosting_url: formData.get('hosting_url'),
      repository_url: formData.get('repository_url'),
      tech_stack: techStackStr ? techStackStr.split(',').map((s) => s.trim()) : [],
      start_date: formData.get('start_date') || null,
      due_date: formData.get('due_date') || null,
    };
    await supabase.from('projects').insert(payload);
    setCreating(false);
    setShowForm(false);
    fetchProjects();
  }

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" /> New Project
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader><CardTitle className="text-base">Create New Project</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Project Name *</Label>
                  <Input id="name" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select id="status" name="status" defaultValue="planning">
                    <option value="planning">Planning</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={2} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hosting_provider">Hosting Provider</Label>
                  <Input id="hosting_provider" name="hosting_provider" placeholder="AWS, Vercel, etc." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
                  <Input id="tech_stack" name="tech_stack" placeholder="React, Node.js, PostgreSQL" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="hosting_url">Hosting URL</Label>
                  <Input id="hosting_url" name="hosting_url" placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repository_url">Repository URL</Label>
                  <Input id="repository_url" name="repository_url" placeholder="https://github.com/..." />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" name="start_date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input id="due_date" name="due_date" type="date" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating...</> : 'Create Project'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {projects.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">No projects yet.</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant={statusColors[project.status] || 'default'}>
                    {project.status.replace('-', ' ')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {project.description && <p className="mb-3 text-sm text-muted-foreground">{project.description}</p>}
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1">
                    {project.tech_stack.map((tech) => (
                      <span key={tech} className="rounded bg-secondary px-2 py-0.5 text-xs">{tech}</span>
                    ))}
                  </div>
                )}
                <div className="flex gap-3 text-sm">
                  {project.hosting_url && (
                    <a href={project.hosting_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                      <ExternalLink className="h-3 w-3" /> Live
                    </a>
                  )}
                  {project.repository_url && (
                    <a href={project.repository_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-primary hover:underline">
                      <GitBranch className="h-3 w-3" /> Repo
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
