
import { toast } from 'sonner';
import { initializeRealTimeUpdates } from './testIntegrations';

// Flag to track initialization status
let isInitialized = false;

/**
 * Initialize all TradingView related services
 */
export const initializeTradingViewServices = (): boolean => {
  if (isInitialized) {
    console.log('TradingView services already initialized');
    return true;
  }
  
  try {
    console.log('🚀 Initializing TradingView services...');
    
    // Initialize all necessary services
    const realtimeStatus = initializeRealTimeUpdates();
    
    if (realtimeStatus) {
      console.log('✅ Real-time updates initialized successfully');
    } else {
      console.warn('⚠️ Real-time updates initialization failed');
    }
    
    // More initialization can be added here
    
    // Mark as initialized
    isInitialized = true;
    
    console.log('✅ TradingView services initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Error initializing TradingView services:', error);
    toast.error('שגיאה באתחול שירותי TradingView', {
      description: 'ייתכן שחלק מהפונקציות לא יעבדו כראוי'
    });
    return false;
  }
};

/**
 * Check if TradingView services are initialized
 */
export const isTradingViewServicesInitialized = (): boolean => {
  return isInitialized;
};

// Auto-initialize when imported
initializeTradingViewServices();
