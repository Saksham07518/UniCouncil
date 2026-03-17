-- ============================================
-- RECREATE REGISTERED STUDENTS TABLE
-- ============================================

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.registered_students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  roll_number TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.registered_students ENABLE ROW LEVEL SECURITY;

-- 3. Allow ANYONE to insert a new student (for the Registration Page)
DROP POLICY IF EXISTS "Anyone can register" ON public.registered_students;
CREATE POLICY "Anyone can register"
  ON public.registered_students
  FOR INSERT
  WITH CHECK (true);

-- 4. Allow ANYONE to read the table (for validation on the Registration Page)
DROP POLICY IF EXISTS "Anyone can check registration" ON public.registered_students;
CREATE POLICY "Anyone can check registration"
  ON public.registered_students
  FOR SELECT
  USING (true);
