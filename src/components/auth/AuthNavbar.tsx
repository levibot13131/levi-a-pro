
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const AuthNavbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-background border-b py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Link to="/" className="text-xl font-bold">Levi Bot</Link>
      </div>

      {/* Mobile Menu Button */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[250px] sm:w-[300px]">
          <div className="flex flex-col gap-4 mt-8">
            <Link to="/" className="text-lg font-medium hover:text-primary">ראשי</Link>
            <Link to="/assets" className="text-lg font-medium hover:text-primary">נכסים</Link>
            <Link to="/market-news" className="text-lg font-medium hover:text-primary">חדשות</Link>
            <Link to="/trading-signals" className="text-lg font-medium hover:text-primary">איתותי מסחר</Link>
            <Link to="/backtesting" className="text-lg font-medium hover:text-primary">בדיקה היסטורית</Link>
            <Link to="/tradingview-integration" className="text-lg font-medium hover:text-primary">TradingView</Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/settings" className="text-lg font-medium hover:text-primary">הגדרות</Link>
                <Button 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => logout()}
                >
                  <LogOut className="ml-2 h-4 w-4" />
                  התנתק
                </Button>
              </>
            ) : (
              <Link to="/login">
                <Button className="w-full">
                  <LogIn className="ml-2 h-4 w-4" />
                  התחבר
                </Button>
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-6">
        <Link to="/" className="text-sm font-medium hover:text-primary">ראשי</Link>
        <Link to="/assets" className="text-sm font-medium hover:text-primary">נכסים</Link>
        <Link to="/market-news" className="text-sm font-medium hover:text-primary">חדשות</Link>
        <Link to="/trading-signals" className="text-sm font-medium hover:text-primary">איתותי מסחר</Link>
        <Link to="/backtesting" className="text-sm font-medium hover:text-primary">בדיקה היסטורית</Link>
      </div>

      {/* Authentication Buttons */}
      <div className="hidden md:flex items-center gap-2">
        {isAuthenticated ? (
          <>
            <Link to="/settings">
              <Button variant="ghost" size="sm">
                <User className="ml-2 h-4 w-4" />
                הגדרות
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => logout()}
            >
              <LogOut className="ml-2 h-4 w-4" />
              התנתק
            </Button>
          </>
        ) : (
          <Link to="/login">
            <Button size="sm">
              <LogIn className="ml-2 h-4 w-4" />
              התחבר
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default AuthNavbar;
