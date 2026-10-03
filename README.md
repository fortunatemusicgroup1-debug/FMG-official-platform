# FORTUNATE MUSIC GROUP — Official Platform Starter

A real full-stack foundation for the FMG public website, artist portal and owner workflow.

## Stack
- Next.js App Router
- Supabase Auth
- Supabase Postgres + Row Level Security
- Supabase Storage for private audio/artwork
- Android app can use the same backend later

## Local setup
1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Create a Supabase project.
4. Add the project URL and publishable key to `.env.local`.
5. Run `supabase/schema.sql` in Supabase SQL Editor.
6. Create private Storage buckets: `fmg-audio`, `fmg-artwork`.
7. Add Storage RLS policies before production uploads.
8. `npm install` then `npm run dev`.

## Before calling it production-ready
- Verify email/auth settings and redirects.
- Securely create the first FMG owner and owner role.
- Add Storage RLS, upload size/type validation and virus/malware controls.
- Add approval/rejection server actions and audit logs.
- Add email/push notifications.
- Add complete release metadata validation.
- Add distribution-provider integrations.
- Connect the Android app.
- Configure domain, HTTPS, monitoring, backups and production secrets.
