
import { WebhookData } from './types';
import { TradingViewAlert } from '../alerts/types';

/**
 * Validate webhook data from TradingView
 */
export const validateWebhookData = (data: WebhookData): boolean => {
  // Check if required fields exist
  if (!data.symbol) {
    console.error('Missing symbol in webhook data');
    return false;
  }
  
  // Check if either action or signal exists
  if (!data.action && !data.signal) {
    console.error('Missing action or signal in webhook data');
    return false;
  }
  
  // Check if price info exists
  if (!data.price && !data.close && !data.bar_close) {
    console.error('Missing price information in webhook data');
    return false;
  }
  
  return true;
};

/**
 * Parse webhook data into a TradingView alert
 */
export const parseWebhookData = (data: WebhookData): TradingViewAlert | null => {
  try {
    // Determine action type
    let action: 'buy' | 'sell' | 'info' = 'info';
    
    if (data.action) {
      if (data.action.toLowerCase() === 'buy') action = 'buy';
      else if (data.action.toLowerCase() === 'sell') action = 'sell';
      else action = 'info';
    } else if (data.signal) {
      const signal = data.signal.toLowerCase();
      if (signal.includes('buy') || signal.includes('long')) action = 'buy';
      else if (signal.includes('sell') || signal.includes('short')) action = 'sell';
    }
    
    // Determine price
    let price: number = 0;
    if (typeof data.price === 'number') price = data.price;
    else if (typeof data.price === 'string') price = parseFloat(data.price);
    else if (typeof data.close === 'number') price = data.close;
    else if (typeof data.close === 'string') price = parseFloat(data.close);
    else if (typeof data.bar_close === 'number') price = data.bar_close;
    else if (typeof data.bar_close === 'string') price = parseFloat(data.bar_close);
    
    // Determine message
    const message = data.message || data.signal || `${action.toUpperCase()} signal for ${data.symbol}`;
    
    // Determine indicators
    let indicators: string[] = [];
    if (typeof data.indicators === 'string') {
      indicators = data.indicators.split(',').map(i => i.trim());
    } else if (Array.isArray(data.indicators)) {
      indicators = data.indicators;
    }
    
    // Create alert object
    const alert: TradingViewAlert = {
      symbol: data.symbol,
      action,
      message,
      indicators,
      timestamp: typeof data.time === 'number' ? data.time : Date.now(),
      price,
      timeframe: data.timeframe || '1D',
      details: data.details || '',
      strategy: data.strategy_name || data.strategy || ''
    };
    
    return alert;
  } catch (error) {
    console.error('Error parsing webhook data:', error);
    return null;
  }
};

/**
 * Parse webhook data from string format (fallback)
 * Format: symbol, action, price, message
 */
export const parseWebhookString = (webhookString: string): WebhookData | null => {
  try {
    const parts = webhookString.split(',').map(part => part.trim());
    
    if (parts.length < 3) {
      console.error('Invalid webhook string format. Expected at least 3 parts');
      return null;
    }
    
    const [symbol, action, price, ...messageParts] = parts;
    const message = messageParts.join(', ');
    
    return {
      symbol,
      action: action as 'buy' | 'sell' | 'info',
      price,
      message
    };
  } catch (error) {
    console.error('Error parsing webhook string:', error);
    return null;
  }
};
