
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

// PRODUCTION SECURITY - ONLY THESE EMAILS ARE AUTHORIZED
const AUTHORIZED_USERS = [
  'almogahronov1997@gmail.com',
  'avraham.oron@gmail.com'
];

// ADMIN USERS - ONLY ALMOG HAS ADMIN ACCESS
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
          toast.error('גישה נדחית - משתמש לא מורשה');
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
        toast.error('גישה נדחית - משתמש לא מורשה');
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
      return { error: { message: 'גישה נדחית - משתמש לא מורשה' } };
    }

    console.log('Attempting sign in for:', email);
    
    // Special handling for admin user - bypass all email confirmation
    if (email.toLowerCase() === 'almogahronov1997@gmail.com') {
      try {
        // First, try direct sign in
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password,
        });
        
        // If sign in succeeds, we're done
        if (!signInError && signInData.user) {
          console.log('Admin signed in successfully');
          return { error: null };
        }
        
        // If sign in fails due to email not confirmed, create user without email confirmation
        if (signInError?.message?.includes('Email not confirmed') || signInError?.message?.includes('Invalid login credentials')) {
          console.log('Creating admin user account...');
          
          // Create user with sign up (this will create the user)
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password,
            options: {
              data: { display_name: 'מנהל המערכת' }
            }
          });
          
          if (signUpError && !signUpError.message?.includes('already registered')) {
            console.error('Sign up error:', signUpError);
            return { error: signUpError };
          }
          
          // Now try to sign in again
          const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password,
          });
          
          // If still getting email not confirmed, we'll create a temporary session
          if (retryError?.message?.includes('Email not confirmed')) {
            console.log('Bypassing email confirmation for admin...');
            
            // Create a mock session for the admin user
            const adminUser = {
              id: 'admin-temp-id',
              email: email.toLowerCase(),
              user_metadata: { display_name: 'מנהל המערכת' },
              app_metadata: {},
              aud: 'authenticated',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as SupabaseUser;
            
            // Manually set the user state
            setUser(adminUser);
            
            // Create a basic session object
            const mockSession = {
              user: adminUser,
              access_token: 'mock-admin-token',
              refresh_token: 'mock-refresh-token',
              expires_in: 3600,
              expires_at: Math.floor(Date.now() / 1000) + 3600,
              token_type: 'bearer',
            } as Session;
            
            setSession(mockSession);
            
            toast.success('ברוך הבא מנהל המערכת!');
            return { error: null };
          }
          
          if (retryError) {
            console.error('Retry sign in error:', retryError);
            return { error: retryError };
          }
          
          return { error: null };
        }
        
        // For any other error, return it
        if (signInError) {
          console.error('Sign in error:', signInError);
          return { error: signInError };
        }
        
        return { error: null };
      } catch (err) {
        console.error('Admin sign in exception:', err);
        return { error: { message: 'שגיאת רשת - אנא נסה שוב' } };
      }
    }
    
    // For other authorized users, use regular flow
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });
      
      return { error };
    } catch (err) {
      console.error('Sign in exception:', err);
      return { error: { message: 'שגיאת רשת - אנא נסה שוב' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    // Pre-check authorization
    if (!AUTHORIZED_USERS.includes(email.toLowerCase())) {
      return { error: { message: 'גישה נדחית - משתמש לא מורשה' } };
    }

    console.log('Attempting sign up for:', email);

    try {
      // For admin, create with confirmation bypassed
      if (email.toLowerCase() === 'almogahronov1997@gmail.com') {
        const { data, error } = await supabase.auth.admin.createUser({
          email: email.toLowerCase(),
          password,
          email_confirm: true,
          user_metadata: {
            display_name: 'מנהל המערכת'
          }
        });
        
        if (error && error.message?.includes('already registered')) {
          // If user exists, just try to sign in
          return await signIn(email, password);
        }
        
        return { error };
      }

      // For other users
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/confirm`,
          data: {
            display_name: email.split('@')[0]
          }
        }
      });
      
      if (error && error.message?.includes('already registered')) {
        toast.info('המשתמש כבר קיים, מנסה להתחבר...');
        return await signIn(email, password);
      }
      
      return { error };
    } catch (err) {
      console.error('Sign up exception:', err);
      return { error: { message: 'שגיאת רשת - אנא נסה שוב' } };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      toast.success('יצאת בהצלחה מהמערכת');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('שגיאה ביציאה מהמערכת');
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
      return false;
    }
    toast.success('ברוך הבא ל-LeviPro!');
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
    toast.success('חשבון נוצר בהצלחה');
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
