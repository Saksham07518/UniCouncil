import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing env vars. Ensure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are provided.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function cleanUpAndCreate() {
  console.log('1. Trying to sign up admin account automatically...');

  // Supabase signUp automatically inserts into both auth.users and auth.identities correctly.
  const { data, error } = await supabase.auth.signUp({
    email: 'admin058@unicouncil.edu',
    password: 'unicouncil7',
    options: {
      data: {
        name: 'Central Admin',
      }
    }
  });

  if (error) {
    if (error.message.includes('already registered')) {
        console.log('User is already registered successfully. Now testing login...');
        const { error: loginError } = await supabase.auth.signInWithPassword({
            email: 'admin058@unicouncil.edu',
            password: 'unicouncil7',
        });
        if (loginError) {
             console.error('Login still failed. Manually deleting and recreating via Supabase Dashboard is required.');
             console.error('Error:', loginError.message);
        } else {
             console.log('Login successful! You are perfectly set up.');
        }
    } else {
        console.error('Failed to create user:', error.message);
    }
  } else {
    console.log('User successfully created and prepared for admin use!');
    console.log('User ID:', data.user?.id);
  }
}

cleanUpAndCreate();
