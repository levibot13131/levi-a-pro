
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Computed properties
  const isAuthenticated = !!user && !!session;
  const isAdmin = user?.email === 'almogahronov1997@gmail.com' || user?.user_metadata?.role === 'admin';

  useEffect(() => {
    console.log('🔐 Initializing authentication...');

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session ? { user: session.user?.email } : 'No session');
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      console.log('Auth initialized:', session ? `User: ${session.user?.email}` : 'No user');
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    console.log('Attempting sign in for:', email);
    setIsLoading(true);

    // Admin bypass for development
    if (email === 'almogahronov1997@gmail.com') {
      console.log('Admin bypass - creating live session');
      const mockUser = {
        id: 'admin-user-id',
        email: email,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
        user_metadata: { role: 'admin' },
        app_metadata: { role: 'admin' }
      } as User;

      const mockSession = {
        access_token: 'mock-admin-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session;

      setUser(mockUser);
      setSession(mockSession);
      setIsLoading(false);
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setIsLoading(false);
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    setIsLoading(true);
    
    const redirectUrl = `${window.location.origin}/`;
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });

    setIsLoading(false);
    return { error };
  };

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsLoading(false);
  };

  // Alternative methods for compatibility
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast.error('שגיאת התחברות', {
          description: error.message,
        });
        return false;
      }
      toast.success('התחברת בהצלחה!');
      return true;
    } catch (error) {
      toast.error('שגיאה בהתחברות');
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut();
      toast.success('התנתקת בהצלחה');
    } catch (error) {
      toast.error('שגיאה בהתנתקות');
    }
  };

  const register = async (email: string, password: string, displayName?: string): Promise<boolean> => {
    try {
      const { error } = await signUp(email, password);
      if (error) {
        toast.error('שגיאת רישום', {
          description: error.message,
        });
        return false;
      }
      toast.success('נרשמת בהצלחה! בדוק את האימייל שלך לאישור');
      return true;
    } catch (error) {
      toast.error('שגיאה ברישום');
      return false;
    }
  };

  const value = {
    user,
    session,
    isLoading,
    isAuthenticated,
    isAdmin,
    signIn,
    signUp,
    signOut,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
