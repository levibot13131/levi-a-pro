
import { HomeIcon, BarChart3Icon, TrendingUpIcon, MessageSquareIcon, SettingsIcon, ActivityIcon } from "lucide-react";
import Index from "./pages/Index.tsx";
import Dashboard from "./pages/Dashboard.tsx";
import TradingDashboard from "./pages/TradingDashboard.tsx";
import TradingViewIntegration from "./pages/TradingViewIntegration.tsx";
import SystemHealth from "./pages/SystemHealth.tsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Dashboard",
    to: "/dashboard",
    icon: <BarChart3Icon className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Trading Signals",
    to: "/trading-signals",
    icon: <TrendingUpIcon className="h-4 w-4" />,
    page: <TradingDashboard />,
  },
  {
    title: "TradingView",
    to: "/tradingview",
    icon: <MessageSquareIcon className="h-4 w-4" />,
    page: <TradingViewIntegration />,
  },
  {
    title: "System Health",
    to: "/system-health",
    icon: <ActivityIcon className="h-4 w-4" />,
    page: <SystemHealth />,
  },
];
