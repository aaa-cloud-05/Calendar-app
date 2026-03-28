-- RLS hardening for calendar-app
--
-- After this migration:
-- - Row Level Security is ON for invitations + responses.
-- - No permissive policies are added here, so the anon / authenticated roles
--   cannot SELECT/INSERT/UPDATE/DELETE via PostgREST unless you add policies.
-- - The Next.js app must use SUPABASE_SERVICE_ROLE_KEY (service_role bypasses RLS).
--
-- Apply in Supabase SQL Editor or: supabase db push (if CLI linked).

DO $$
BEGIN
  IF to_regclass('public.invitations') IS NOT NULL THEN
    ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
  END IF;
  IF to_regclass('public.responses') IS NOT NULL THEN
    ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;
