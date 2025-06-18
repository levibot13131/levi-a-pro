
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: SupabaseUser | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  displayName?: string;
  photoURL?: string;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Authorized users list - PRODUCTION SECURITY
const AUTHORIZED_USERS = [
  'almogahronov1997@gmail.com',
  'avraham.oron@gmail.com'
];

// Admin users list
const ADMIN_USERS = [
  'almogahronov1997@gmail.com'
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.email ? ADMIN_USERS.includes(user.email) : false;
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || '';
  const photoURL = user?.user_metadata?.avatar_url || '';

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event, session?.user?.email);
        
        // Check if user is authorized
        if (session?.user?.email && !AUTHORIZED_USERS.includes(session.user.email)) {
          console.log('Unauthorized user attempted access:', session.user.email);
          supabase.auth.signOut();
          toast.error('Access denied - unauthorized user');
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // Check authorization
      if (session?.user?.email && !AUTHORIZED_USERS.includes(session.user.email)) {
        console.log('Unauthorized existing session:', session.user.email);
        supabase.auth.signOut();
        toast.error('Access denied - unauthorized user');
        return;
      }
      
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    // Pre-check authorization
    if (!AUTHORIZED_USERS.includes(email.toLowerCase())) {
      return { error: { message: 'Access denied - unauthorized user' } };
    }

    console.log('Attempting sign in for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // If user doesn't exist but is authorized, try to create them
        if (error.message === 'Invalid login credentials' && AUTHORIZED_USERS.includes(email.toLowerCase())) {
          toast.info('User not found, creating account...');
          return await signUp(email, password);
        }
      }
      
      return { error };
    } catch (err) {
      console.error('Sign in exception:', err);
      return { error: { message: 'Network error - please try again' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    // Pre-check authorization
    if (!AUTHORIZED_USERS.includes(email.toLowerCase())) {
      return { error: { message: 'Access denied - unauthorized user' } };
    }

    console.log('Attempting sign up for:', email);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            display_name: email.split('@')[0]
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
        
        // If user already exists, try to sign in instead
        if (error.message?.includes('already registered')) {
          toast.info('User exists, trying to sign in...');
          return await signIn(email, password);
        }
      } else if (data.user && !data.user.email_confirmed_at) {
        toast.success('Account created! Please check your email to confirm.');
      }
      
      return { error };
    } catch (err) {
      console.error('Sign up exception:', err);
      return { error: { message: 'Network error - please try again' } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  // Alias methods for backward compatibility
  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success('Welcome back!');
    return true;
  };

  const logout = async (): Promise<void> => {
    await signOut();
  };

  const register = async (email: string, password: string, displayName: string): Promise<boolean> => {
    const { error } = await signUp(email, password);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success('Account created successfully');
    return true;
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
    } catch (error) {
      console.error('Refresh user error:', error);
    }
  };

  const value = {
    user,
    session,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    displayName,
    photoURL,
    signIn,
    signUp,
    signOut,
    login,
    logout,
    register,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
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
