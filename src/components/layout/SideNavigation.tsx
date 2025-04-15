
import React, { useCallback } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, ChevronRight, ChartBar, History, 
  Settings, Activity, LineChart, Users,
  Globe, Database, GitBranch, BookOpen
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// Navigation items configuration
const navItems = [
  { to: '/', label: 'דף הבית', icon: Home },
  { to: '/dashboard', label: 'דשבורד', icon: Activity },
  { to: '/trading', label: 'מסחר', icon: ChartBar },
  { to: '/backtesting', label: 'בקטסט', icon: History },
  { to: '/tradingview-integration', label: 'חיבור TradingView', icon: LineChart },
  { to: '/binance-integration', label: 'חיבור Binance', icon: Globe },
  { to: '/deployment-guide', label: 'הוראות הפצה', icon: BookOpen },
];

// Admin-only navigation items
const adminNavItems = [
  { to: '/admin/users', label: 'ניהול משתמשים', icon: Users },
  { to: '/admin/system', label: 'הגדרות מערכת', icon: Settings },
  { to: '/admin/api-connections', label: 'חיבורי API', icon: Database },
  { to: '/admin/logs', label: 'לוגים', icon: GitBranch },
];

const SideNavigation: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  // Function to determine if a nav link is active
  const isActive = useCallback((path: string) => {
    if (path === '/' && location.pathname !== '/') {
      return false;
    }
    return location.pathname.startsWith(path);
  }, [location.pathname]);
  
  return (
    <nav className="flex-1 py-4">
      <div className="space-y-1 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.to);
          
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", active && "text-primary-foreground")} />
              <span className="flex-1">{item.label}</span>
              <ChevronRight
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform",
                  active && "rotate-90 text-primary-foreground"
                )}
              />
            </NavLink>
          );
        })}
      </div>
      
      {isAdmin && (
        <div className="mt-8">
          <div className="px-3 mb-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              ניהול המערכת
            </h3>
          </div>
          <div className="space-y-1 px-2">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "text-primary-foreground")} />
                  <span className="flex-1">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default SideNavigation;
