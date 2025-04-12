
import React from 'react';
import { Outlet } from 'react-router-dom';
import { MainNav } from '@/components/main-nav';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex items-center h-16 px-4">
          <MainNav className="mx-6" />
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
