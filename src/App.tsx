import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import TradingEngine from './pages/TradingEngine';
import TradingJournal from './pages/TradingJournal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import UserManagement from './components/admin/UserManagement';
import Admin from './pages/Admin';
import ErrorBoundary from './components/ErrorBoundary';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import Calculators from './pages/Calculators';
import TradingSignals from './pages/TradingSignals';
import FundamentalReports from './pages/FundamentalReports';
import { useEffect } from 'react';
import { fundamentalsIngestion } from '@/services/fundamentals/fundamentalsIngestion';

function App() {
  useEffect(() => {
    // Start fundamentals ingestion service on app load
    console.log('🚀 Starting LeviPro fundamentals ingestion...');
    fundamentalsIngestion.start();
    
    return () => {
      fundamentalsIngestion.stop();
    };
  }, []);

  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route 
                path="/trading-engine" 
                element={
                  <ProtectedRoute>
                    <TradingEngine />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/technical-analysis" 
                element={
                  <ProtectedRoute>
                    <TechnicalAnalysis />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trading-signals" 
                element={
                  <ProtectedRoute>
                    <TradingSignals />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/trading-journal" 
                element={
                  <ProtectedRoute>
                    <TradingJournal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/calculators" 
                element={
                  <ProtectedRoute>
                    <Calculators />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/user-management" 
                element={
                  <ProtectedRoute>
                    <UserManagement />
                  </ProtectedRoute>
                } 
              />
                <Route 
                path="/fundamental-reports" 
                element={
                  <ProtectedRoute>
                    <FundamentalReports />
                  </ProtectedRoute>
                } 
              />
                <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </BrowserRouter>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
