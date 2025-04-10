
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/ui/theme-provider';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import TechnicalAnalysis from '@/pages/TechnicalAnalysis';
import RiskManagement from '@/pages/RiskManagement';
import NotFound from '@/pages/NotFound';
import TradingSignals from '@/pages/TradingSignals';
import TradingBots from '@/pages/TradingBots';
import ComprehensiveAnalysis from '@/pages/ComprehensiveAnalysis';
import MarketNews from '@/pages/MarketNews';
import Backtesting from '@/pages/Backtesting';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/technical-analysis" element={<TechnicalAnalysis />} />
            <Route path="/risk-management" element={<RiskManagement />} />
            <Route path="/trading-signals" element={<TradingSignals />} />
            <Route path="/trading-bots" element={<TradingBots />} />
            <Route path="/comprehensive-analysis" element={<ComprehensiveAnalysis />} />
            <Route path="/market-news" element={<MarketNews />} />
            <Route path="/backtesting" element={<Backtesting />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster richColors position="top-center" closeButton />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
