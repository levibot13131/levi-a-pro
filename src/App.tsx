
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';
import { ThemeProvider } from "@/components/ui/theme-provider";
import MainLayout from '@/components/layouts/main-layout';
import { EnvironmentBanner } from '@/components/ui/environment-banner';
import './App.css';
import AssetTracker from './pages/AssetTracker';
import Backtesting from './pages/Backtesting';
import TradingSignals from './pages/TradingSignals';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import TradingViewIntegration from './pages/TradingViewIntegration';
import BinanceIntegration from './pages/BinanceIntegration';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import InformationSources from './pages/InformationSources';
import Journal from './pages/Journal';
import AdminPanel from './pages/AdminPanel';
import RequireAuth from './components/auth/RequireAuth';
import Unauthorized from './pages/Unauthorized';
import Missing from './pages/Missing';
import LinkPage from './pages/LinkPage';
import Index from './pages/Index';
import MarketData from './pages/MarketData';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="ui-theme">
      <EnvironmentBanner />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Index />} />
          <Route path="/linkpage" element={<LinkPage />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<RequireAuth />}>
            <Route path="/asset-tracker" element={<AssetTracker />} />
            <Route path="/backtesting" element={<Backtesting />} />
            <Route path="/trading-signals" element={<TradingSignals />} />
            <Route path="/technical-analysis" element={<TechnicalAnalysis />} />
            <Route path="/tradingview-integration" element={<TradingViewIntegration />} />
            <Route path="/binance-integration" element={<BinanceIntegration />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/information-sources" element={<InformationSources />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/market-data" element={<MarketData />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <Toaster />
      <SonnerToaster position="top-right" richColors />
    </ThemeProvider>
  );
}

export default App;
