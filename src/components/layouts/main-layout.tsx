
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'sonner';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Toaster richColors position="top-center" dir="rtl" closeButton={true} />
      <div className="flex min-h-screen flex-col">
        <header className="bg-primary text-primary-foreground py-2 px-4 text-center">
          <h1 className="text-lg font-bold">Levi Bot - מערכת מסחר אלגוריתמית</h1>
        </header>
        <div className="flex-1">
          <Outlet />
        </div>
        <footer className="py-3 px-4 text-center text-sm text-muted-foreground border-t">
          <p>Levi Bot &copy; 2025 - כל הזכויות שמורות</p>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
