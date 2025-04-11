import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/use-mobile';
import {
  Home,
  Layout,
  Eye,
  LineChart,
  Database,
  History,
  ShieldAlert,
  BarChart3,
  PieChart,
  Users,
  FileText,
  BellRing,
  Bot,
  Newspaper,
  Link2,
  Menu
} from 'lucide-react';

const sidebarStyles = `
  fixed top-0 left-0 h-full w-72 bg-secondary border-r z-50
  transform transition-transform duration-300 ease-in-out
  md:translate-x-0
`;

const backdropStyles = `
  fixed top-0 left-0 w-full h-full bg-gray-900 opacity-50 z-40
  md:hidden
`;

const navLinkClass = (isActive: boolean) =>
  `flex items-center px-6 py-2 text-sm font-medium rounded-md
  transition-colors hover:bg-accent hover:text-accent-foreground
  ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'}`;

const MainNavigation: React.FC = () => {
  const isMobile = useMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const handleNavLinkClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <>
      <header className="fixed top-0 left-0 w-full h-16 bg-background border-b z-50 flex items-center justify-between px-6">
        <button onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-semibold">KSem AI Assistant</h1>
        <div>
          {/* Add any additional header content here */}
        </div>
      </header>
      
      <aside className={`${sidebarStyles} ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b">
          <h2 className="text-lg font-semibold">KSem AI Assistant</h2>
        </div>
        <div className="py-4 space-y-1 pl-6 pr-2">
          <NavLink to="/" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <Home className="h-5 w-5 mr-3" />
            <span>בית</span>
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <Layout className="h-5 w-5 mr-3" />
            <span>דשבורד</span>
          </NavLink>
          <NavLink to="/asset-tracker" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <Eye className="h-5 w-5 mr-3" />
            <span>מעקב נכסים</span>
          </NavLink>
          <NavLink to="/technical-analysis" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <LineChart className="h-5 w-5 mr-3" />
            <span>ניתוח טכני</span>
          </NavLink>
          <NavLink to="/tradingview-integration" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <Link2 className="h-5 w-5 mr-3" />
            <span>TradingView</span>
          </NavLink>
          <NavLink to="/fundamental-data" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <Database className="h-5 w-5 mr-3" />
            <span>מידע פונדמנטלי</span>
          </NavLink>
          <NavLink to="/backtesting" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <History className="h-5 w-5 mr-3" />
            <span>בקטסטינג</span>
          </NavLink>
          <NavLink to="/risk-management" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <ShieldAlert className="h-5 w-5 mr-3" />
            <span>ניהול סיכונים</span>
          </NavLink>
          <NavLink to="/market-data" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <BarChart3 className="h-5 w-5 mr-3" />
            <span>נתוני שוק</span>
          </NavLink>
          <NavLink to="/comprehensive-analysis" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <PieChart className="h-5 w-5 mr-3" />
            <span>ניתוח מקיף</span>
          </NavLink>
          <NavLink to="/social-monitoring" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <Users className="h-5 w-5 mr-3" />
            <span>ניטור חברתי</span>
          </NavLink>
          <NavLink to="/information-sources" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <FileText className="h-5 w-5 mr-3" />
            <span>מקורות מידע</span>
          </NavLink>
          <NavLink to="/trading-signals" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <BellRing className="h-5 w-5 mr-3" />
            <span>איתותי מסחר</span>
          </NavLink>
          <NavLink to="/trading-bots" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <Bot className="h-5 w-5 mr-3" />
            <span>בוטים למסחר</span>
          </NavLink>
          <NavLink to="/market-news" className={({ isActive }) => navLinkClass(isActive)} onClick={handleNavLinkClick}>
            <Newspaper className="h-5 w-5 mr-3" />
            <span>חדשות שוק</span>
          </NavLink>
        </div>
      </aside>
      
      {showSidebar && isMobile && (
        <div className={backdropStyles} onClick={closeSidebar}></div>
      )}
    </>
  );
};

export default MainNavigation;
