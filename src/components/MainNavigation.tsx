
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Cpu,
  LineChart,
  Activity,
  Radio,
  Layers,
  BookOpen,
  AlarmClock,
  ShieldAlert,
  UserCircle,
  Settings,
  Newspaper,
  Briefcase,
  Lightbulb,
  Globe,
} from 'lucide-react';

const MainNavigation = () => {
  const { isAdmin } = useAuth();

  const navLinks = [
    { name: 'רשימת מעקב', path: '/asset-tracker', icon: <Layers className="ml-2 h-5 w-5" /> },
    { name: 'איתותי מסחר', path: '/trading-signals', icon: <Radio className="ml-2 h-5 w-5" /> },
    { name: 'ניתוח טכני', path: '/technical-analysis', icon: <LineChart className="ml-2 h-5 w-5" /> },
    { name: 'חדשות שוק', path: '/market-data', icon: <Newspaper className="ml-2 h-5 w-5" /> },
    { name: 'ניהול סיכונים', path: '/risk-management', icon: <ShieldAlert className="ml-2 h-5 w-5" /> },
    { name: 'מקורות מידע', path: '/information-sources', icon: <Globe className="ml-2 h-5 w-5" /> },
    { name: 'חיבור TradingView', path: '/tradingview-integration', icon: <Activity className="ml-2 h-5 w-5" /> },
    { name: 'חיבור Binance', path: '/binance-integration', icon: <Briefcase className="ml-2 h-5 w-5" /> },
    { name: 'בקטסטינג', path: '/backtesting', icon: <AlarmClock className="ml-2 h-5 w-5" /> },
    { name: 'יומן מסחר', path: '/journal', icon: <BookOpen className="ml-2 h-5 w-5" /> },
    // Admin link shown only to admins
    ...(isAdmin ? [{ name: 'ניהול מערכת', path: '/admin', icon: <Cpu className="ml-2 h-5 w-5" /> }] : []),
    // Special section
    { name: 'פרופיל', path: '/profile', icon: <UserCircle className="ml-2 h-5 w-5" /> },
    { name: 'הגדרות', path: '/settings', icon: <Settings className="ml-2 h-5 w-5" /> },
  ];

  return (
    <aside className="fixed inset-y-0 right-0 lg:right-auto z-50 w-72 bg-background overflow-y-auto border-l lg:border-r border-l-border lg:border-r-border pb-10 lg:pb-0 lg:w-64">
      <div className="flex flex-col h-full">
        <div className="h-16 flex items-center border-b px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <Lightbulb className="h-6 w-6" />
            <span className="text-xl">Levi Bot</span>
          </NavLink>
        </div>
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center py-2 px-3 rounded-md text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  {link.icon}
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t p-4">
          <div className="px-3 py-2">
            <h3 className="text-xs font-medium text-muted-foreground">מידע מערכת</h3>
            <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
              <div className="text-right">גרסה:</div>
              <div>1.0.0-beta</div>
              <div className="text-right">סטטוס:</div>
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
                מקוון
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default MainNavigation;
