
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  HomeIcon, 
  LineChart, 
  Wallet, 
  Newspaper, 
  AlertTriangle, 
  History, 
  Users,
  TrendingUp,
  Flame,
  BarChart2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import AdminMenu from './AdminMenu';

export const getRoutes = (isAdmin: boolean) => [
  {
    title: 'בית',
    href: '/',
    icon: HomeIcon,
  },
  {
    title: 'נתוני שוק',
    href: '/market-data',
    icon: LineChart,
  },
  {
    title: 'מטבעות חמים',
    href: '/trending-coins',
    icon: Flame,
  },
  {
    title: 'סנטימנט שוק',
    href: '/crypto-sentiment',
    icon: BarChart2,
  },
  {
    title: 'מעקב נכסים',
    href: '/asset-tracker',
    icon: Wallet,
  },
  {
    title: 'חדשות',
    href: '/market-news',
    icon: Newspaper,
  },
  {
    title: 'איתותי מסחר',
    href: '/trading-signals',
    icon: TrendingUp,
  },
  {
    title: 'ניהול סיכונים',
    href: '/risk-management',
    icon: AlertTriangle,
  },
  {
    title: 'בדיקה היסטורית',
    href: '/backtesting',
    icon: History,
  },
  {
    title: 'אינטגרציית Binance',
    href: '/binance-integration',
    icon: Wallet,
  },
];

const MainNavigation = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const routes = getRoutes(isAdmin);

  return (
    <div className="flex flex-col gap-1 p-4 border-l bg-background">
      <AdminMenu />
      
      {routes.map((route) => (
        <Button
          key={route.href}
          variant={location.pathname === route.href ? 'default' : 'ghost'}
          className={cn(
            'justify-start',
            location.pathname === route.href && 'bg-primary text-primary-foreground'
          )}
          asChild
        >
          <Link to={route.href}>
            <route.icon className="ml-2 h-4 w-4" />
            {route.title}
          </Link>
        </Button>
      ))}
    </div>
  );
};

export default MainNavigation;
