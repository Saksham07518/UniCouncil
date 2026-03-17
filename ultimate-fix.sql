-- 1. DROP ANY ACCIDENTAL TRIGGERS ON REGISTERED_STUDENTS
-- (If you accidentally attached the auth trigger to this table, it will cause that error)
DROP TRIGGER IF EXISTS on_auth_user_created ON public.registered_students;
DROP TRIGGER IF EXISTS handle_new_user ON public.registered_students;

-- 2. RESET POLICIES ON REGISTERED_STUDENTS
DROP POLICY IF EXISTS "Anyone can register" ON public.registered_students;
DROP POLICY IF EXISTS "Anyone can check registration" ON public.registered_students;

CREATE POLICY "Anyone can register"
  ON public.registered_students
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can check registration"
  ON public.registered_students
  FOR SELECT
  USING (true);

-- 3. COMPLETELY REPLACE THE AUTH FUNCTION
-- This removes any old references to raw_user_meta
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

  INSERT INTO public.profiles (id, name, phone, roll_number)
  VALUES (
    NEW.id,
    COALESCE(reg_name, 'Unknown Student'),
    NEW.phone,
    reg_roll
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. ATTACH TRIGGER ONLY TO AUTH.USERS
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
