
import { HomeIcon, BarChart3, TrendingUp, Settings, Zap, Search } from "lucide-react";
import Index from "./pages/Index";
import TradingDashboard from "./pages/TradingDashboard";
import Dashboard from "./pages/Dashboard";
import Signals from "./pages/Signals";
import SystemAuditDashboard from "./components/trading/SystemAuditDashboard";

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
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Dashboard />,
  },
  {
    title: "Trading Dashboard",
    to: "/trading",
    icon: <TrendingUp className="h-4 w-4" />,
    page: <TradingDashboard />,
  },
  {
    title: "Signals",
    to: "/signals", 
    icon: <Zap className="h-4 w-4" />,
    page: <Signals />,
  },
  {
    title: "System Audit",
    to: "/audit",
    icon: <Search className="h-4 w-4" />,
    page: <SystemAuditDashboard />,
  },
];
