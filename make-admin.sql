-- ==========================================================
-- SCRIPT TO MAKE YOUR CURRENT EMAIL ACCOUNT AN ADMIN
-- Run this in your Supabase Dashboard -> SQL Editor
-- ==========================================================

UPDATE public.profiles p
SET 
  role = 'admin',
  name = 'Admin User',
  roll_number = 'ADMIN-001'
FROM auth.users u
WHERE p.id = u.id AND u.email IS NOT NULL AND p.role != 'admin';

-- This will instantly give any user who logged in with an email the 'admin' role.
