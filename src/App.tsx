
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

import Index from './pages/Index';
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

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="app">
        <div className="h-full relative bg-background">
          <MainNavigation />
          <main className="h-full pt-16">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/asset-tracker" element={<AssetTracker />} />
              <Route path="/technical-analysis/:assetId?" element={<TechnicalAnalysis />} />
              <Route path="/backtesting" element={<Backtesting />} />
              <Route path="/risk-management" element={<RiskManagement />} />
              <Route path="/market-data" element={<MarketData />} />
              <Route path="/comprehensive-analysis" element={<ComprehensiveAnalysis />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/social-monitoring" element={<SocialMonitoring />} />
              <Route path="/information-sources" element={<InformationSources />} />
              <Route path="/trading-signals" element={<TradingSignals />} />
              <Route path="/trading-bots" element={<TradingBots />} />
              <Route path="/market-news" element={<MarketNews />} />
              <Route path="/fundamental-data" element={<FundamentalData />} />
              <Route path="/tradingview-integration" element={<TradingViewIntegration />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}
