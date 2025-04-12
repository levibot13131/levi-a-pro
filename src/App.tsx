
import { useEffect } from 'react';
import { Toaster } from 'sonner';
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

function App() {
  // אתחול כל שירותי המערכת בטעינת האפליקציה
  useEffect(() => {
    initializeAllServices();
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <AuthProvider>
        <Toaster richColors position="top-center" dir="rtl" closeButton={true} />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/assets/:assetId" element={<AssetDetails />} />
            <Route path="/news" element={<MarketNews />} />
            <Route path="/technical-analysis" element={<TechnicalAnalysis />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/backtesting" element={<Backtesting />} />
            <Route path="/settings" element={<Settings />} />
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
