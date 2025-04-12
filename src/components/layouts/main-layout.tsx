
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';
import AuthNavbar from '@/components/auth/AuthNavbar';
import { MainNav } from '@/components/main-nav';
import MainNavigation from '@/components/MainNavigation';
import { useAuth } from '@/contexts/AuthContext';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <AuthNavbar />
      
      <div className="flex flex-1 overflow-hidden">
        {isAuthenticated && (
          <div className="hidden md:block w-64 overflow-y-auto">
            <MainNavigation />
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
      
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
};

export default MainLayout;
