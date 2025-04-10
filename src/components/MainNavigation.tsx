
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BarChart3, Newspaper, Target, Home, Activity, Brain, ShieldCheck } from 'lucide-react';

const MainNavigation = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary text-primary-foreground' : 'bg-transparent hover:bg-muted';
  };
  
  return (
    <nav className="sticky top-0 z-10 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b py-2">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">בוט מסחר AI</h2>
        </div>
        
        <div className="flex space-x-1 rtl:space-x-reverse">
          <Button variant="ghost" className={`${isActive('/')}`} asChild>
            <Link to="/">
              <Home className="h-4 w-4 mr-2" />
              בית
            </Link>
          </Button>
          
          <Button variant="ghost" className={`${isActive('/risk-management')}`} asChild>
            <Link to="/risk-management">
              <ShieldCheck className="h-4 w-4 mr-2" />
              ניהול סיכונים
            </Link>
          </Button>
          
          <Button variant="ghost" className={`${isActive('/technical-analysis')}`} asChild>
            <Link to="/technical-analysis">
              <Activity className="h-4 w-4 mr-2" />
              ניתוח טכני
            </Link>
          </Button>
          
          <Button variant="ghost" className={`${isActive('/comprehensive-analysis')}`} asChild>
            <Link to="/comprehensive-analysis">
              <Brain className="h-4 w-4 mr-2" />
              ניתוח מקיף
            </Link>
          </Button>
          
          <Button variant="ghost" className={`${isActive('/market-news')}`} asChild>
            <Link to="/market-news">
              <Newspaper className="h-4 w-4 mr-2" />
              חדשות
            </Link>
          </Button>
          
          <Button variant="ghost" className={`${isActive('/trading-signals')}`} asChild>
            <Link to="/trading-signals">
              <Target className="h-4 w-4 mr-2" />
              איתותים
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
