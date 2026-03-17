-- =========================================================================
-- FINAL BULLETPROOF SYNC SCRIPT
-- This script fixes the "No Row Created" and "New Student" issues once and for all.
-- =========================================================================

-- 1. Ensure the Profiles table is correctly configured
-- (We make roll_number nullable and handle conflicts better)
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

-- 2. THE BULLETPROOF TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  reg_name TEXT;
  reg_roll TEXT;
  clean_auth_phone TEXT;
BEGIN
  -- Normalize to last 10 digits
  clean_auth_phone := right(regexp_replace(COALESCE(NEW.phone, ''), '\D', '', 'g'), 10);

  -- 1. Try to find the student in registered_students
  SELECT r.name, r.roll_number
    INTO reg_name, reg_roll
    FROM public.registered_students r
   WHERE right(regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g'), 10) = clean_auth_phone
   LIMIT 1;

  -- 2. Perform the INSERT with extreme care
  -- We use a nested BEGIN/EXCEPTION to prevent the whole trigger from crashing
  BEGIN
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
  EXCEPTION WHEN OTHERS THEN
    -- If even that fails (e.g. roll_number conflict), insert with MINIMAL data
    -- This ensures the user AT LEAST has a profile row so they can login.
    INSERT INTO public.profiles (id, name, phone)
    VALUES (NEW.id, COALESCE(reg_name, 'New Student'), NEW.phone)
    ON CONFLICT (id) DO NOTHING;
  END;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Re-attach Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. EMERGENCY REPAIR: Fix any currently broken users
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
ON CONFLICT (id) DO NOTHING;
