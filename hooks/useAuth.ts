import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile } from '../types/database';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

interface UseAuthReturn extends AuthState {
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  isConfigured: boolean;
}

export function useAuth(): UseAuthReturn {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    session: null,
    loading: true,
    error: null,
  });

  const isConfigured = isSupabaseConfigured();

  // Fetch user profile from database
  const fetchProfile = useCallback(async (userId: string) => {
    if (!isConfigured) return null;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    return data;
  }, [isConfigured]);

  // Initialize auth state
  useEffect(() => {
    if (!isConfigured) {
      setState(prev => ({ ...prev, loading: false }));
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      let profile = null;
      if (session?.user) {
        profile = await fetchProfile(session.user.id);
      }
      setState({
        user: session?.user ?? null,
        profile,
        session,
        loading: false,
        error: null,
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        let profile = null;
        if (session?.user) {
          profile = await fetchProfile(session.user.id);
        }
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          profile,
          session,
          loading: false,
        }));
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile, isConfigured]);

  // Sign up with email/password
  const signUp = async (email: string, password: string, username: string) => {
    if (!isConfigured) throw new Error('Supabase not configured');
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }
      }
    });

    if (error) {
      setState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }

    // Create profile after signup
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        display_name: username,
        is_public: true,
      });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }
    }

    setState(prev => ({ ...prev, loading: false }));
  };

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    if (!isConfigured) throw new Error('Supabase not configured');
    
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setState(prev => ({ ...prev, loading: false, error }));
      throw error;
    }

    setState(prev => ({ ...prev, loading: false }));
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    if (!isConfigured) throw new Error('Supabase not configured');
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setState(prev => ({ ...prev, error }));
      throw error;
    }
  };

  // Sign out
  const signOut = async () => {
    if (!isConfigured) return;
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      setState(prev => ({ ...prev, error }));
      throw error;
    }

    setState({
      user: null,
      profile: null,
      session: null,
      loading: false,
      error: null,
    });
  };

  // Reset password
  const resetPassword = async (email: string) => {
    if (!isConfigured) throw new Error('Supabase not configured');
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`
    });

    if (error) throw error;
  };

  // Update profile
  const updateProfile = async (updates: Partial<Profile>) => {
    if (!isConfigured || !state.user) throw new Error('Not authenticated');
    
    const { error } = await supabase
      .from('profiles')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', state.user.id);

    if (error) throw error;

    // Refresh profile
    const profile = await fetchProfile(state.user.id);
    setState(prev => ({ ...prev, profile }));
  };

  return {
    ...state,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    resetPassword,
    updateProfile,
    isConfigured,
  };
}

