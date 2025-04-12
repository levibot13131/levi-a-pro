
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-center" dir="rtl" closeButton={true} />
      <div className="flex min-h-screen flex-col">
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
