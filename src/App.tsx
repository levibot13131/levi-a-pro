
import { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import MainLayout from '@/components/layouts/main-layout';
import Dashboard from '@/pages/Dashboard';
import Assets from '@/pages/Assets';
import AssetDetails from '@/pages/AssetDetails';
import MarketNews from '@/pages/MarketNews';
import TechnicalAnalysis from '@/pages/TechnicalAnalysis';
import Portfolio from '@/pages/Portfolio';
import Backtesting from '@/pages/Backtesting';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/contexts/AuthContext';
import Login from '@/pages/Login';
import TradingViewIntegration from '@/pages/TradingViewIntegration';
import BinanceIntegration from '@/pages/BinanceIntegration';
import { initializeAllServices } from '@/services/initializationService';
import RequireAuth from '@/components/auth/RequireAuth';
import UserManagement from '@/pages/UserManagement';

function App() {
  // אתחול כל שירותי המערכת בטעינת האפליקציה
  useEffect(() => {
    // שינוי כותרת האפליקציה ל-Levi Bot
    document.title = 'Levi Bot - מערכת מסחר אוטומטית';
    
    // אתחול שירותים
    initializeAllServices();
    
    // הגדרות לוקאליות ספציפיות לפלטפורמה
    localStorage.setItem('LEVI_BOT_VERSION', '1.0.0');
    localStorage.setItem('LEVI_BOT_INITIALIZED', 'true');
    localStorage.setItem('LEVI_BOT_OWNER', 'levi');
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/:assetId" element={<AssetDetails />} />
            <Route path="/news" element={<MarketNews />} />
            <Route path="/technical-analysis" element={<TechnicalAnalysis />} />
            <Route path="/portfolio" element={
              <RequireAuth>
                <Portfolio />
              </RequireAuth>
            } />
            <Route path="/backtesting" element={<Backtesting />} />
            <Route path="/settings" element={
              <RequireAuth>
                <Settings />
              </RequireAuth>
            } />
            <Route path="/user-management" element={
              <RequireAuth requireAdmin={true}>
                <UserManagement />
              </RequireAuth>
            } />
            <Route path="/tradingview-integration" element={<TradingViewIntegration />} />
            <Route path="/binance-integration" element={<BinanceIntegration />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
