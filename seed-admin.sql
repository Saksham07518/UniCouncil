-- ==========================================================
-- SCRIPT TO CREATE THE HARDCODED ADMIN USER
-- Run this in your Supabase Dashboard -> SQL Editor
-- This strictly creates the 'admin058' account.
-- ==========================================================

-- 1. Enable pgcrypto just in case
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Insert the user into auth.users (if it doesn't already exist)
INSERT INTO auth.users (
  instance_id, 
  id, 
  aud, 
  role, 
  email, 
  encrypted_password, 
  email_confirmed_at, 
  raw_app_meta_data, 
  raw_user_meta_data, 
  created_at, 
  updated_at
)
SELECT 
  '00000000-0000-0000-0000-000000000000', 
  gen_random_uuid(), 
  'authenticated', 
  'authenticated', 
  'admin058@unicouncil.edu', 
  crypt('unicouncil7', gen_salt('bf')), 
  now(), 
  '{"provider": "email", "providers": ["email"]}', 
  '{}', 
  now(), 
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin058@unicouncil.edu'
);

-- 3. Update their Role in the profiles table (which was auto-created by the trigger)
UPDATE public.profiles p
SET 
  role = 'admin', 
  name = 'Central Admin', 
  roll_number = 'ADMIN058'
FROM auth.users u
WHERE p.id = u.id AND u.email = 'admin058@unicouncil.edu';
