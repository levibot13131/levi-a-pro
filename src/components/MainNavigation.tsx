
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Rocket, BarChart4, Activity, LineChart, Target } from 'lucide-react';

const MainNavigation = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-primary/10 text-primary' : 'text-muted-foreground';
  };

  return (
    <div className="border-b">
      <div className="container flex h-16 items-center px-4 mx-auto">
        <div className="ml-auto flex gap-6 md:gap-10">
          <Link to="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6" />
            <span className="font-bold">AI-KSEM</span>
          </Link>
        </div>
        <div className="flex items-center space-x-4 mr-auto">
          <nav className="flex items-center space-x-6">
            <Link
              to="/trading-signals"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${isActive('/trading-signals')}`}
            >
              <Target className="h-4 w-4" />
              <span>איתותי מסחר</span>
            </Link>
            <Link
              to="/asset-tracker"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${isActive('/asset-tracker')}`}
            >
              <BarChart4 className="h-4 w-4" />
              <span>מעקב נכסים</span>
            </Link>
            <Link
              to="/risk-management"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${isActive('/risk-management')}`}
            >
              <Activity className="h-4 w-4" />
              <span>ניהול סיכונים</span>
            </Link>
            <Link
              to="/technical-analysis"
              className={`text-sm font-medium transition-colors hover:text-primary flex items-center gap-1 ${isActive('/technical-analysis')}`}
            >
              <LineChart className="h-4 w-4" />
              <span>ניתוח טכני</span>
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default MainNavigation;
