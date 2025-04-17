
import { isTradingViewConnected, initializeTradingView } from './tradingViewAuthService';
import { toast } from 'sonner';

/**
 * Initialize TradingView services if user is authenticated and connected to TradingView
 * @returns Boolean indicating whether services were successfully initialized
 */
export const initializeTradingViewServices = (): boolean => {
  try {
    console.log('Initializing TradingView services...');
    
    // Check if TradingView is connected
    if (!isTradingViewConnected()) {
      console.log('TradingView not connected, skipping service initialization');
      return false;
    }
    
    // Initialize TradingView
    const initialized = initializeTradingView();
    
    if (initialized) {
      console.log('TradingView services initialized successfully');
    } else {
      console.warn('Failed to initialize TradingView services');
    }
    
    return initialized;
  } catch (error) {
    console.error('Error initializing TradingView services:', error);
    toast.error('שגיאה באתחול שירותי TradingView');
    return false;
  }
};

// Auto-initialize TradingView services when this module is loaded
// Only if TradingView is connected
if (isTradingViewConnected()) {
  console.log('Auto-initializing TradingView services on module load');
  initializeTradingViewServices();
} else {
  console.log('TradingView not connected, skipping auto-initialization');
}
