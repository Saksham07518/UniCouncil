-- =========================================================================
-- DIAGNOSTIC & CLEANUP SCRIPT
-- Run this to clear "New Student" junk and see what's actually happening.
-- =========================================================================

-- 1. DELETE "New Student" profiles that are orphans
-- (This cleans up the 4 mystery rows)
DELETE FROM public.profiles 
WHERE name = 'New Student';

-- 2. Check for mismatches (Run this and look at the Results tab)
-- This shows you exactly what the trigger sees.
SELECT 
    u.id as auth_id,
    u.phone as auth_phone,
    regexp_replace(COALESCE(u.phone, ''), '\D', '', 'g') as clean_auth,
    right(regexp_replace(COALESCE(u.phone, ''), '\D', '', 'g'), 10) as last_10_auth,
    r.name as registered_name,
    r.phone as registered_phone
FROM auth.users u
LEFT JOIN public.registered_students r 
    ON regexp_replace(COALESCE(u.phone, ''), '\D', '', 'g') LIKE '%' || right(regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g'), 10)
ORDER BY u.created_at DESC;

-- 3. UPDATED TRIGGER (Even more aggressive matching)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  reg_name TEXT;
  reg_roll TEXT;
  clean_auth_phone TEXT;
BEGIN
  -- Normalize to last 10 digits only
  clean_auth_phone := right(regexp_replace(COALESCE(NEW.phone, ''), '\D', '', 'g'), 10);

  -- Log for debugging (You can see this in Supabase Logs)
  RAISE NOTICE 'Attempting to sync user with phone suffix: %', clean_auth_phone;

  -- Match strictly by last 10 digits
  SELECT r.name, r.roll_number
    INTO reg_name, reg_roll
    FROM public.registered_students r
   WHERE right(regexp_replace(COALESCE(r.phone, ''), '\D', '', 'g'), 10) = clean_auth_phone
   LIMIT 1;

  -- Create profile
  INSERT INTO public.profiles (id, name, phone, roll_number)
  VALUES (
    NEW.id,
    COALESCE(reg_name, 'New Student'),
    NEW.phone,
    reg_roll
  )
  ON CONFLICT (id) DO UPDATE 
  SET name = EXCLUDED.name, 
      roll_number = EXCLUDED.roll_number,
      phone = EXCLUDED.phone;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
