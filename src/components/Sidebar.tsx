import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  Target,
  Calculator,
  BookOpen,
  Globe,
  Newspaper
} from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { logout } = useAuth();

  const navigation = [
    {
      name: 'לוח בקרה',
      href: '/dashboard',
      icon: BarChart3,
    },
    {
      name: 'איתותי מסחר',
      href: '/signals',
      icon: TrendingUp,
    },
    {
      name: 'מעבדת בחינה אחורית',
      href: '/backtesting',
      icon: Target,
    },
    {
      name: 'ניתוח פונדמנטלי',
      href: '/fundamentals',
      icon: Newspaper,
    },
    {
      name: 'מקורות מידע',
      href: '/fundamental-data',
      icon: Globe,
    },
    {
      name: 'מחשבונים',
      href: '/calculators',
      icon: Calculator,
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={cn(
      "fixed top-0 right-0 h-full bg-white border-l border-gray-200 z-40 transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          {!collapsed && (
            <h1 className="text-xl font-bold text-primary">LeviPro</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="p-2"
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  collapsed ? "justify-center" : ""
                )}
              >
                <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                {!collapsed && item.name}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            onClick={handleLogout}
            className={cn(
              "w-full justify-start text-gray-600 hover:text-gray-900",
              collapsed ? "justify-center px-2" : ""
            )}
          >
            <LogOut className={cn("h-4 w-4", collapsed ? "" : "mr-2")} />
            {!collapsed && "התנתק"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
