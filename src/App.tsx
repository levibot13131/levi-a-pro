
import React, { useEffect, useState } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { startRealTimeUpdates } from './services/realtime/realtimeService';
import { initializeTradingViewServices } from './services/tradingView/startup';
import { useAuth } from './contexts/AuthContext';
import router from './routes/router';
import { useAppSettings } from './hooks/use-app-settings';
import { 
  initializeProxySettings, 
  testProxyConnection, 
  getProxyConfig,
  setupProxyHealthCheck
} from './services/proxy/proxyConfig';
import { reconnectAllWebSockets } from './services/binance/websocket';
import { apiClient } from './services/api-client-example';
import { AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const demoMode = useAppSettings((state) => state.demoMode);
  const [proxyStatus, setProxyStatus] = useState<'initializing' | 'connected' | 'error'>('initializing');
  
  // Initialize proxy and real-time services
  useEffect(() => {
    // Display loading toast
    const loadingToastId = toast.loading('Initializing system connections...');
    
    // Initialize the proxy settings first
    initializeProxySettings();
    
    // Get initial proxy configuration
    const initialConfig = getProxyConfig();
    console.log('Initial proxy configuration:', initialConfig);
    
    // Test the proxy connection
    testProxyConnection()
      .then(success => {
        console.log('Initial proxy test:', success ? 'success' : 'failed');
        setProxyStatus(success ? 'connected' : 'error');
        
        // Update toast
        toast.dismiss(loadingToastId);
        
        // Dispatch WebSocket status event
        window.dispatchEvent(new CustomEvent('websocket-status-change', {
          detail: { connected: success }
        }));
        
        if (success) {
          // Also test direct API connectivity
          return apiClient.testProxyConnection();
        }
        return false;
      })
      .then(apiSuccess => {
        console.log('API connectivity test:', apiSuccess ? 'success' : 'failed');
        
        if (apiSuccess) {
          toast.success('חיבור נתונים פעיל', {
            description: 'כל השירותים החיצוניים מחוברים כראוי'
          });
        } else if (proxyStatus === 'connected') {
          toast.warning('חיבור חלקי לנתונים', {
            description: 'הפרוקסי פעיל אך יש בעיות בחיבור ל-API'
          });
        }
      })
      .catch(err => {
        console.error('Error testing proxy:', err);
        toast.dismiss(loadingToastId);
        setProxyStatus('error');
      });
    
    // Setup proxy health check
    const cleanupHealthCheck = setupProxyHealthCheck(30000); // Check every 30 seconds
    
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
    const handleProxyConfigChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      const detail = customEvent.detail;
      console.log('Proxy configuration changed:', detail);
      
      // Show loading toast during reconnection
      const reconnectToastId = toast.loading('Reconnecting to proxy...');
      
      // Reconnect all WebSockets with the new proxy configuration
      reconnectAllWebSockets();
      
      // Test the new proxy connection
      testProxyConnection()
        .then(success => {
          console.log('Proxy test after config change:', success ? 'success' : 'failed');
          setProxyStatus(success ? 'connected' : 'error');
          
          // Dismiss loading toast
          toast.dismiss(reconnectToastId);
          
          // Dispatch WebSocket status event
          window.dispatchEvent(new CustomEvent('websocket-status-change', {
            detail: { connected: success }
          }));
          
          if (success) {
            toast.success('Proxy connection verified', { 
              description: 'All services will now use the new proxy settings'
            });
          } else {
            toast.warning('Proxy connection failed', {
              description: 'Services may not function correctly'
            });
          }
        })
        .catch(err => {
          console.error('Error testing proxy after config change:', err);
          toast.dismiss(reconnectToastId);
          setProxyStatus('error');
        });
    };
    
    window.addEventListener('proxy-config-changed', handleProxyConfigChange);
    
    // Listen for proxy status updates
    const handleProxyStatus = (event: Event) => {
      const customEvent = event as CustomEvent<{isConnected: boolean}>;
      setProxyStatus(customEvent.detail.isConnected ? 'connected' : 'error');
    };
    
    window.addEventListener('proxy-status-update', handleProxyStatus);
    
    return () => {
      window.removeEventListener('proxy-config-changed', handleProxyConfigChange);
      window.removeEventListener('proxy-status-update', handleProxyStatus);
      cleanupHealthCheck();
    };
  }, [isAuthenticated, demoMode]);
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Toaster position="top-center" expand={true} richColors closeButton />
      {proxyStatus === 'error' && (
        <div className="fixed top-0 left-0 w-full bg-yellow-500 text-black py-1 px-4 z-50 flex items-center justify-center text-sm">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span>
            Proxy connection issue - some features may not work. <a href="/proxy-settings" className="underline">Check settings</a>
          </span>
        </div>
      )}
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
