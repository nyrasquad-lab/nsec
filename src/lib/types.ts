export interface Ticket {
  id: string
  ticket_number: number
  name: string
  email: string
  phone: string | null
  category: string
  priority: string
  subject: string
  description: string
  status: string
  admin_notes: string | null
  created_at: string
  updated_at: string
}

export interface TicketReply {
  id: string
  ticket_id: string
  author_role: 'admin' | 'user'
  message: string
  status_change: string | null
  created_at: string
}

export const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export const STATUS_COLORS: Record<string, string> = {
  open: '#3b82f6',
  in_progress: '#f59e0b',
  resolved: '#10b981',
  closed: '#6b7280',
}

export const CATEGORY_LABELS: Record<string, string> = {
  hardware: 'Hardware',
  software: 'Software',
  network: 'Network',
  account: 'Account',
  other: 'Other',
}

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
}

export const PRIORITY_COLORS: Record<string, string> = {
  low: '#10b981',
  medium: '#3b82f6',
  high: '#f59e0b',
  urgent: '#ef4444',
}
