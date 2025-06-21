
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import FundamentalData from './pages/FundamentalData';
import MarketSentiment from './pages/MarketSentiment';
import ChartsAnalysis from './pages/ChartsAnalysis';
import TradingEngineControl from './components/trading-engine/TradingEngineControl';
import AdminDashboard from './components/admin/AdminDashboard';
import Auth from './pages/Auth';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-background">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="technical-analysis" element={<TechnicalAnalysis />} />
              <Route path="fundamental-data" element={<FundamentalData />} />
              <Route path="market-sentiment" element={<MarketSentiment />} />
              <Route path="charts-analysis" element={<ChartsAnalysis />} />
              <Route path="trading-engine" element={<TradingEngineControl />} />
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Routes>
          <Toaster 
            position="top-right" 
            richColors 
            expand 
            closeButton
            toastOptions={{
              duration: 5000,
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
