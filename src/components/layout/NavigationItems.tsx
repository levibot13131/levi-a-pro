
import {
  BarChart3,
  LineChart,
  Briefcase,
  Cog,
  LayoutDashboard,
  Target,
  CandlestickChart,
  Compass,
  Database,
  BarChart4,
  Bitcoin,
  Twitter
} from "lucide-react";
import { NavItem } from "../ui/navbar";

export const navigationItems: NavItem[] = [
  {
    title: "לוח בקרה",
    icon: LayoutDashboard,
    href: "/",
    color: "text-sky-500",
  },
  {
    title: "בדיקת אסטרטגיות",
    icon: BarChart3,
    href: "/backtesting",
    color: "text-violet-500",
  },
  {
    title: "ניתוח טכני",
    icon: LineChart,
    color: "text-pink-700",
    href: "/technical-analysis",
  },
  {
    title: "תיק השקעות",
    icon: Briefcase,
    href: "/portfolio",
    color: "text-orange-500",
  },
  {
    title: "מעקב נכסים",
    icon: Target,
    color: "text-emerald-500",
    href: "/asset-tracker",
  },
  {
    title: "איתותי מסחר",
    icon: CandlestickChart,
    color: "text-green-700",
    href: "/trading-signals",
  },
  {
    title: "ביינאנס",
    icon: Bitcoin,
    color: "text-yellow-500",
    href: "/binance",
  },
  {
    title: "טוויטר",
    icon: Twitter,
    color: "text-blue-400",
    href: "/twitter",
  },
  {
    title: "חיבורי מידע",
    icon: Database,
    color: "text-blue-500",
    href: "/data-connections",
  },
  {
    title: "הגדרות",
    icon: Cog,
    href: "/settings",
  },
];
