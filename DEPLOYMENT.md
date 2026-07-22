# IT Support Hub — Deployment Guide

## Prerequisites

- Node.js 20.x or later
- A Supabase project with the following environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL` — your Supabase project URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — your Supabase anon key
  - `SUPABASE_SERVICE_ROLE_KEY` — automatically configured in Supabase edge functions
  - `SUPABASE_URL` — automatically configured in Supabase edge functions

## Environment Variables

Create a `.env.local` file in the project root:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

The service role key and Supabase URL are automatically available to edge functions — do not put them in `.env`.

## Initial Setup

1. Deploy all edge functions (see Edge Functions section below)
2. Visit `/setup` to create the first administrator account
3. After the first admin is created, the setup page is disabled
4. Log in at `/login` and access the admin panel at `/admin`

## Deployment Platforms

### Vercel (Recommended)

1. Push the repository to GitHub
2. Import the project in Vercel
3. Vercel auto-detects Next.js
4. Add environment variables in the Vercel dashboard
5. Deploy

### Netlify

1. Push the repository to GitHub
2. Import the project in Netlify
3. The `netlify.toml` file is pre-configured
4. Add environment variables in the Netlify dashboard
5. Deploy

### Cloudflare Pages

1. Push the repository to GitHub
2. Create a new project in Cloudflare Pages
3. Build command: `npm run build`
4. Output directory: `.next`
5. Add environment variables
6. Deploy

### Railway / Render

1. Connect the repository
2. Build command: `npm run build`
3. Start command: `npm start`
4. Add environment variables
5. Deploy

## Edge Functions

The following edge functions must be deployed to Supabase:

| Function | Purpose |
|---|---|
| `admin-setup` | One-time first admin creation |
| `admin-login` | Admin authentication with bcrypt + rate limiting |
| `admin-logout` | Session logout |
| `admin-me` | Get current admin from session token |
| `admin-status` | Check if any admins exist |
| `admin-list` | List all admins (requires auth) |
| `admin-create` | Create new admin (requires auth) |
| `admin-delete` | Deactivate admin (requires auth) |
| `admin-login-history` | Fetch login history (requires auth) |
| `admin-security-events` | Fetch security events (requires auth) |
| `admin-audit-logs` | Fetch audit logs (requires auth) |
| `admin-update-ticket` | Update ticket status + reply + email notification |

Deploy each function using the Supabase MCP `deploy_edge_function` tool or the Supabase dashboard.

## Build Commands

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm start` — Start production server
- `npm run lint` — Run ESLint
