-- =========================================================================
-- STEP 1: INSPECT RAW DATA
-- Run this to see EXACTLY what is in your tables.
-- =========================================================================

-- Check if ANY students are registered
SELECT 'Registered Students' as table_name, count(*) FROM public.registered_students;

-- Show the raw phone numbers from both tables
SELECT 
    'auth.users' as source, 
    phone as raw_phone, 
    regexp_replace(phone, '\D', '', 'g') as digits_only
FROM auth.users
LIMIT 5;

SELECT 
    'registered_students' as source, 
    phone as raw_phone, 
    regexp_replace(phone, '\D', '', 'g') as digits_only
FROM public.registered_students
LIMIT 5;

-- =========================================================================
-- STEP 2: MANUAL REPAIR / REGISTRATION
-- If your website registration is failing, use this to MANUALLY add yourself.
-- REPLACE the name, roll number, and phone below with your actual details!
-- =========================================================================

INSERT INTO public.registered_students (name, roll_number, phone)
VALUES (
    'Your Real Name',      -- Example: 'John Doe'
    'MANUAL-001',          -- Example: '12345/21'
    '+91XXXXXXXXXX'        -- Use the EXACT phone number shown in auth.users above!
)
ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name;

-- =========================================================================
-- STEP 3: FORCE RE-SYNC
-- After adding yourself above, run this to manually create your profile.
-- =========================================================================
INSERT INTO public.profiles (id, name, phone, roll_number)
SELECT 
  u.id,
  r.name,
  u.phone,
  r.roll_number
FROM auth.users u
JOIN public.registered_students r 
  ON right(regexp_replace(u.phone, '\D', '', 'g'), 10) = right(regexp_replace(r.phone, '\D', '', 'g'), 10)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  roll_number = EXCLUDED.roll_number;
