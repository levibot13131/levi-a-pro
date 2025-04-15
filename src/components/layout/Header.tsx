
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Bell, User as UserIcon, Settings, LogOut, Moon, Sun, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useAppSettings } from '@/hooks/use-app-settings';

interface HeaderProps {
  toggleNavOpen?: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleNavOpen }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useAppSettings();
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-card border-b py-3 px-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {toggleNavOpen && (
            <Button variant="ghost" size="icon" onClick={toggleNavOpen} className="md:hidden">
              <Menu />
              <span className="sr-only">תפריט</span>
            </Button>
          )}
          
          <div className="flex items-center ml-4">
            <span className="text-xl font-bold">Levi-A-Pro</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => toggleDarkMode()}
            className="text-muted-foreground hover:text-foreground"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>

          <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
                <span className="sr-only">התראות</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4 text-right">
                <h3 className="font-medium mb-1">התראות</h3>
                <p className="text-sm text-muted-foreground">אין התראות חדשות</p>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <UserIcon size={20} className="opacity-70" />
                <div className="text-right">
                  <div className="text-sm font-medium">{user?.email || 'משתמש'}</div>
                  <div className="text-xs text-muted-foreground">{user?.role || 'לא מחובר'}</div>
                </div>
                <ChevronDown size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex justify-between items-center w-full">
                  פרופיל
                  <UserIcon size={16} />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex justify-between items-center w-full">
                  הגדרות
                  <Settings size={16} />
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex justify-between items-center">
                התנתק
                <LogOut size={16} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
