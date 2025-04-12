
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

// Extended User interface to include additional properties
interface ExtendedUser {
  email?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
}

const AuthNavbar = () => {
  const { user: authUser, isAdmin, logout } = useAuth();
  const user = authUser as ExtendedUser;
  
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <Link to="/" className="font-semibold text-lg">
            מערכת ניתוח מתקדמת
          </Link>
          
          {/* Always show basic navigation, even if not logged in */}
          <nav className="mr-2 flex items-center space-x-4 rtl:space-x-reverse text-sm font-medium">
            <Link to="/asset-tracker" className="text-foreground/60 hover:text-foreground transition-colors">
              רשימת מעקב
            </Link>
            <Link to="/trading-signals" className="text-foreground/60 hover:text-foreground transition-colors">
              איתותי מסחר
            </Link>
            <Link to="/technical-analysis" className="text-foreground/60 hover:text-foreground transition-colors">
              ניתוח טכני
            </Link>
          </nav>
        </div>
        
        <div className="ml-auto flex items-center space-x-4 rtl:space-x-reverse">
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL || ''} />
                    <AvatarFallback className="bg-primary/10">
                      {user.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>פרופיל</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>הגדרות</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>ניהול</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>התנתק</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Link to="/login">
                <Button variant="ghost" size="sm">כניסה</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">הרשמה</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthNavbar;
