
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import TradingEngine from './pages/TradingEngine';
import TradingJournal from './pages/TradingJournal';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Auth from './pages/Auth';
import Profile from './pages/Profile';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import UserManagement from './components/admin/UserManagement';
import Admin from './pages/Admin';
import ErrorBoundary from './components/ErrorBoundary';
import TechnicalAnalysis from './pages/TechnicalAnalysis';
import TradingSignals from './pages/TradingSignals';

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <BrowserRouter>
          <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/auth" element={<Auth />} />
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
