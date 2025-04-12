
import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';

import Index from './pages/Index';
import Login from './pages/Login';
import Admin from './pages/Admin';
import AssetTracker from './pages/AssetTracker';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import Backtesting from './pages/Backtesting';
import RiskManagement from './pages/RiskManagement';
import MarketData from './pages/MarketData';
import ComprehensiveAnalysis from './pages/ComprehensiveAnalysis';
import Dashboard from './pages/Dashboard';
import SocialMonitoring from './pages/SocialMonitoring';
import InformationSources from './pages/InformationSources';
import TradingSignals from './pages/TradingSignals';
import TradingBots from './pages/TradingBots';
import MarketNews from './pages/MarketNews';
import FundamentalData from './pages/FundamentalData';
import NotFound from './pages/NotFound';
import MainNavigation from './components/MainNavigation';
import TradingViewIntegration from './pages/TradingViewIntegration';
import BinanceIntegration from './pages/BinanceIntegration';
import RequireAuth from './components/auth/RequireAuth';

// Imports for initialization
import { initializeUsers } from './services/auth/userService';
import { initializeTradingViewServices } from './services/tradingView/startup';
import initializeSocialMonitoring from './services/socialMonitoring/index';

const queryClient = new QueryClient();

export default function App() {
  // Initialize services when the app loads
  useEffect(() => {
    // Initialize user management
    initializeUsers();
    
    // Initialize TradingView services
    const tvInitialized = initializeTradingViewServices();
    console.log('TradingView services initialized:', tvInitialized);
    
    // Initialize social monitoring
    initializeSocialMonitoring();
    console.log('Social monitoring initialized');
    
    // Add additional initializations here as needed
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="app">
          <div className="h-full relative bg-background">
            <MainNavigation />
            <main className="h-full pt-16">
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                
                {/* Protected routes */}
                <Route path="/" element={
                  <RequireAuth>
                    <Index />
                  </RequireAuth>
                } />
                <Route path="/admin" element={
                  <RequireAuth resource="users" requiredPermission="view">
                    <Admin />
                  </RequireAuth>
                } />
                <Route path="/asset-tracker" element={
                  <RequireAuth resource="assetTracker" requiredPermission="view">
                    <AssetTracker />
                  </RequireAuth>
                } />
                <Route path="/technical-analysis/:assetId?" element={
                  <RequireAuth resource="technicalAnalysis" requiredPermission="view">
                    <TechnicalAnalysis />
                  </RequireAuth>
                } />
                <Route path="/backtesting" element={
                  <RequireAuth resource="backtesting" requiredPermission="view">
                    <Backtesting />
                  </RequireAuth>
                } />
                <Route path="/risk-management" element={
                  <RequireAuth resource="riskManagement" requiredPermission="view">
                    <RiskManagement />
                  </RequireAuth>
                } />
                <Route path="/market-data" element={
                  <RequireAuth resource="marketData" requiredPermission="view">
                    <MarketData />
                  </RequireAuth>
                } />
                <Route path="/comprehensive-analysis" element={
                  <RequireAuth resource="technicalAnalysis" requiredPermission="view">
                    <ComprehensiveAnalysis />
                  </RequireAuth>
                } />
                <Route path="/dashboard" element={
                  <RequireAuth resource="dashboard" requiredPermission="view">
                    <Dashboard />
                  </RequireAuth>
                } />
                <Route path="/social-monitoring" element={
                  <RequireAuth resource="socialMonitoring" requiredPermission="view">
                    <SocialMonitoring />
                  </RequireAuth>
                } />
                <Route path="/information-sources" element={
                  <RequireAuth>
                    <InformationSources />
                  </RequireAuth>
                } />
                <Route path="/trading-signals" element={
                  <RequireAuth resource="tradingSignals" requiredPermission="view">
                    <TradingSignals />
                  </RequireAuth>
                } />
                <Route path="/trading-bots" element={
                  <RequireAuth>
                    <TradingBots />
                  </RequireAuth>
                } />
                <Route path="/market-news" element={
                  <RequireAuth>
                    <MarketNews />
                  </RequireAuth>
                } />
                <Route path="/fundamental-data" element={
                  <RequireAuth>
                    <FundamentalData />
                  </RequireAuth>
                } />
                <Route path="/tradingview-integration" element={
                  <RequireAuth resource="tradingView" requiredPermission="view">
                    <TradingViewIntegration />
                  </RequireAuth>
                } />
                <Route path="/binance-integration" element={
                  <RequireAuth>
                    <BinanceIntegration />
                  </RequireAuth>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}
