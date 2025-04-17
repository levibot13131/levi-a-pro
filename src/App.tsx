
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { startRealTimeUpdates } from './services/realtime/realtimeService';
import { initializeTradingViewServices } from './services/tradingView/startup';
import { useAuth } from './contexts/AuthContext';

// Layout components
import Layout from './components/layout/Layout';

// Page components
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Login from './pages/Login';
import TradingDashboard from './pages/TradingDashboard';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Create placeholder components for missing pages
const Alerts = () => <div>Alerts Page</div>;
const Signals = () => <div>Signals Page</div>;
const Settings = () => <div>Settings Page</div>;
const TradingViewIntegration = () => <div>TradingView Integration Page</div>;
const CryptoSentiment = () => <div>Crypto Sentiment Page</div>;
const TwitterIntegration = () => <div>Twitter Integration Page</div>;

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Initialize all real-time services when the app loads
    const initializeServices = async () => {
      try {
        console.log('Initializing application services...');
        
        // Initialize TradingView services if user is authenticated
        if (isAuthenticated) {
          initializeTradingViewServices();
          // Start real-time updates
          startRealTimeUpdates();
          console.log('All authenticated application services initialized successfully');
        } else {
          console.log('User not authenticated, skipping authenticated service initialization');
          // Initialize only public services
          // (None currently, but would go here)
        }
      } catch (error) {
        console.error('Error initializing application services:', error);
      }
    };
    
    initializeServices();
  }, [isAuthenticated]); // Re-run when authentication changes
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Toaster position="top-center" expand={true} richColors closeButton />
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="assets" element={<Assets />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="signals" element={<Signals />} />
            <Route path="settings" element={<Settings />} />
            <Route path="tradingview" element={<TradingViewIntegration />} />
            <Route path="sentiment" element={<CryptoSentiment />} />
            <Route path="twitter" element={<TwitterIntegration />} />
            <Route path="trading" element={<TradingDashboard />} />
            <Route path="unauthorized" element={<Unauthorized />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
