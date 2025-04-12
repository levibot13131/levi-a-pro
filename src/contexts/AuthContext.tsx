
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  isAdmin?: boolean;
  role?: 'admin' | 'analyst' | 'trader' | 'viewer';
  lastLogin?: number;
  createdAt?: number;
  // Add other properties as needed
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => void;  // Added missing method
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  refreshUser: () => {}  // Added implementation
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // This would normally connect to your authentication service
  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock implementation
    if (email && password) {
      setUser({
        id: '1',
        email,
        displayName: 'Test User',
        photoURL: '',
        isAdmin: email === 'admin@example.com',
        role: email === 'admin@example.com' ? 'admin' : 'viewer',
        lastLogin: Date.now(),
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000 // 30 days ago
      });
      return true;
    }
    return false;
  };
  
  const register = async (email: string, password: string, displayName: string): Promise<boolean> => {
    // Mock implementation
    if (email && password && displayName) {
      setUser({
        id: '2',
        email,
        displayName,
        photoURL: '',
        isAdmin: false,
        role: 'viewer',
        lastLogin: Date.now(),
        createdAt: Date.now()
      });
      return true;
    }
    return false;
  };
  
  const logout = async (): Promise<void> => {
    setUser(null);
  };
  
  const refreshUser = () => {
    // In a real app, this would fetch the latest user data
    if (user) {
      setUser({ ...user });
    }
  };
  
  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && (user?.isAdmin === true || user?.role === 'admin');

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
