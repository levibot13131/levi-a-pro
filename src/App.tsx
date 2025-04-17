
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './providers/theme-provider';
import { startRealTimeUpdates } from './services/realtime/realtimeService';
import { initializeTradingViewServices } from './services/tradingView/startup';

// Layout components
import Layout from './components/layout/Layout';

// Page components
import Dashboard from './pages/Dashboard';
import Assets from './pages/Assets';
import Alerts from './pages/Alerts';
import Signals from './pages/Signals';
import Settings from './pages/Settings';
import TradingViewIntegration from './pages/TradingViewIntegration';
import CryptoSentiment from './pages/CryptoSentiment';
import TwitterIntegration from './pages/TwitterIntegration';

const App: React.FC = () => {
  useEffect(() => {
    // Initialize all real-time services when the app loads
    const initializeServices = async () => {
      try {
        console.log('Initializing application services...');
        
        // Initialize TradingView services
        initializeTradingViewServices();
        
        // Start real-time updates
        startRealTimeUpdates();
        
        console.log('All application services initialized successfully');
      } catch (error) {
        console.error('Error initializing application services:', error);
      }
    };
    
    initializeServices();
  }, []);
  
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
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;
