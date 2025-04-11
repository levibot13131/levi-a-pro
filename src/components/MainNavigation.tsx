
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  Home,
  LineChart,
  BarChart2,
  History,
  Robot,
  Shield,
  Bell,
  Newspaper,
  Database,
  Globe,
  Menu,
  X,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';

const MainNavigation: React.FC = () => {
  const location = useLocation();
  const { isMobile, isMenuOpen, setIsMenuOpen } = useMobile();

  const navLinks = [
    { path: '/', name: 'לוח מחוונים', icon: <Home className="h-5 w-5" /> },
    { path: '/technical-analysis', name: 'ניתוח טכני', icon: <LineChart className="h-5 w-5" /> },
    { path: '/comprehensive-analysis', name: 'ניתוח מקיף', icon: <BarChart2 className="h-5 w-5" /> },
    { path: '/backtesting', name: 'בדיקות אחורה', icon: <History className="h-5 w-5" /> },
    { path: '/trading-bots', name: 'בוטים למסחר', icon: <Robot className="h-5 w-5" /> },
    { path: '/risk-management', name: 'ניהול סיכונים', icon: <Shield className="h-5 w-5" /> },
    { path: '/trading-signals', name: 'איתותי מסחר', icon: <Bell className="h-5 w-5" /> },
    { path: '/market-news', name: 'חדשות שוק', icon: <Newspaper className="h-5 w-5" /> },
    { path: '/information-sources', name: 'מקורות מידע', icon: <Database className="h-5 w-5" /> },
    { path: '/market-data', name: 'נתוני שוק', icon: <Globe className="h-5 w-5" /> },
  ];

  return (
    <div className="mdm-navbar">
      {isMobile && (
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="mdm-mobile-menu-button"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      )}

      <nav
        className={cn(
          'mdm-navbar-nav',
          isMobile && (isMenuOpen ? 'block' : 'hidden')
        )}
      >
        <div className="mdm-navbar-items">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button
                variant={location.pathname === link.path ? 'default' : 'ghost'}
                className={cn(
                  'mdm-navbar-button',
                  location.pathname === link.path ? 'mdm-navbar-button-active' : ''
                )}
              >
                {link.icon}
                <span className="mdm-navbar-button-text">{link.name}</span>
              </Button>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default MainNavigation;
