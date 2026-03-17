import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/app/lib/supabase';
import { Session } from '@supabase/supabase-js';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  rollNumber: string;
  role: 'student' | 'admin';
  hasVoted: boolean;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
  markAsVoted: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchProfile(session);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchProfile(session);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (session: Session) => {
    const userId = session.user.id;
    const email = session.user.email;
    try {
      setLoading(true);

      let data = null;
      let error = null;
      let retries = 0;
      const MAX_RETRIES = 5;

      // Aggressively poll the database for up to 5 seconds to give the Database Trigger time to finish
      while (retries < MAX_RETRIES) {
        const response = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        data = response.data;
        error = response.error;

        if (data) break; // Profile found! Exit the loop immediately.

        console.log(`Profile not found yet. Retrying in 1s... (Attempt ${retries + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        retries++;
      }

      if (error) {
        console.error('Error fetching profile:', error);
      } else if (data) {
        setUser({
          id: data.id,
          name: data.name,
          phone: data.phone,
          email: email,
          rollNumber: data.roll_number,
          role: data.role as 'student' | 'admin',
          hasVoted: data.has_voted,
        });
      } else {
        console.warn('Profile still not found after 5 retries. The database trigger might be failing.');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const markAsVoted = async () => {
    if (user) {
      // Optimistic update
      setUser({ ...user, hasVoted: true });

      // Update in Supabase
      const { error } = await supabase
        .from('profiles')
        .update({ has_voted: true })
        .eq('id', user.id);

      if (error) {
        console.error('Error marking as voted:', error);
        // Revert optimistic update on failure
        setUser({ ...user, hasVoted: false });
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, logout, markAsVoted }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
