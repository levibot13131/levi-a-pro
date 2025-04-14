
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  BarChart3,
  LineChart,
  PieChart,
  History,
  Target,
  Star,
  Search,
  Wallet,
  Settings,
  Link2,
  Database,
  Wrench
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const { isAdmin } = useAuth();
  
  return (
    <nav className="py-3">
      <ul className="space-y-2">
        <li>
          <NavLink to="/" className={({ isActive }) => `
            flex items-center p-3 rounded-md mb-2
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `} end>
            <Home className="h-5 w-5 ml-3" />
            <span>דף הבית</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/dashboard" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <BarChart3 className="h-5 w-5 ml-3" />
            <span>לוח מחוונים</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/market-overview" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <PieChart className="h-5 w-5 ml-3" />
            <span>סקירת שוק</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/technical-analysis" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <LineChart className="h-5 w-5 ml-3" />
            <span>ניתוח טכני</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/comprehensive-analysis" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <Database className="h-5 w-5 ml-3" />
            <span>ניתוח מקיף</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/backtesting" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <History className="h-5 w-5 ml-3" />
            <span>בדיקה לאחור</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/trading-signals" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <Target className="h-5 w-5 ml-3" />
            <span>איתותי מסחר</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/watchlist" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <Star className="h-5 w-5 ml-3" />
            <span>רשימת מעקב</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/screener" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <Search className="h-5 w-5 ml-3" />
            <span>סורק מטבעות</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/portfolio" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <Wallet className="h-5 w-5 ml-3" />
            <span>תיק השקעות</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/binance-integration" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <Link2 className="h-5 w-5 ml-3" />
            <span>Binance</span>
          </NavLink>
        </li>
        
        <li>
          <NavLink to="/api-connections" className={({ isActive }) => `
            flex items-center p-3 rounded-md
            ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
          `}>
            <Settings className="h-5 w-5 ml-3" />
            <span>חיבורי API</span>
          </NavLink>
        </li>
        
        {isAdmin && (
          <li>
            <NavLink to="/advanced-settings" className={({ isActive }) => `
              flex items-center p-3 rounded-md
              ${isActive ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-accent'}
            `}>
              <Wrench className="h-5 w-5 ml-3" />
              <span>הגדרות מתקדמות</span>
            </NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
