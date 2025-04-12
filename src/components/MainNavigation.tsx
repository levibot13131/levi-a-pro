
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import {
  Menu,
  LogOut,
  User,
  Settings,
  BarChart4,
  TrendingUp,
  BookOpen,
  DollarSign,
  LineChart,
  Bell,
  Activity,
  CircleUser,
  Home,
  PieChart,
  Gauge,
  Newspaper,
  MessageSquare,
  ChevronRight,
  CreditCard
} from 'lucide-react';
import AdminMenu from './AdminMenu';

const MainNavigation = () => {
  const { isAuthenticated, user, logout, hasPermission } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Close menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // If not authenticated, don't show the navigation
  if (!isAuthenticated) {
    return null;
  }

  const navLinks = [
    {
      name: 'דשבורד',
      href: '/dashboard',
      icon: <Home className="h-5 w-5 mr-2" />,
      resource: 'dashboard'
    },
    {
      name: 'בדיקות היסטוריות',
      href: '/backtesting',
      icon: <Activity className="h-5 w-5 mr-2" />,
      resource: 'backtesting'
    },
    {
      name: 'ניתוח טכני',
      href: '/technical-analysis',
      icon: <BarChart4 className="h-5 w-5 mr-2" />,
      resource: 'technicalAnalysis'
    },
    {
      name: 'ניהול סיכונים',
      href: '/risk-management',
      icon: <Gauge className="h-5 w-5 mr-2" />,
      resource: 'riskManagement'
    },
    {
      name: 'נתוני שוק',
      href: '/market-data',
      icon: <PieChart className="h-5 w-5 mr-2" />,
      resource: 'marketData'
    },
    {
      name: 'איתותי מסחר',
      href: '/trading-signals',
      icon: <TrendingUp className="h-5 w-5 mr-2" />,
      resource: 'tradingSignals'
    },
    {
      name: 'Binance',
      href: '/binance-integration',
      icon: <CreditCard className="h-5 w-5 mr-2" />
    },
    {
      name: 'TradingView',
      href: '/tradingview-integration',
      icon: <LineChart className="h-5 w-5 mr-2" />,
      resource: 'tradingView'
    },
    {
      name: 'מעקב נכסים',
      href: '/asset-tracker',
      icon: <DollarSign className="h-5 w-5 mr-2" />,
      resource: 'assetTracker'
    },
    {
      name: 'ניטור רשתות חברתיות',
      href: '/social-monitoring',
      icon: <MessageSquare className="h-5 w-5 mr-2" />,
      resource: 'socialMonitoring'
    },
    {
      name: 'חדשות שוק',
      href: '/market-news',
      icon: <Newspaper className="h-5 w-5 mr-2" />
    },
    {
      name: 'מקורות מידע',
      href: '/information-sources',
      icon: <BookOpen className="h-5 w-5 mr-2" />
    }
  ];

  // Filter links based on user permissions
  const filteredLinks = navLinks.filter(link => 
    !link.resource || hasPermission(link.resource, 'view')
  );

  return (
    <header className="fixed top-0 right-0 left-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container flex items-center h-16 px-4">
        {/* Mobile menu */}
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">פתח תפריט</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] sm:w-[350px]">
            <SheetHeader>
              <SheetTitle className="text-right">תפריט</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col mt-4 space-y-1">
              {filteredLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`
                    flex items-center px-4 py-2 text-sm font-medium rounded-md
                    ${location.pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  `}
                >
                  <div className="flex items-center justify-end w-full">
                    <span>{link.name}</span>
                    {link.icon}
                  </div>
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Logo & title */}
        <div className="flex items-center ml-auto">
          <h1 className="text-xl font-bold">
            מערכת ניתוח מסחר
          </h1>
        </div>

        {/* Desktop menu */}
        <nav className="mx-6 hidden md:flex items-center space-x-4 ml-auto">
          {filteredLinks.slice(0, 7).map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`
                text-sm font-medium transition-colors hover:text-primary
                ${location.pathname === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
                }
              `}
            >
              {link.name}
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                עוד <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {filteredLinks.slice(7).map((link) => (
                <DropdownMenuItem key={link.href} asChild>
                  <Link 
                    to={link.href}
                    className="flex items-center justify-end w-full"
                  >
                    <span>{link.name}</span>
                    {link.icon}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Admin & User menu */}
        <div className="flex items-center space-x-2">
          {/* Admin Menu */}
          <AdminMenu />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1"
              >
                <CircleUser className="h-4 w-4" />
                <span className="hidden md:inline">{user?.username || 'משתמש'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="text-right">החשבון שלי</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="flex items-center justify-end">
                  <User className="ml-2 h-4 w-4" />
                  הפרופיל שלי
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-end">
                  <Bell className="ml-2 h-4 w-4" />
                  התראות
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center justify-end">
                  <Settings className="ml-2 h-4 w-4" />
                  הגדרות
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="flex items-center justify-end text-red-600"
                onClick={logout}
              >
                <LogOut className="ml-2 h-4 w-4" />
                התנתקות
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default MainNavigation;
