
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import MarketOverview from '@/pages/market/MarketOverview'; 
import TechnicalAnalysis from '@/pages/TechnicalAnalysis';
import ComprehensiveAnalysis from '@/pages/ComprehensiveAnalysis';
import Backtesting from '@/pages/Backtesting';
import TradingSignals from '@/pages/TradingSignals';
import WatchList from '@/pages/market/WatchList';
import ScreenerPage from '@/pages/market/ScreenerPage';
import Portfolio from '@/pages/Portfolio';
import Settings from '@/pages/Settings';
import ApiConnections from '@/pages/admin/ApiConnections';
import AdvancedSettings from '@/pages/admin/AdvancedSettings';
import BinanceIntegration from '@/pages/BinanceIntegration';
import NotFound from '@/pages/NotFound';
import MarketNews from '@/pages/MarketNews';
import { AuthProvider } from '@/contexts/AuthContext';

const RoutesComponent = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="market-overview" element={<MarketOverview />} />
            <Route path="technical-analysis" element={<TechnicalAnalysis />} />
            <Route path="comprehensive-analysis" element={<ComprehensiveAnalysis />} />
            <Route path="backtesting" element={<Backtesting />} />
            <Route path="trading-signals" element={<TradingSignals />} />
            <Route path="watchlist" element={<WatchList />} />
            <Route path="screener" element={<ScreenerPage />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="settings" element={<Settings />} />
            <Route path="api-connections" element={<ApiConnections />} />
            <Route path="advanced-settings" element={<AdvancedSettings />} />
            <Route path="binance-integration" element={<BinanceIntegration />} />
            <Route path="market-news" element={<MarketNews />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default RoutesComponent;
