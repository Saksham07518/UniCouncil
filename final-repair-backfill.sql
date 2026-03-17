-- =========================================================================
-- FINAL REPAIR SCRIPT: AUTH SYNC & PROFILE BACKFILL
-- Run this in your Supabase SQL Editor to fix ALL missing profiles
-- =========================================================================

-- 1. Ensure Profiles table exists with correct RLS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  roll_number TEXT UNIQUE,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  has_voted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Clean up old triggers/functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- 3. Create THE FINAL function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  reg_name TEXT;
  reg_roll TEXT;
  clean_auth_phone TEXT;
BEGIN
  -- Normalize the auth phone number (keep only digits)
  clean_auth_phone := regexp_replace(COALESCE(NEW.phone, ''), '\D', '', 'g');

  -- Look up pre-registration data
  -- We match the last 10 digits to be 100% safe
  SELECT r.name, r.roll_number
    INTO reg_name, reg_roll
    FROM public.registered_students r
   WHERE regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g') LIKE '%' || right(clean_auth_phone, 10)
   LIMIT 1;

  -- Create the profile with registration data or defaults
  INSERT INTO public.profiles (id, name, phone, roll_number)
  VALUES (
    NEW.id,
    COALESCE(reg_name, 'New Student'),
    NEW.phone,
    reg_roll
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Re-attach the trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================================
-- 5. CRITICAL: REPAIR EXISTING USERS
-- This manually creates profiles for anyone who is missing one right now!
-- =========================================================================
INSERT INTO public.profiles (id, name, phone, roll_number)
SELECT 
  u.id,
  COALESCE(r.name, 'New Student'),
  u.phone,
  r.roll_number
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.registered_students r ON regexp_replace(COALESCE(u.phone, ''), '\D', '', 'g') LIKE '%' || right(regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g'), 10)
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;
