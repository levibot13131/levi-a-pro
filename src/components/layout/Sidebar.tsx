import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  BarChart3,
  Settings,
  Activity,
  Shield,
  Zap,
  TrendingUp,
  Brain,
  Eye
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const { pathname } = useLocation();

  const navigation = [
    {
      name: 'דשבורד ראשי',
      href: '/',
      icon: BarChart3,
      current: pathname === '/'
    },
    {
      name: 'איתותים חיים',
      href: '/signals',
      icon: Zap,
      current: pathname === '/signals'
    },
    {
      name: 'ניתוח מקיף',
      href: '/analysis',
      icon: TrendingUp,
      current: pathname === '/analysis'
    },
    {
      name: 'למידה אדפטיבית',
      href: '/adaptive',
      icon: Brain,
      current: pathname === '/adaptive'
    },
    {
      name: 'ביקורת מערכת',
      href: '/audit',
      icon: Eye,
      current: pathname === '/audit'
    },
    {
      name: 'סקירת מערכת',
      href: '/system',
      icon: Activity,
      current: pathname === '/system'
    },
    {
      name: 'הגדרות',
      href: '/settings',
      icon: Settings,
      current: pathname === '/settings'
    }
  ];

  return (
    <div className={cn("flex flex-col border-r bg-secondary h-full w-60 py-4", className)}>
      <div className="px-6 mb-6">
        <Link to="/">
          <Button variant="ghost" className="w-full justify-start font-bold text-lg">
            <Shield className="h-4 w-4 mr-2" />
            LeviPro
          </Button>
        </Link>
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navigation.map((item) => (
          <Link key={item.href} to={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "justify-start w-full pl-9 font-normal",
                pathname === item.href && "font-semibold bg-accent hover:bg-accent-foreground/5 text-accent-foreground",
              )}
            >
              <item.icon className="h-4 w-4 mr-2" />
              {item.name}
            </Button>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
