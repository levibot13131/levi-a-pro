
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/theme-provider';
import MainLayout from '@/components/layouts/main-layout';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import Assets from '@/pages/Assets';
import AssetDetails from '@/pages/AssetDetails';
import MarketNews from '@/pages/MarketNews';
import TradingSignals from '@/pages/TradingSignals';
import Backtesting from '@/pages/Backtesting';
import TradingViewIntegration from '@/pages/TradingViewIntegration';
import BinanceIntegration from '@/pages/BinanceIntegration';
import { AuthProvider } from '@/contexts/AuthContext';
import RequireAuth from '@/components/auth/RequireAuth';
import Settings from '@/pages/Settings';
import { initializeTradingViewServices } from '@/services/tradingView/startup';
import GuideModal from '@/components/GuideModal';

// קבוע לבדיקה אם זו הטעינה הראשונה של האפליקציה
const FIRST_VISIT_KEY = 'app-first-visit';

function App() {
  const [showGuide, setShowGuide] = useState(false);
  
  useEffect(() => {
    // Initialize TradingView services
    initializeTradingViewServices();
    
    // בדיקה אם זו הטעינה הראשונה של האפליקציה
    const isFirstVisit = !localStorage.getItem(FIRST_VISIT_KEY);
    if (isFirstVisit) {
      // הצגת המדריך בטעינה הראשונה
      setShowGuide(true);
      // שמירת סימון לביקור ראשון
      localStorage.setItem(FIRST_VISIT_KEY, 'visited');
    }
  }, []);

  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <Router>
          <Toaster 
            position="top-left"
            toastOptions={{
              style: { direction: 'rtl' }
            }}  
          />
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/login" element={<Login />} />
            <Route element={<MainLayout />}>
              <Route 
                path="/dashboard" 
                element={
                  <RequireAuth>
                    <Dashboard />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/assets" 
                element={
                  <RequireAuth>
                    <Assets />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/assets/:id" 
                element={
                  <RequireAuth>
                    <AssetDetails />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/market-news" 
                element={
                  <RequireAuth>
                    <MarketNews />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/trading-signals" 
                element={
                  <RequireAuth>
                    <TradingSignals />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/backtesting" 
                element={
                  <RequireAuth>
                    <Backtesting />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/trading-view" 
                element={
                  <RequireAuth>
                    <TradingViewIntegration />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/binance-integration" 
                element={
                  <RequireAuth>
                    <BinanceIntegration />
                  </RequireAuth>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <RequireAuth>
                    <Settings />
                  </RequireAuth>
                } 
              />
            </Route>
          </Routes>
          
          <GuideModal open={showGuide} onOpenChange={setShowGuide} />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
