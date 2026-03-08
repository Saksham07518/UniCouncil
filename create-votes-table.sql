-- ============================================
-- 6. Create the votes table
-- ============================================
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  voter_id UUID REFERENCES public.profiles(id) ON DELETE RESTRICT,
  candidate_id TEXT NOT NULL,
  position TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  -- Prevent the same voter from voting for the same position twice
  UNIQUE(voter_id, position)
);

-- Enable Row Level Security
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- 1. Users can only insert their own votes
DROP POLICY IF EXISTS "Users can cast their own votes" ON public.votes;
CREATE POLICY "Users can cast their own votes"
  ON public.votes
  FOR INSERT
  WITH CHECK (auth.uid() = voter_id);

-- 2. Users can view their own votes (optional, for verification)
DROP POLICY IF EXISTS "Users can view their own votes" ON public.votes;
CREATE POLICY "Users can view their own votes"
  ON public.votes
  FOR SELECT
  USING (auth.uid() = voter_id);

-- 3. Admins can view ALL votes (for counting results)
DROP POLICY IF EXISTS "Admins can view all votes" ON public.votes;
CREATE POLICY "Admins can view all votes"
  ON public.votes
  FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- No UPDATE or DELETE policies: Votes are permanent and immutable!
