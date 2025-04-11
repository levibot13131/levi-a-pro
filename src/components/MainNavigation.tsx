
import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useIsMobile } from '../hooks/use-mobile';
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
  Menu,
  X, // Added X icon for closing sidebar
  ArrowLeftToLine, // Added for collapsing sidebar
  ArrowRightToLine // Added for expanding sidebar
} from 'lucide-react';

const sidebarExpandedStyles = `
  fixed top-0 left-0 h-full w-72 bg-secondary border-r z-50
  transform transition-transform duration-300 ease-in-out
  md:translate-x-0
`;

const sidebarCollapsedStyles = `
  fixed top-0 left-0 h-full w-16 bg-secondary border-r z-50
  transform transition-all duration-300 ease-in-out
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
  const { isMobile, isMenuOpen, setIsMenuOpen } = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const closeSidebar = () => {
    setShowSidebar(false);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
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
        {!isMobile && (
          <button 
            onClick={toggleCollapse} 
            className="hidden md:flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
            title={isCollapsed ? "הרחב תפריט" : "כווץ תפריט"}
          >
            {isCollapsed ? <ArrowRightToLine className="h-5 w-5" /> : <ArrowLeftToLine className="h-5 w-5" />}
          </button>
        )}
      </header>
      
      <aside className={`${isCollapsed ? sidebarCollapsedStyles : sidebarExpandedStyles} ${showSidebar ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}>
        <div className="h-16 flex items-center px-6 border-b justify-between">
          {!isCollapsed && <h2 className="text-lg font-semibold">KSem AI Assistant</h2>}
          <div className="flex items-center gap-2">
            {!isCollapsed && !isMobile && (
              <button 
                onClick={toggleCollapse} 
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                title="כווץ תפריט"
              >
                <ArrowLeftToLine className="h-5 w-5" />
              </button>
            )}
            {isMobile && (
              <button 
                onClick={closeSidebar} 
                className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
                title="סגור תפריט"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <div className={`py-4 space-y-1 ${isCollapsed ? 'px-2' : 'pl-6 pr-2'}`}>
          <NavLink to="/" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "בית" : undefined}>
            <Home className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>בית</span>}
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "דשבורד" : undefined}>
            <Layout className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>דשבורד</span>}
          </NavLink>
          <NavLink to="/asset-tracker" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "מעקב נכסים" : undefined}>
            <Eye className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>מעקב נכסים</span>}
          </NavLink>
          <NavLink to="/technical-analysis" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "ניתוח טכני" : undefined}>
            <LineChart className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>ניתוח טכני</span>}
          </NavLink>
          <NavLink to="/tradingview-integration" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "TradingView" : undefined}>
            <Link2 className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>TradingView</span>}
          </NavLink>
          <NavLink to="/fundamental-data" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "מידע פונדמנטלי" : undefined}>
            <Database className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>מידע פונדמנטלי</span>}
          </NavLink>
          <NavLink to="/backtesting" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "בקטסטינג" : undefined}>
            <History className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>בקטסטינג</span>}
          </NavLink>
          <NavLink to="/risk-management" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "ניהול סיכונים" : undefined}>
            <ShieldAlert className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>ניהול סיכונים</span>}
          </NavLink>
          <NavLink to="/market-data" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "נתוני שוק" : undefined}>
            <BarChart3 className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>נתוני שוק</span>}
          </NavLink>
          <NavLink to="/comprehensive-analysis" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "ניתוח מקיף" : undefined}>
            <PieChart className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>ניתוח מקיף</span>}
          </NavLink>
          <NavLink to="/social-monitoring" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "ניטור חברתי" : undefined}>
            <Users className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>ניטור חברתי</span>}
          </NavLink>
          <NavLink to="/information-sources" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "מקורות מידע" : undefined}>
            <FileText className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>מקורות מידע</span>}
          </NavLink>
          <NavLink to="/trading-signals" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "איתותי מסחר" : undefined}>
            <BellRing className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>איתותי מסחר</span>}
          </NavLink>
          <NavLink to="/trading-bots" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "בוטים למסחר" : undefined}>
            <Bot className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>בוטים למסחר</span>}
          </NavLink>
          <NavLink to="/market-news" className={({ isActive }) => `${navLinkClass(isActive)} ${isCollapsed ? 'px-2 justify-center' : ''}`} onClick={handleNavLinkClick} title={isCollapsed ? "חדשות שוק" : undefined}>
            <Newspaper className="h-5 w-5 mr-3" />
            {!isCollapsed && <span>חדשות שוק</span>}
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
