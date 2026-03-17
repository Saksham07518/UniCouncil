-- =========================================================================
-- MASTER DATABASE RESET & REPAIR
-- This script reconstructs EVERYTHING to ensure registration and login work.
-- Run this in your Supabase SQL Editor.
-- =========================================================================

-- 1. RECONSTRUCT: registered_students
-- (Ensures the table exists and has the right columns)
CREATE TABLE IF NOT EXISTS public.registered_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. RECONSTRUCT: profiles
-- (Ensures the table exists and has the right columns)
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

-- 3. ENABLE RLS
ALTER TABLE public.registered_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. POLICIES: registered_students
DROP POLICY IF EXISTS "Anyone can register" ON public.registered_students;
CREATE POLICY "Anyone can register" ON public.registered_students FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can check registration" ON public.registered_students;
CREATE POLICY "Anyone can check registration" ON public.registered_students FOR SELECT USING (true);

-- 5. POLICIES: profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 6. TRIGGER: Authentication Sync
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  reg_name TEXT;
  reg_roll TEXT;
  clean_auth_phone TEXT;
BEGIN
  -- Normalize phone (digits only)
  clean_auth_phone := regexp_replace(COALESCE(NEW.phone, ''), '\D', '', 'g');

  -- Look up registration data by matching last 10 digits
  SELECT r.name, r.roll_number
    INTO reg_name, reg_roll
    FROM public.registered_students r
   WHERE regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g') LIKE '%' || right(clean_auth_phone, 10)
   LIMIT 1;

  -- Create profile
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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. REPAIR: Move any existing auth users to profiles now
-- (This fixes any users who registered but didn't get a profile)
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
