
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Permission } from '@/types/user';
import { 
  getCurrentUser, 
  loginUser, 
  logoutUser,
  hasPermission as checkPermission
} from '@/services/auth/userService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (resource: string, permission: 'view' | 'edit' | 'delete') => boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => false,
  logout: () => {},
  hasPermission: () => false,
  refreshUser: () => {}
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Load user on mount
  useEffect(() => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setIsAdmin(storedUser.role === 'admin');
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const loggedInUser = loginUser(email, password);
    if (loggedInUser) {
      setUser(loggedInUser);
      setIsAuthenticated(true);
      setIsAdmin(loggedInUser.role === 'admin');
      return true;
    }
    return false;
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const hasPermission = (resource: string, permission: 'view' | 'edit' | 'delete'): boolean => {
    return checkPermission(user, resource, permission);
  };

  const refreshUser = () => {
    const storedUser = getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
      setIsAdmin(storedUser.role === 'admin');
    } else {
      setUser(null);
      setIsAuthenticated(false);
      setIsAdmin(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      isAdmin,
      login, 
      logout,
      hasPermission,
      refreshUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
