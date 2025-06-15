
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, logoutUser, getCurrentUser } from '@/services/auth/userService';
import { User } from '@/types/user';

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => void;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshUser: () => {}
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Initialize user from localStorage on app start
  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const loggedInUser = loginUser(email, password);
      if (loggedInUser) {
        setUser(loggedInUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };
  
  const register = async (email: string, password: string, displayName: string): Promise<boolean> => {
    // For now, redirect to login as registration is handled by admin
    return false;
  };
  
  const logout = async (): Promise<void> => {
    logoutUser();
    setUser(null);
  };
  
  const refreshUser = () => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
  };
  
  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && (user?.isAdmin === true || user?.role === 'admin');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin,
      login, 
      register,
      logout,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
