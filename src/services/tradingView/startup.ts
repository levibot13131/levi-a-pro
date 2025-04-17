
import { toast } from 'sonner';
import { initializeRealTimeUpdates } from '../testIntegrations';
import { initializeTradingView } from './tradingViewAuthService';

export const initializeTradingViewServices = (): boolean => {
  try {
    console.log('🚀 Initializing TradingView services...');
    
    // Initialize TradingView auth
    const authInitialized = initializeTradingView();
    
    // Initialize real-time updates
    console.log('🚀 Initializing real-time updates...');
    const realTimeInitialized = initializeRealTimeUpdates();
    
    if (realTimeInitialized) {
      console.log('✅ Real-time updates initialized successfully');
    } else {
      console.log('❌ Failed to initialize real-time updates');
    }
    
    const success = authInitialized && realTimeInitialized;
    
    if (success) {
      console.log('✅ TradingView services initialized successfully');
    } else {
      console.log('❌ Some TradingView services failed to initialize');
    }
    
    return success;
  } catch (error) {
    console.error('Error initializing TradingView services:', error);
    return false;
  }
};
