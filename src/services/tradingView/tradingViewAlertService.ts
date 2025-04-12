
import { TradingViewAlert, createTradingViewAlert, AlertDestination } from './alerts/types';
import { sendAlertToDestinations } from './alerts/distributor';
import { 
  getActiveDestinations, 
  getAlertDestinations, 
  getAlertDestinationById,
  toggleDestinationActive,
  addAlertDestination,
  updateAlertDestination,
  deleteAlertDestination
} from './alerts/destinations';
import { sendAlert } from './alerts/sender';

/**
 * Process and send a TradingView alert to configured destinations
 */
export async function processAndSendAlert(alert: TradingViewAlert): Promise<boolean> {
  try {
    // Get active destinations
    const destinations = getActiveDestinations();
    
    if (destinations.length === 0) {
      console.log('No active destinations configured');
      return false;
    }
    
    // Send to all active destinations
    const successCount = await sendAlertToDestinations(alert, destinations);
    
    return successCount > 0;
  } catch (error) {
    console.error('Error processing alert:', error);
    return false;
  }
}

/**
 * Create a sample alert for testing
 */
export function createSampleAlert(type: 'buy' | 'sell' | 'info' = 'info'): TradingViewAlert {
  const timestamp = Date.now();
  
  switch (type) {
    case 'buy':
      return createTradingViewAlert({
        symbol: 'BTC/USDT',
        message: 'Sample BUY signal generated for testing',
        action: 'buy',
        timestamp,
        price: 50000,
        timeframe: '1h',
        type: 'price',
        indicators: ['RSI', 'MACD'],
        details: 'This is a sample BUY signal for testing purposes',
        source: 'system-test'
      });
    
    case 'sell':
      return createTradingViewAlert({
        symbol: 'BTC/USDT',
        message: 'Sample SELL signal generated for testing',
        action: 'sell',
        timestamp,
        price: 48000,
        timeframe: '1h',
        type: 'price',
        indicators: ['RSI', 'MACD'],
        details: 'This is a sample SELL signal for testing purposes',
        source: 'system-test'
      });
    
    default:
      return createTradingViewAlert({
        symbol: 'BTC/USDT',
        message: 'Sample INFO alert generated for testing',
        action: 'info',
        timestamp,
        price: 49000,
        timeframe: '1h',
        type: 'custom',
        details: 'This is a sample INFO alert for testing purposes',
        source: 'system-test'
      });
  }
}

// Re-export functions from destinations.ts
export {
  getActiveDestinations,
  getAlertDestinations,
  getAlertDestinationById,
  toggleDestinationActive,
  addAlertDestination,
  updateAlertDestination,
  deleteAlertDestination,
  AlertDestination
};

// Re-export functions from sender.ts
export { sendAlert };

