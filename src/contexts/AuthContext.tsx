
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
  const [isInitialized, setIsInitialized] = useState(false);

  const isAdmin = user?.email ? ADMIN_USERS.includes(user.email) : false;
  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || '';

  useEffect(() => {
    let mounted = true;

    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // Get initial session
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting initial session:', error);
        }

        if (mounted) {
          // Check authorization
          if (initialSession?.user?.email && !AUTHORIZED_USERS.includes(initialSession.user.email)) {
            console.log('Unauthorized existing session:', initialSession.user.email);
            await supabase.auth.signOut();
            toast.error('גישה נדחית - משתמש לא מורשה');
            setSession(null);
            setUser(null);
          } else {
            setSession(initialSession);
            setUser(initialSession?.user ?? null);
            
            if (initialSession?.user) {
              initializeUserEngineStatus(initialSession.user.id);
            }
          }
          
          setIsLoading(false);
          setIsInitialized(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth event:', event, newSession?.user?.email);
        
        if (!mounted) return;

        // Check authorization for new sessions
        if (newSession?.user?.email && !AUTHORIZED_USERS.includes(newSession.user.email)) {
          console.log('Unauthorized user attempted access:', newSession.user.email);
          await supabase.auth.signOut();
          toast.error('גישה נדחית - משתמש לא מורשה');
          return;
        }
        
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        // Auto-start engine for admin users (with delay to prevent loops)
        if (newSession?.user && ADMIN_USERS.includes(newSession.user.email) && event === 'SIGNED_IN') {
          setTimeout(() => {
            import('@/services/trading/engineController').then(({ engineController }) => {
              engineController.startEngine().then(() => {
                toast.success('מערכת LeviPro הופעלה אוטומטית!', {
                  description: 'מנוע האסטרטגיה האישית פועל עכשיו',
                  duration: 8000,
                });
              }).catch(console.error);
            }).catch(console.error);
          }, 2000);
        }
        
        // Initialize engine status for new authenticated users
        if (newSession?.user && event === 'SIGNED_IN') {
          initializeUserEngineStatus(newSession.user.id);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const initializeUserEngineStatus = async (userId: string) => {
    try {
      const { data: existingStatus } = await supabase
        .from('trading_engine_status')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!existingStatus) {
        await supabase
          .from('trading_engine_status')
          .insert([{
            user_id: userId,
            is_running: false,
            total_signals_generated: 0,
            profitable_signals: 0,
            success_rate: 0
          }]);
        console.log('Initialized engine status for user');
      }
    } catch (error) {
      console.error('Error initializing engine status:', error);
    }
  };

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
          return await signIn(email, password);
        }
        
        return { error };
      }

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

  // Don't render children until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white text-lg">🔐 LeviPro מתחיל...</p>
        </div>
      </div>
    );
  }

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
