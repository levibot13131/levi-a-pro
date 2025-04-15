
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Header from '@/components/layout/Header';

const Layout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden md:flex md:flex-col border-r overflow-y-auto bg-card transition-all duration-300">
        <div className="p-4">
          <h1 className="text-xl font-bold text-right mb-4">Levi-A-Pro</h1>
        </div>
        <Navigation />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
