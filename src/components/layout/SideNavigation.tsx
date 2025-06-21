import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Home,
  LayoutDashboard,
  Settings,
  User,
  Bell,
  Plus,
  BarChart3,
  Activity,
  TrendingUp,
  AlertTriangle,
  MessageSquare,
  HelpCircle,
  LogOut
} from "lucide-react"
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface SideNavigationProps {
  isCollapsed: boolean;
}

const SideNavigation: React.FC<SideNavigationProps> = ({ isCollapsed }) => {
  const { user, logout } = useAuth();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      description: 'Real-time system overview'
    },
    {
      name: 'Trading Engine',
      href: '/trading-engine',
      icon: Activity,
      description: 'Automated trading system'
    },
    {
      name: 'Risk Monitor',
      href: '/risk-monitor',
      icon: AlertTriangle,
      description: 'Real-time risk analysis'
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      description: 'Performance tracking and reports'
    },
    {
      name: 'Telegram Bot',
      href: '/telegram-bot',
      icon: MessageSquare,
      description: 'Telegram bot configuration'
    },
    {
      name: 'Fundamental Data',
      href: '/fundamental-data',
      icon: TrendingUp,
      description: 'Market data and insights'
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      description: 'System configuration'
    },
    {
      name: 'Help & Support',
      href: '/help',
      icon: HelpCircle,
      description: 'Documentation and support'
    }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <LayoutDashboard className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:w-64">
        <SheetHeader className="text-left">
          <SheetTitle>LeviPro System</SheetTitle>
          <SheetDescription>
            Manage your trading system from here.
          </SheetDescription>
        </SheetHeader>
        <Separator className="my-4" />

        <div className="flex flex-col space-y-2">
          {navigationItems.map((item) => (
            <Link to={item.href} key={item.name} className="flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-secondary">
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="flex flex-col space-y-2">
          <Button variant="ghost" className="justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
          <Button variant="ghost" className="justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SideNavigation;
