import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Sidebar from '@/components/Sidebar';
import Index from '@/pages/Index';
import TradingDashboard from '@/pages/TradingDashboard';
import TradingSignals from '@/pages/TradingSignals';
import BacktestingLab from '@/pages/BacktestingLab';
import FundamentalData from '@/pages/FundamentalData';
import Fundamentals from '@/pages/Fundamentals';
import TradingCalculators from '@/pages/TradingCalculators';
import Auth from '@/pages/Auth';
import './App.css';

const queryClient = new QueryClient();

function App() {
  console.log('🚀 App component initializing...');

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route
                path="/*"
                element={
                  <AuthGuard>
                    <div className="flex">
                      <Sidebar />
                      <main className="flex-1 ml-64">
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<TradingDashboard />} />
                          <Route path="/signals" element={<TradingSignals />} />
                          <Route path="/backtesting" element={<BacktestingLab />} />
                          <Route path="/fundamental-data" element={<FundamentalData />} />
                          <Route path="/fundamentals" element={<Fundamentals />} />
                          <Route path="/calculators" element={<TradingCalculators />} />
                        </Routes>
                      </main>
                    </div>
                  </AuthGuard>
                }
              />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
