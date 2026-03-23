-- ==========================================================
-- SCRIPT TO PROPERLY CREATE THE HARDCODED ADMIN USER
-- Run this in your Supabase Dashboard -> SQL Editor
-- This strictly creates the 'admin058' account, fixing the identities issue.
-- ==========================================================

-- 1. Enable pgcrypto just in case
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$ 
DECLARE 
  new_user_id UUID := gen_random_uuid();
BEGIN
  -- 2. Insert the user into auth.users (if it doesn't already exist)
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin058@unicouncil.edu') THEN
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
    VALUES (
      '00000000-0000-0000-0000-000000000000', 
      new_user_id, 
      'authenticated', 
      'authenticated', 
      'admin058@unicouncil.edu', 
      crypt('unicouncil7', gen_salt('bf')), 
      now(), 
      '{"provider": "email", "providers": ["email"]}', 
      '{}', 
      now(), 
      now()
    );

    -- 3. Insert into auth.identities so Supabase GoTrue allows login!
    INSERT INTO auth.identities (
      id,
      user_id,
      identity_data,
      provider,
      created_at,
      updated_at
    )
    VALUES (
      new_user_id::text,
      new_user_id,
      json_build_object('sub', new_user_id::text, 'email', 'admin058@unicouncil.edu', 'email_verified', true, 'phone_verified', false),
      'email',
      now(),
      now()
    );

  END IF;
END $$;

-- 4. Update their Role in the profiles table (which was auto-created by the trigger)
UPDATE public.profiles p
SET 
  role = 'admin', 
  name = 'Central Admin', 
  roll_number = 'ADMIN058'
FROM auth.users u
WHERE p.id = u.id AND u.email = 'admin058@unicouncil.edu';
