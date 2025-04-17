
import React, { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from './components/theme-provider';
import { startRealTimeUpdates } from './services/realtime/realtimeService';
import { initializeTradingViewServices } from './services/tradingView/startup';
import { useAuth } from './contexts/AuthContext';
import router from './routes/router';
import { useAppSettings } from './hooks/use-app-settings';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const demoMode = useAppSettings((state) => state.demoMode);
  
  useEffect(() => {
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
  }, [isAuthenticated, demoMode]);
  
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Toaster position="top-center" expand={true} richColors closeButton />
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
