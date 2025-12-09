/**
 * AuthContext.tsx
 *
 * Provides authentication state and methods throughout the application.
 * Uses Supabase Auth for user management including:
 * - Email/password authentication
 * - Session management with "Remember Me" option
 * - Password recovery flow
 * - Profile management
 * - Email verification
 */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

/**
 * User profile data that can be updated
 */
interface UserProfile {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}

/**
 * Authentication context type definition
 * Provides all auth-related state and methods
 */
interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  updateProfile: (profile: UserProfile) => Promise<{ error: string | null }>;
  resendVerificationEmail: () => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      // Handle password recovery event
      if (event === 'PASSWORD_RECOVERY') {
        // User clicked password reset link - they can now update their password
        console.log('Password recovery mode active');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * Register a new user account
   * Creates user in Supabase Auth and optionally in users table
   * Sends verification email to the provided address
   *
   * @param email - User's email address
   * @param password - Password (min 6 characters)
   * @param name - User's full name
   * @param phone - User's phone number
   * @returns Object with error message if failed, null if successful
   */
  const signUp = async (email: string, password: string, name: string, phone: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
          },
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      // Also store in users table for easier querying
      if (data.user) {
        await supabase.from('users').upsert({
          id: data.user.id,
          email: email,
          name: name,
          phone: phone,
        });
      }

      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password. Please try again.' };
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Please verify your email before signing in. Check your inbox.' };
        }
        return { error: error.message };
      }

      // Handle remember me - Supabase handles session persistence automatically
      // For shorter sessions when not remembering, we could implement custom logic
      if (!rememberMe) {
        // Store a flag to clear session on browser close
        sessionStorage.setItem('aaocab-temp-session', 'true');
      } else {
        sessionStorage.removeItem('aaocab-temp-session');
      }

      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const signOut = async () => {
    sessionStorage.removeItem('aaocab-temp-session');
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const updatePassword = async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const updateProfile = async (profile: UserProfile) => {
    try {
      // Update auth user metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: profile,
      });

      if (authError) {
        return { error: authError.message };
      }

      // Also update users table if exists
      if (user) {
        await supabase.from('users').upsert({
          id: user.id,
          email: user.email,
          name: profile.full_name,
          phone: profile.phone,
        });
      }

      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  const resendVerificationEmail = async () => {
    try {
      if (!user?.email) {
        return { error: 'No email address found' };
      }

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
        options: {
          emailRedirectTo: `${window.location.origin}/login?verified=true`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch {
      return { error: 'An unexpected error occurred' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      loading,
      signUp,
      signIn,
      signOut,
      resetPassword,
      updatePassword,
      updateProfile,
      resendVerificationEmail,
    }}>
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
