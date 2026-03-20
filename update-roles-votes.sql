-- ==========================================================
-- SCRIPT TO ALLOW ADMINS TO DELETE VOTES FOR 'REVOTE' FEATURE
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==========================================================

-- Allow Admins to DELETE votes so they can let users Revote
DROP POLICY IF EXISTS "Admins can delete votes" ON public.votes;
CREATE POLICY "Admins can delete votes"
  ON public.votes
  FOR DELETE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );
