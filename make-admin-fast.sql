-- Run this in your Supabase Dashboard -> SQL Editor!
-- This will instantly force the 'admin058@unicouncil.edu' user to have the 'admin' role.

UPDATE public.profiles p
SET 
  role = 'admin', 
  name = 'Central Admin', 
  roll_number = 'ADMIN058'
FROM auth.users u
WHERE p.id = u.id AND u.email = 'admin058@unicouncil.edu';
