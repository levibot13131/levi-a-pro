
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminMenu: React.FC = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  
  if (!isAdmin) {
    return null;
  }
  
  return (
    <div className="mb-4 border-b pb-2">
      <h3 className="text-sm font-medium mb-2 pr-2">ניהול מערכת</h3>
      <div className="flex flex-col gap-1">
        <Button
          variant={location.pathname === '/user-management' ? 'default' : 'ghost'}
          className={cn(
            'justify-start',
            location.pathname === '/user-management' && 'bg-primary text-primary-foreground'
          )}
          asChild
        >
          <Link to="/user-management">
            <Users className="ml-2 h-4 w-4" />
            ניהול משתמשים
          </Link>
        </Button>
        
        <Button
          variant={location.pathname === '/system-settings' ? 'default' : 'ghost'}
          className={cn(
            'justify-start',
            location.pathname === '/system-settings' && 'bg-primary text-primary-foreground'
          )}
          asChild
        >
          <Link to="/system-settings">
            <Settings className="ml-2 h-4 w-4" />
            הגדרות מערכת
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default AdminMenu;
