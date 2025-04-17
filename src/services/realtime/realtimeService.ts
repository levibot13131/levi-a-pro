import { toast } from 'sonner';
import { initializeTradingViewServices } from '../tradingView/startup';
import { testBinanceConnection } from '../binance/binanceService';
import { testTwitterConnection } from '../twitter/twitterService';

// Global status of real-time connections
export interface RealTimeStatus {
  tradingView: boolean;
  binance: boolean;
  twitter: boolean;
  lastChecked: number;
}

let status: RealTimeStatus = {
  tradingView: false,
  binance: false,
  twitter: false,
  lastChecked: 0
};

// Initialize all real-time connections
export const initializeRealTimeConnections = async (): Promise<RealTimeStatus> => {
  console.log('Initializing real-time connections...');
  
  try {
    // Initialize TradingView
    status.tradingView = initializeTradingViewServices();
    
    // Test Binance connection
    status.binance = await testBinanceConnection();
    
    // Test Twitter connection
    status.twitter = await testTwitterConnection();
    
    status.lastChecked = Date.now();
    
    const connectedCount = Object.values(status).filter(Boolean).length - 1; // Subtract lastChecked
    
    if (connectedCount > 0) {
      toast.success(`חיבור בזמן אמת פעיל`, {
        description: `מחובר ל-${connectedCount} שירותים בזמן אמת`
      });
    } else {
      toast.info('אין חיבורים פעילים', {
        description: 'התחבר לפחות לשירות אחד כדי לקבל נתונים בזמן אמת'
      });
    }
    
    return { ...status };
  } catch (error) {
    console.error('Error initializing real-time connections:', error);
    toast.error('שגיאה באתחול חיבורים בזמן אמת');
    return { ...status };
  }
};

// Get current status of all real-time connections
export const getRealTimeStatus = async (forceCheck: boolean = false): Promise<RealTimeStatus> => {
  // If last check was less than 60 seconds ago and not forcing a check, return cached status
  if (!forceCheck && Date.now() - status.lastChecked < 60000) {
    return { ...status };
  }
  
  // Otherwise, initialize connections again
  return await initializeRealTimeConnections();
};

// Start global real-time updates
export const startRealTimeUpdates = (): boolean => {
  try {
    console.log('Starting real-time updates...');
    
    // Here we would start any interval-based polling or WebSocket connections
    // For now, just initialize the connections
    initializeRealTimeConnections();
    
    return true;
  } catch (error) {
    console.error('Error starting real-time updates:', error);
    return false;
  }
};

// Stop global real-time updates
export const stopRealTimeUpdates = (): boolean => {
  try {
    console.log('Stopping real-time updates...');
    
    // Here we would clean up any interval-based polling or close WebSocket connections
    
    return true;
  } catch (error) {
    console.error('Error stopping real-time updates:', error);
    return false;
  }
};
