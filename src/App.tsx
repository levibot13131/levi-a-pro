
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { startRealTimeUpdates } from './services/realtime/realtimeService';
import { initializeTradingViewServices } from './services/tradingView/startup';
import { useAuth } from './contexts/AuthContext';
import router from './routes/router';
import { useAppSettings } from './hooks/use-app-settings';
import { initializeProxySettings, testProxyConnection } from './services/proxy/proxyConfig';
import { reconnectAllWebSockets } from './services/binance/websocket';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const demoMode = useAppSettings((state) => state.demoMode);
  
  useEffect(() => {
    // Initialize the proxy settings first
    initializeProxySettings();
    
    // Test the proxy connection
    testProxyConnection()
      .then(success => {
        console.log('Initial proxy test:', success ? 'success' : 'failed');
      })
      .catch(err => {
        console.error('Error testing proxy:', err);
      });
    
    // Initialize all real-time services when the app loads
    const initializeServices = async () => {
      try {
        console.log('Initializing application services...');
        console.log(`Current mode: ${demoMode ? 'DEMO' : 'PRODUCTION'}`);
        
        // Initialize TradingView services if user is authenticated
        if (isAuthenticated) {
          initializeTradingViewServices();
          // Start real-time updates
          startRealTimeUpdates();
          console.log('All authenticated application services initialized successfully');
        } else {
          console.log('User not authenticated, skipping authenticated service initialization');
        }
      } catch (error) {
        console.error('Error initializing application services:', error);
      }
    };
    
    initializeServices();
    
    // Listen for proxy configuration changes
    const handleProxyConfigChange = () => {
      console.log('Proxy configuration changed, reconnecting WebSockets');
      // Reconnect all WebSockets with the new proxy configuration
      reconnectAllWebSockets();
    };
    
    window.addEventListener('proxy-config-changed', handleProxyConfigChange);
    
    return () => {
      window.removeEventListener('proxy-config-changed', handleProxyConfigChange);
    };
  }, [isAuthenticated, demoMode]);
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Toaster position="top-center" expand={true} richColors closeButton />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;

