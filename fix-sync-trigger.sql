-- ============================================
-- 1. CLEANUP: REMOVE OLD TRIGGER AND FUNCTION
-- ============================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ============================================
-- 2. CREATE THE INDESTRUCTIBLE SYNC FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  reg_name TEXT;
  reg_roll TEXT;
  clean_auth_phone TEXT;
BEGIN
  -- Normalize the auth phone number (keep only digits)
  clean_auth_phone := regexp_replace(COALESCE(NEW.phone, ''), '\D', '', 'g');

  -- Match against registered_students by comparing last 10 digits
  -- This makes it work even if country codes (+91) are missing or different
  SELECT r.name, r.roll_number
    INTO reg_name, reg_roll
    FROM public.registered_students r
   WHERE regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g') LIKE '%' || right(clean_auth_phone, 10)
   LIMIT 1;

  -- Create the profile with the found name and roll number
  INSERT INTO public.profiles (id, name, phone, roll_number)
  VALUES (
    NEW.id,
    COALESCE(reg_name, 'New Student'), -- Fallback if not found in registered_students
    NEW.phone,
    reg_roll
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 3. ATTACH THE TRIGGER TO AUTH.USERS
-- ============================================
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
