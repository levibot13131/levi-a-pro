
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  TrendingUp, 
  BarChart3, 
  BookOpen, 
  Brain,
  Activity,
  Settings,
  Users,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    {
      name: 'לוח בקרה',
      href: '/',
      icon: Home,
    },
    {
      name: 'ניתוח טכני',
      href: '/technical-analysis',
      icon: TrendingUp,
    },
    {
      name: 'גרפים וניתוח',
      href: '/charts-analysis',
      icon: BarChart3,
    },
    {
      name: 'נתונים פונדמנטליים',
      href: '/fundamental-data',
      icon: BookOpen,
    },
    {
      name: 'סנטימנט השוק',
      href: '/market-sentiment',
      icon: Brain,
    },
    {
      name: 'מנוע המסחר',
      href: '/trading-engine',
      icon: Activity,
    },
    {
      name: 'ניהול מערכת',
      href: '/admin',
      icon: Users,
    },
  ];

  return (
    <nav className="space-y-2 p-4">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.name}
            to={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent hover:text-accent-foreground text-right w-full',
              location.pathname === item.href
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1">{item.name}</span>
          </Link>
        );
      })}
      
      <div className="pt-4 border-t">
        <div className="text-xs text-muted-foreground mb-2 text-right">
          {user?.email}
        </div>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start text-right gap-3"
          size="sm"
        >
          <LogOut className="h-4 w-4" />
          התנתק
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
