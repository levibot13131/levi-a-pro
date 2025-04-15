
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  LineChart,
  AlertCircle,
  Settings,
  FileText,
  Database,
  Wallet,
  ExternalLink,
  Globe,
  MessageCircle,
  History,
  PieChart,
  Bitcoin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
  isCollapsed?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  title,
  icon,
  isActive = false,
  isCollapsed = false,
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
      )}
      title={isCollapsed ? title : undefined}
    >
      <div className={isCollapsed ? "mx-auto" : ""}>
        {icon}
      </div>
      {!isCollapsed && <span className="text-right flex-1">{title}</span>}
    </Link>
  );
};

const Navigation: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [localStorageChecked, setLocalStorageChecked] = useState(false);
  
  // Initialize collapse state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
      setIsCollapsed(savedState === 'true');
    }
    setLocalStorageChecked(true);
  }, []);
  
  // Save collapse state to localStorage
  useEffect(() => {
    if (localStorageChecked) {
      localStorage.setItem('sidebar-collapsed', isCollapsed.toString());
    }
  }, [isCollapsed, localStorageChecked]);

  const isActive = (path: string) => {
    return pathname === path;
  };
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={cn(
      "relative transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleCollapse}
        className="absolute -right-3 top-3 z-10 h-6 w-6 rounded-full border shadow-md bg-background"
      >
        {isCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </Button>
      
      <div className="px-3 py-2">
        {!isCollapsed && (
          <h3 className="text-right px-4 text-lg font-semibold tracking-tight mb-4">ניתוח טכני</h3>
        )}
        <nav className="space-y-1 mt-2">
          <NavItem
            href="/"
            title="ראשי"
            icon={<BarChart3 className="h-4 w-4" />}
            isActive={isActive('/')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/backtesting"
            title="בדיקת אסטרטגיות"
            icon={<History className="h-4 w-4" />}
            isActive={isActive('/backtesting')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/technical-analysis"
            title="ניתוח טכני"
            icon={<LineChart className="h-4 w-4" />}
            isActive={isActive('/technical-analysis')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/trading-signals"
            title="איתותי מסחר"
            icon={<AlertCircle className="h-4 w-4" />}
            isActive={isActive('/trading-signals')}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>

      <div className="px-3 py-2">
        {!isCollapsed && (
          <h3 className="text-right px-4 text-lg font-semibold tracking-tight mb-4">ניהול נכסים</h3>
        )}
        <nav className="space-y-1 mt-2">
          <NavItem
            href="/asset-tracker"
            title="מעקב נכסים"
            icon={<PieChart className="h-4 w-4" />}
            isActive={isActive('/asset-tracker')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/portfolio"
            title="תיק השקעות"
            icon={<Wallet className="h-4 w-4" />}
            isActive={isActive('/portfolio')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/crypto-sentiment"
            title="סנטימנט קריפטו"
            icon={<Bitcoin className="h-4 w-4" />}
            isActive={isActive('/crypto-sentiment')}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>

      <div className="px-3 py-2">
        {!isCollapsed && (
          <h3 className="text-right px-4 text-lg font-semibold tracking-tight mb-4">חיבורים חיצוניים</h3>
        )}
        <nav className="space-y-1 mt-2">
          <NavItem
            href="/binance-integration"
            title="Binance"
            icon={<Wallet className="h-4 w-4" />}
            isActive={isActive('/binance-integration')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/tradingview-integration"
            title="TradingView"
            icon={<ExternalLink className="h-4 w-4" />}
            isActive={isActive('/tradingview-integration')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/twitter-integration"
            title="Twitter/X"
            icon={<MessageCircle className="h-4 w-4" />}
            isActive={isActive('/twitter-integration')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/data-connections"
            title="חיבורי API"
            icon={<Database className="h-4 w-4" />}
            isActive={isActive('/data-connections')}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>

      <div className="px-3 py-2">
        {!isCollapsed && (
          <h3 className="text-right px-4 text-lg font-semibold tracking-tight mb-4">הגדרות</h3>
        )}
        <nav className="space-y-1 mt-2">
          <NavItem
            href="/settings"
            title="הגדרות כלליות"
            icon={<Settings className="h-4 w-4" />}
            isActive={isActive('/settings')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/proxy-settings"
            title="הגדרות פרוקסי"
            icon={<Globe className="h-4 w-4" />}
            isActive={isActive('/proxy-settings')}
            isCollapsed={isCollapsed}
          />
          <NavItem
            href="/faq"
            title="שאלות נפוצות"
            icon={<FileText className="h-4 w-4" />}
            isActive={isActive('/faq')}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
