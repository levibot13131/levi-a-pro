
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Bell, Settings, User, ToggleLeft, ToggleRight } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { toast } from 'sonner';
import { useAppSettings } from '@/hooks/use-app-settings';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { demoMode, toggleDemoMode } = useAppSettings();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('יצאת מהמערכת בהצלחה');
  };

  const closeSheet = () => {
    setIsSheetOpen(false);
  };

  return (
    <header className="border-b bg-card">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center lg:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">פתח תפריט</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-0">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="icon" onClick={closeSheet}>
                    <X className="h-5 w-5" />
                  </Button>
                  <h2 className="text-xl font-bold">Levi-A-Pro</h2>
                </div>
              </div>
              <Navigation />
            </SheetContent>
          </Sheet>
        </div>
        
        <div className="flex flex-1 justify-end items-center gap-4">
          <div className="flex items-center">
            <Button 
              variant="outline" 
              onClick={toggleDemoMode}
              className="flex items-center gap-1.5 text-xs"
              size="sm"
            >
              {demoMode ? (
                <>
                  <ToggleLeft className="h-4 w-4 text-amber-500" />
                  <span>מצב דמו</span>
                </>
              ) : (
                <>
                  <ToggleRight className="h-4 w-4 text-green-500" />
                  <span>מצב אמיתי</span>
                </>
              )}
            </Button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5" />
                <span className="sr-only">התראות</span>
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-primary"></span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="text-right py-2 px-4">
                <div className="text-sm font-medium">התראות</div>
                <div className="text-xs text-muted-foreground">יש לך 3 התראות חדשות</div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm font-medium">איתות מסחר חדש: BTC</div>
                  <div className="text-xs text-muted-foreground">לפני 5 דקות</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-end">
                <div className="text-right">
                  <div className="text-sm font-medium">עדכון מחיר ETH</div>
                  <div className="text-xs text-muted-foreground">לפני 10 דקות</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center" asChild>
                <Link to="/notifications">כל ההתראות</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">הגדרות</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="flex justify-end" asChild>
                <Link to="/settings">
                  <div>הגדרות כלליות</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-end" asChild>
                <Link to="/proxy-settings">
                  <div>הגדרות פרוקסי</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-end" asChild>
                <Link to="/data-connections">
                  <div>חיבורי API</div>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-end" asChild>
                <Link to="/faq">
                  <div>עזרה ותמיכה</div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{user?.name?.charAt(0) || 'A'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <div className="flex items-center justify-end space-x-2 p-2">
                <div className="text-right">
                  <p className="text-sm font-medium leading-none">{user?.name || 'אורח'}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || ''}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex justify-end" asChild>
                <Link to="/profile">
                  <User className="ml-2 h-4 w-4" />
                  <span>פרופיל</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex justify-end" asChild>
                <Link to="/api-connections">
                  <Settings className="ml-2 h-4 w-4" />
                  <span>הגדרות API</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {user ? (
                <DropdownMenuItem className="flex justify-end" onClick={handleLogout}>
                  <span>התנתק</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem className="flex justify-end" asChild>
                  <Link to="/login">
                    <span>התחבר</span>
                  </Link>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
