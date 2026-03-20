-- =========================================================================
-- COMPLETE DATABASE RESET FOR REGISTERED_STUDENTS
-- This will safely delete any broken rules causing the "raw_user_meta" error
-- =========================================================================

-- 1. DISABLE RLS TEMPORARILY TO CLEAR ANY BROKEN POLICIES
ALTER TABLE public.registered_students DISABLE ROW LEVEL SECURITY;

-- 2. DELETE EVERY SINGLE POLICY ON THE TABLE
DO $$ 
DECLARE 
    pol RECORD;
BEGIN 
    FOR pol IN (SELECT policyname FROM pg_policies WHERE tablename = 'registered_students' AND schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.registered_students', pol.policyname);
    END LOOP;
END $$;

-- 3. DELETE EVERY SINGLE TRIGGER ON THE TABLE
DO $$
DECLARE
    trg RECORD;
BEGIN
    FOR trg IN (SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'registered_students' AND trigger_schema = 'public') 
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.registered_students CASCADE', trg.trigger_name);
    END LOOP;
END $$;

-- 4. RE-ENABLE RLS AND ADD ONLY THE 2 CORRECT POLICIES
ALTER TABLE public.registered_students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can register"
  ON public.registered_students
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can check registration"
  ON public.registered_students
  FOR SELECT
  USING (true);

-- 5. ALSO FIX THE AUTH SYNC JUST IN CASE 
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  reg_name TEXT;
  reg_roll TEXT;
  clean_auth_phone TEXT;
BEGIN
  clean_auth_phone := regexp_replace(COALESCE(NEW.phone, ''), '\D', '', 'g');

  SELECT r.name, r.roll_number
    INTO reg_name, reg_roll
    FROM public.registered_students r
   WHERE regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g') LIKE '%' || right(clean_auth_phone, 10)
   LIMIT 1;

  INSERT INTO public.profiles (id, name, phone, roll_number, role)
  VALUES (
    NEW.id,
    CASE WHEN NEW.email IS NOT NULL THEN 'Admin User' ELSE COALESCE(reg_name, 'Unknown Student') END,
    NEW.phone,
    CASE WHEN NEW.email IS NOT NULL THEN 'ADMIN-001' ELSE reg_roll END,
    CASE WHEN NEW.email IS NOT NULL THEN 'admin' ELSE 'student' END
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
