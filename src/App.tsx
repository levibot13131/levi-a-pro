
import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainNavigation from './components/MainNavigation';
import Dashboard from './pages/Dashboard';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import ComprehensiveAnalysis from './pages/ComprehensiveAnalysis';
import Backtesting from './pages/Backtesting';
import TradingBots from './pages/TradingBots';
import RiskManagement from './pages/RiskManagement';
import TradingSignals from './pages/TradingSignals';
import MarketNews from './pages/MarketNews';
import InformationSources from './pages/InformationSources';
import MarketData from './pages/MarketData';
import NotFound from './pages/NotFound';
import { ThemeProvider } from './components/ui/theme-provider';
import { Toaster } from '@/components/ui/sonner';

import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <MainNavigation />
      <main className="mdm-main">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/technical-analysis" element={<TechnicalAnalysis />} />
            <Route path="/comprehensive-analysis" element={<ComprehensiveAnalysis />} />
            <Route path="/backtesting" element={<Backtesting />} />
            <Route path="/trading-bots" element={<TradingBots />} />
            <Route path="/risk-management" element={<RiskManagement />} />
            <Route path="/trading-signals" element={<TradingSignals />} />
            <Route path="/market-news" element={<MarketNews />} />
            <Route path="/information-sources" element={<InformationSources />} />
            <Route path="/market-data" element={<MarketData />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Toaster position="top-right" />
      </main>
    </ThemeProvider>
  );
}

export default App;
