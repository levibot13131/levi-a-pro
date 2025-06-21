
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

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        console.log('🔐 Initializing authentication...');
        
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth session error:', error);
        }

        if (mounted) {
          if (initialSession?.user?.email && !AUTHORIZED_USERS.includes(initialSession.user.email)) {
            console.log('Unauthorized user, signing out:', initialSession.user.email);
            await supabase.auth.signOut();
            setSession(null);
            setUser(null);
          } else {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            console.log('Auth initialized:', initialSession?.user?.email || 'No user');
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state change:', event, newSession?.user?.email);
        
        if (!mounted) return;

        // Check authorization for new sessions
        if (newSession?.user?.email && !AUTHORIZED_USERS.includes(newSession.user.email)) {
          console.log('Unauthorized user attempted access:', newSession.user.email);
          supabase.auth.signOut();
          toast.error('גישה נדחית - משתמש לא מורשה');
          return;
        }
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Only set loading to false after auth state is handled
        if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setIsLoading(false);
        }
      }
    );

    initAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    // Pre-check authorization
    if (!AUTHORIZED_USERS.includes(email.toLowerCase())) {
      return { error: { message: 'גישה נדחית - משתמש לא מורשה' } };
    }

    console.log('Attempting sign in for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });
      
      if (error && error.message?.includes('Email not confirmed')) {
        // For admin, bypass email confirmation
        if (email.toLowerCase() === 'almogahronov1997@gmail.com') {
          toast.success('ברוך הבא מנהל המערכת - LeviPro!');
          const adminUser = {
            id: 'admin-live-' + Date.now(),
            email: email.toLowerCase(),
            user_metadata: { display_name: 'מנהל המערכת - אלמוג' },
            app_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as SupabaseUser;
          
          setUser(adminUser);
          setSession({
            user: adminUser,
            access_token: 'admin-live-token',
            refresh_token: 'admin-refresh-token',
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            token_type: 'bearer',
          } as Session);
          
          return { error: null };
        }
      }
      
      return { error };
    } catch (err) {
      console.error('Sign in exception:', err);
      return { error: { message: 'שגיאת רשת - אנא נסה שוב' } };
    }
  };

  const signUp = async (email: string, password: string) => {
    if (!AUTHORIZED_USERS.includes(email.toLowerCase())) {
      return { error: { message: 'גישה נדחית - משתמש לא מורשה' } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth`,
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
    photoURL: '',
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
