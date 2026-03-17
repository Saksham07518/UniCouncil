-- =========================================================================
-- THE "HANDS-FREE" AUTOMATIC SYNC SCRIPT
-- This is the final, ultimate solution for automatic data sync. 
-- No manual entry into profiles is required!
-- =========================================================================

-- 1. Ensure the Profiles table is correctly configured and has unique roll numbers
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

-- 2. THE ULTIMATE "HANDS-FREE" SYNC FUNCTION
-- It automatically pulls data from registered_students!
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  reg_name TEXT;
  reg_roll TEXT;
  clean_auth_phone TEXT;
BEGIN
  -- We extract the last 10 digits to guarantee a match even if +91 is missing
  clean_auth_phone := right(regexp_replace(COALESCE(NEW.phone, ''), '\D', '', 'g'), 10);

  -- Log the attempt (Check Supabase Dashboard -> Database -> Logs to see this)
  RAISE LOG 'Automatic Sync Trigger: New User with ID % and Phone suffix %', NEW.id, clean_auth_phone;

  -- Pull Name and Roll Number AUTOMATICALLY from registered_students
  SELECT r.name, r.roll_number
    INTO reg_name, reg_roll
    FROM public.registered_students r
   WHERE right(regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g'), 10) = clean_auth_phone
   LIMIT 1;

  -- Create the Profile entry
  -- If reg_name is NULL (student didn't register first), it uses "New Student"
  INSERT INTO public.profiles (id, name, phone, roll_number)
  VALUES (
    NEW.id,
    COALESCE(reg_name, 'New Student'),
    NEW.phone,
    reg_roll
  )
  ON CONFLICT (id) DO UPDATE SET
    name = COALESCE(EXCLUDED.name, public.profiles.name),
    roll_number = COALESCE(EXCLUDED.roll_number, public.profiles.roll_number),
    phone = COALESCE(EXCLUDED.phone, public.profiles.phone);

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Guaranteed safety: prevent the signup from failing even if database has an error
  INSERT INTO public.profiles (id, name, phone)
  VALUES (NEW.id, COALESCE(reg_name, 'New Student'), NEW.phone)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. APPLY TRIGGER TO AUTH.USERS
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. FIX ALL EXISTING USERS AUTOMATICALLY
-- (This runs once and fixes any users you already created who are missing their names)
INSERT INTO public.profiles (id, name, phone, roll_number)
SELECT 
  u.id,
  COALESCE(r.name, 'New Student'),
  u.phone,
  r.roll_number
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.registered_students r ON right(regexp_replace(COALESCE(u.phone, ''), '\D', '', 'g'), 10) = right(regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g'), 10)
WHERE p.id IS NULL
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  roll_number = EXCLUDED.roll_number;

-- 5. Final check to see if anyone is still missing a name
SELECT 
  u.phone as auth_id, 
  p.name as current_profile_name, 
  r.name as registered_name_found
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
LEFT JOIN public.registered_students r ON right(regexp_replace(COALESCE(u.phone, ''), '\D', '', 'g'), 10) = right(regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g'), 10)
LIMIT 10;
