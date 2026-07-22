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
  updated_by: string | null
  created_at: string
  updated_at: string
}

export interface TicketReply {
  id: string
  ticket_id: string
  admin_id: string | null
  author_role: 'admin' | 'user'
  message: string
  status_change: string | null
  created_at: string
}

export interface Admin {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'viewer'
  is_active: boolean
  twofa_enabled: boolean
  last_login_at: string | null
  last_login_ip: string | null
  password_changed_at: string
  created_at: string
}

export interface LoginHistoryEntry {
  id: string
  admin_id: string | null
  email: string
  success: boolean
  ip_address: string | null
  user_agent: string | null
  failure_reason: string | null
  created_at: string
}

export interface SecurityEvent {
  id: string
  admin_id: string | null
  event_type: string
  ip_address: string | null
  user_agent: string | null
  details: Record<string, unknown> | null
  created_at: string
}

export interface AuditLog {
  id: string
  admin_id: string | null
  action: string
  entity_type: string | null
  entity_id: string | null
  details: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
}

export const STATUS_LABELS: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
}

export const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  in_progress: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  resolved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  closed: 'bg-gray-100 text-gray-600 dark:bg-gray-700/40 dark:text-gray-300',
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
  low: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  urgent: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
}

export const ROLE_LABELS: Record<string, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  viewer: 'Viewer',
}
