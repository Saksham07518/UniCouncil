-- ============================================
-- 1. Create a secure RPC function to tally votes
-- ============================================
-- The SECURITY DEFINER flag allows this function to bypass RLS.

CREATE OR REPLACE FUNCTION public.get_vote_counts()
RETURNS TABLE(candidate_id text, vote_count bigint)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT candidate_id, COUNT(*) as vote_count 
  FROM public.votes 
  GROUP BY candidate_id;
$$;

-- Allow anyone (authenticated or anonymous) to call this function
GRANT EXECUTE ON FUNCTION public.get_vote_counts() TO authenticated, anon;


-- ============================================
-- 2. Create RPC function to get total student turnout
-- ============================================
CREATE OR REPLACE FUNCTION public.get_voter_turnout()
RETURNS bigint
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(DISTINCT voter_id) FROM public.votes;
$$;

GRANT EXECUTE ON FUNCTION public.get_voter_turnout() TO authenticated, anon;
