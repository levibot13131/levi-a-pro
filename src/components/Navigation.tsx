
import React from 'react';
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
  Bitcoin
} from 'lucide-react';

interface NavItemProps {
  href: string;
  title: string;
  icon: React.ReactNode;
  isActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  title,
  icon,
  isActive = false,
}) => {
  return (
    <Link
      to={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent",
        isActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground"
      )}
    >
      {icon}
      <span className="text-right flex-1">{title}</span>
    </Link>
  );
};

const Navigation: React.FC = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="px-3 py-2">
      <div className="mb-4">
        <h3 className="text-right px-4 text-lg font-semibold tracking-tight">ניתוח טכני</h3>
        <nav className="space-y-1 mt-2">
          <NavItem
            href="/"
            title="ראשי"
            icon={<BarChart3 className="h-4 w-4" />}
            isActive={isActive('/')}
          />
          <NavItem
            href="/backtesting"
            title="בדיקת אסטרטגיות"
            icon={<History className="h-4 w-4" />}
            isActive={isActive('/backtesting')}
          />
          <NavItem
            href="/technical-analysis"
            title="ניתוח טכני"
            icon={<LineChart className="h-4 w-4" />}
            isActive={isActive('/technical-analysis')}
          />
          <NavItem
            href="/trading-signals"
            title="איתותי מסחר"
            icon={<AlertCircle className="h-4 w-4" />}
            isActive={isActive('/trading-signals')}
          />
        </nav>
      </div>

      <div className="mb-4">
        <h3 className="text-right px-4 text-lg font-semibold tracking-tight">ניהול נכסים</h3>
        <nav className="space-y-1 mt-2">
          <NavItem
            href="/asset-tracker"
            title="מעקב נכסים"
            icon={<PieChart className="h-4 w-4" />}
            isActive={isActive('/asset-tracker')}
          />
          <NavItem
            href="/portfolio"
            title="תיק השקעות"
            icon={<Wallet className="h-4 w-4" />}
            isActive={isActive('/portfolio')}
          />
          <NavItem
            href="/crypto-sentiment"
            title="סנטימנט קריפטו"
            icon={<Bitcoin className="h-4 w-4" />}
            isActive={isActive('/crypto-sentiment')}
          />
        </nav>
      </div>

      <div className="mb-4">
        <h3 className="text-right px-4 text-lg font-semibold tracking-tight">חיבורים חיצוניים</h3>
        <nav className="space-y-1 mt-2">
          <NavItem
            href="/binance-integration"
            title="Binance"
            icon={<Wallet className="h-4 w-4" />}
            isActive={isActive('/binance-integration')}
          />
          <NavItem
            href="/tradingview-integration"
            title="TradingView"
            icon={<ExternalLink className="h-4 w-4" />}
            isActive={isActive('/tradingview-integration')}
          />
          <NavItem
            href="/twitter-integration"
            title="Twitter/X"
            icon={<MessageCircle className="h-4 w-4" />}
            isActive={isActive('/twitter-integration')}
          />
          <NavItem
            href="/data-connections"
            title="חיבורי API"
            icon={<Database className="h-4 w-4" />}
            isActive={isActive('/data-connections')}
          />
        </nav>
      </div>

      <div className="mb-4">
        <h3 className="text-right px-4 text-lg font-semibold tracking-tight">הגדרות</h3>
        <nav className="space-y-1 mt-2">
          <NavItem
            href="/settings"
            title="הגדרות כלליות"
            icon={<Settings className="h-4 w-4" />}
            isActive={isActive('/settings')}
          />
          <NavItem
            href="/proxy-settings"
            title="הגדרות פרוקסי"
            icon={<Globe className="h-4 w-4" />}
            isActive={isActive('/proxy-settings')}
          />
          <NavItem
            href="/faq"
            title="שאלות נפוצות"
            icon={<FileText className="h-4 w-4" />}
            isActive={isActive('/faq')}
          />
        </nav>
      </div>
    </div>
  );
};

export default Navigation;
