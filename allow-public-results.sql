-- =========================================================================
-- PUBLIC RESULTS SCRIPT
-- Since we are now reading directly from the `votes` table instead of using RPCs,
-- we need to ensure that everyone is allowed to see the vote counts.
-- =========================================================================

-- Enable anyone (authenticated or not) to tally the votes for the dashboards
DROP POLICY IF EXISTS "Anyone can view votes" ON public.votes;

CREATE POLICY "Anyone can view votes"
  ON public.votes
  FOR SELECT
  USING (true);
