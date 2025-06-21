
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useHebrew } from '@/hooks/use-hebrew';
import { ModeToggle } from './ModeToggle';
import { MainNav } from './MainNav';
import { Button } from './ui/button';
import { Activity } from 'lucide-react';
import TelegramStatusIndicator from './telegram/TelegramStatusIndicator';

interface HeaderProps {
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  const { isHebrew } = useHebrew();

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link to="/" className="flex items-center gap-2 mr-6">
          <Activity className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">LeviPro Elite</span>
        </Link>
        
        <MainNav className="mx-6" />
        
        <div className="ml-auto flex items-center space-x-4">
          <Link 
            to="/unified-dashboard" 
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              location.pathname === '/unified-dashboard' 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
            }`}
          >
            {isHebrew ? 'דשבורד מאוחד' : 'Unified Dashboard'}
          </Link>
          
          <TelegramStatusIndicator />
          <ModeToggle />
          
          {isLoggedIn ? (
            <Button variant="outline" size="sm" onClick={onLogout}>
              {isHebrew ? 'התנתק' : 'Logout'}
            </Button>
          ) : (
            <>
              <Link to="/auth" className="underline">
                {isHebrew ? 'התחבר' : 'Login'}
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
