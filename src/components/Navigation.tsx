
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  BarChart3,
  TrendingUp,
  Newspaper,
  Activity,
  Settings,
  Shield,
  BookOpen,
  LineChart,
  Brain,
  Target
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const navigation = [
    {
      name: 'לוח בקרה ראשי',
      href: '/',
      icon: BarChart3,
    },
    {
      name: 'ניתוח טכני',
      href: '/technical-analysis',
      icon: TrendingUp,
    },
    {
      name: 'נתונים פונדמנטליים',
      href: '/fundamental-data',
      icon: BookOpen,
    },
    {
      name: 'סנטימנט השוק',
      href: '/market-sentiment',
      icon: Newspaper,
    },
    {
      name: 'ניתוח גרפים',
      href: '/charts-analysis',
      icon: LineChart,
    },
    {
      name: 'מנוע המסחר',
      href: '/trading-engine',
      icon: Activity,
    },
  ];

  // Add admin routes if user is admin
  if (isAdmin) {
    navigation.push({
      name: 'ניהול מערכת',
      href: '/admin',
      icon: Shield,
    });
  }

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname === href;
  };

  return (
    <nav className="flex-1 px-2 py-4 space-y-1">
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
              isActive(item.href)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <Icon className="ml-3 h-5 w-5 flex-shrink-0" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};

export default Navigation;
