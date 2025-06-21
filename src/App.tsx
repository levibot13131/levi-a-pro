
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/AuthGuard';
import Layout from '@/components/Layout';
import Auth from '@/pages/Auth';
import Dashboard from '@/pages/Dashboard';
import Signals from '@/pages/Signals';
import Fundamentals from '@/pages/Fundamentals';
import TradingCalculators from '@/pages/TradingCalculators';
import BacktestingLab from '@/pages/BacktestingLab';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-background text-foreground">
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/" element={
                <AuthGuard>
                  <Layout>
                    <Navigate to="/dashboard" replace />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/dashboard" element={
                <AuthGuard>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/signals" element={
                <AuthGuard>
                  <Layout>
                    <Signals />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/fundamentals" element={
                <AuthGuard>
                  <Layout>
                    <Fundamentals />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/trading-calculators" element={
                <AuthGuard>
                  <Layout>
                    <TradingCalculators />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/calculators" element={
                <AuthGuard>
                  <Layout>
                    <TradingCalculators />
                  </Layout>
                </AuthGuard>
              } />
              <Route path="/backtesting" element={
                <AuthGuard>
                  <Layout>
                    <BacktestingLab />
                  </Layout>
                </AuthGuard>
              } />
            </Routes>
          </div>
          <Toaster position="top-right" />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
