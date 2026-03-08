-- ============================================
-- UniCouncil - Supabase Database Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Create the profiles table
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

-- 2. Create registered_students table (pre-registration, no auth required)
CREATE TABLE IF NOT EXISTS public.registered_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registered_students ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert into registered_students (for registration)
DROP POLICY IF EXISTS "Anyone can register" ON public.registered_students;
CREATE POLICY "Anyone can register"
  ON public.registered_students
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to check if phone/roll exists (for validation)
DROP POLICY IF EXISTS "Anyone can check registration" ON public.registered_students;
CREATE POLICY "Anyone can check registration"
  ON public.registered_students
  FOR SELECT
  USING (true);

-- 3. RLS Policies

-- Users can read their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (limited fields)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Admins can read all profiles (uses JWT app_metadata to avoid recursion)
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Admins can update all profiles (uses JWT app_metadata to avoid recursion)
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- 4. Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  reg_name TEXT;
  reg_roll TEXT;
  phone_number TEXT;
BEGIN
  -- Get the phone number (strip + if present)
  phone_number := REPLACE(COALESCE(NEW.phone, ''), '+', '');

  -- Look up pre-registration data by phone number
  SELECT r.name, r.roll_number
    INTO reg_name, reg_roll
    FROM public.registered_students r
   WHERE r.phone = phone_number
   LIMIT 1;

  -- Insert the profile with registration data (if found) or defaults
  INSERT INTO public.profiles (id, name, phone, roll_number)
  VALUES (
    NEW.id,
    COALESCE(reg_name, NEW.raw_user_meta_data->>'name', ''),
    phone_number,
    reg_roll
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it already exists, then create it
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================
-- OPTIONAL: Insert a test admin user profile
-- (After signing up with a phone number, update
-- the profile role to 'admin' using this query)
-- ============================================
-- UPDATE public.profiles
-- SET role = 'admin', name = 'Admin User', roll_number = 'ADMIN001'
-- WHERE phone = '+919999999999';
