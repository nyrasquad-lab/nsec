export type Ticket = {
  id: string;
  ticket_number: number;
  name: string;
  email: string;
  phone: string;
  category: string;
  priority: string;
  subject: string;
  description: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
};

export type TicketReply = {
  id: string;
  ticket_id: string;
  author_role: string;
  message: string;
  status_change: string | null;
  created_at: string;
  admin_id: string | null;
};

export type Assessment = {
  id: string;
  full_name: string;
  email: string;
  organization: string | null;
  service: string | null;
  message: string;
  created_at: string;
};

export type Post = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  read_time: string;
  published_at: string;
  image_url: string;
  created_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  status: string;
  hosting_provider: string | null;
  hosting_url: string | null;
  repository_url: string | null;
  tech_stack: string[];
  start_date: string | null;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
};

export type Admin = {
  id: string;
  email: string;
  name: string;
  role: string;
  is_active: boolean;
  twofa_enabled: boolean;
  last_login_at: string | null;
  last_login_ip: string | null;
  created_at: string;
};

export type AuditLog = {
  id: string;
  admin_id: string | null;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
};

export type SecurityEvent = {
  id: string;
  admin_id: string | null;
  event_type: string;
  ip_address: string | null;
  user_agent: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
};

export type LoginHistory = {
  id: string;
  admin_id: string | null;
  email: string;
  success: boolean;
  ip_address: string | null;
  user_agent: string | null;
  failure_reason: string | null;
  created_at: string;
};
