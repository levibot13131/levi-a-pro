
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Backtesting from './pages/Backtesting';
import TradingDashboard from './pages/TradingDashboard';
import BinanceIntegration from './pages/BinanceIntegration';
import ProxyGuide from './pages/ProxyGuide';
import TradingViewIntegration from './pages/TradingViewIntegration';
import DeploymentGuide from './pages/DeploymentGuide';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/proxy-guide" element={<ProxyGuide />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/backtesting" element={<Backtesting />} />
        <Route path="/trading" element={<TradingDashboard />} />
        <Route path="/binance-integration" element={<BinanceIntegration />} />
        <Route path="/tradingview-integration" element={<TradingViewIntegration />} />
        <Route path="/deployment-guide" element={<DeploymentGuide />} />
      </Route>
    </Routes>
  );
}

export default App;
