
import React, { useState } from 'react';
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
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ShieldAlert, Users, Key, Activity, Settings, Shield } from 'lucide-react';

const AdminMenu = () => {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);

  // Only show the admin menu for admins
  if (!isAdmin) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="mr-2 flex items-center gap-1"
        >
          <ShieldAlert className="h-4 w-4" />
          <span className="hidden md:inline">ניהול</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="text-right">פאנל ניהול</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="flex items-center justify-end" 
            onClick={() => setOpen(false)}
            asChild
          >
            <Link to="/admin">
              <Shield className="ml-2 h-4 w-4" />
              פאנל ניהול מלא
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center justify-end" 
            onClick={() => setOpen(false)}
            asChild
          >
            <Link to="/admin?tab=users">
              <Users className="ml-2 h-4 w-4" />
              ניהול משתמשים
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="flex items-center justify-end" 
            onClick={() => setOpen(false)}
            asChild
          >
            <Link to="/admin?tab=permissions">
              <Key className="ml-2 h-4 w-4" />
              ניהול הרשאות
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center justify-end" asChild>
          <Link to="/settings">
            <Settings className="ml-2 h-4 w-4" />
            הגדרות מערכת
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default AdminMenu;
