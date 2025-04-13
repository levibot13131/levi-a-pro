
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  Settings, 
  Database, 
  CreditCard, 
  Lock, 
  Activity, 
  Link, 
  BarChart2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const menuItems = [
    { name: 'ניהול משתמשים', icon: Users, path: '/admin/users' },
    { name: 'הגדרות מערכת', icon: Settings, path: '/admin/settings' },
    { name: 'ניהול נתונים', icon: Database, path: '/admin/data-management' },
    { name: 'חיוב ותשלומים', icon: CreditCard, path: '/admin/billing' },
    { name: 'אבטחה והרשאות', icon: Lock, path: '/admin/security' },
    { name: 'לוגים וניטור', icon: Activity, path: '/admin/logs' },
    { name: 'חיבורי API', icon: Link, path: '/admin/api-connections' },
    { name: 'אנליטיקות', icon: BarChart2, path: '/admin/analytics' },
    { name: 'התראות', icon: AlertTriangle, path: '/admin/alerts' },
  ];

  return (
    <div className="h-screen w-64 bg-card border-l p-4">
      <div className="text-xl font-bold mb-6 text-right">לוח ניהול</div>
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center justify-end px-3 py-2 rounded-md text-sm",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-primary hover:bg-primary/5"
              )
            }
          >
            <span className="ml-2">{item.name}</span>
            <item.icon className="h-4 w-4" />
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
