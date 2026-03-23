-- ==========================================================
-- SCRIPT TO CLEAN UP CORRUPTED ADMIN USER
-- Run this in your Supabase Dashboard -> SQL Editor
-- This strictly removes the manually injected admin058 account.
-- ==========================================================

DELETE FROM public.votes 
WHERE voter_id IN (SELECT id FROM auth.users WHERE email = 'admin058@unicouncil.edu');

DELETE FROM public.profiles 
WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin058@unicouncil.edu');

DELETE FROM auth.identities 
WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'admin058@unicouncil.edu');

DELETE FROM auth.users 
WHERE email = 'admin058@unicouncil.edu';
