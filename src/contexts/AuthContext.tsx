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
    
    try {
      // First try to sign in with existing credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('Sign in error:', error);
        
        // Handle email not confirmed error for authorized users
        if (error.message === 'Email not confirmed' && AUTHORIZED_USERS.includes(email.toLowerCase())) {
          console.log('Email not confirmed for authorized user, attempting auto-signup...');
          
          // Try to create the account (this will work if the user doesn't exist yet)
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                display_name: email.split('@')[0]
              }
            }
          });
          
          if (signUpError) {
            console.error('Auto sign up error:', signUpError);
            return { error: { message: 'שגיאה ביצירת החשבון - אנא פנה למנהל המערכת' } };
          }
          
          // If signup was successful, the user is now created but needs confirmation
          // For authorized users, we'll inform them that the account was created
          if (signUpData.user && !signUpData.user.email_confirmed_at) {
            toast.success('חשבון נוצר בהצלחה! אנא בדוק את המייל לאישור או פנה למנהל המערכת.');
            return { error: { message: 'חשבון נוצר - נדרש אישור אימייל' } };
          }
          
          return { error: null };
        }
        
        // If user doesn't exist but is authorized, create them
        if (error.message === 'Invalid login credentials' && AUTHORIZED_USERS.includes(email.toLowerCase())) {
          console.log('User not found, creating account for authorized user...');
          
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email: email.toLowerCase(),
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`,
              data: {
                display_name: email.split('@')[0]
              }
            }
          });
          
          if (signUpError) {
            console.error('Auto sign up error:', signUpError);
            return { error: signUpError };
          }
          
          if (signUpData.user) {
            toast.success('חשבון נוצר בהצלחה!');
            return { error: null };
          }
        }
      }
      
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
      
      if (error) {
        console.error('Sign up error:', error);
        
        // If user already exists, try to sign in instead
        if (error.message?.includes('already registered')) {
          toast.info('המשתמש כבר קיים, מנסה להתחבר...');
          return await signIn(email, password);
        }
      } else if (data.user && !data.user.email_confirmed_at) {
        toast.success('חשבון נוצר בהצלחה! אנא בדוק את המייל לאישור.');
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
