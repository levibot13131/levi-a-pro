
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface User {
  email?: string;
  displayName?: string;
  photoURL?: string;
  // Add other properties as needed
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, displayName: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  register: async () => false,
  logout: async () => {}
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
        email,
        displayName: 'Test User',
        photoURL: '',
      });
      return true;
    }
    return false;
  };
  
  const register = async (email: string, password: string, displayName: string): Promise<boolean> => {
    // Mock implementation
    if (email && password && displayName) {
      setUser({
        email,
        displayName,
        photoURL: '',
      });
      return true;
    }
    return false;
  };
  
  const logout = async (): Promise<void> => {
    setUser(null);
  };
  
  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.email === 'admin@example.com';

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin,
      login, 
      register,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
