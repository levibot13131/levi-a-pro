
import { WebhookData } from './types';
import { TradingViewAlert, createTradingViewAlert } from '../alerts/types';
import { toast } from 'sonner';

/**
 * Parse action type from webhook data
 */
export const parseActionType = (data: WebhookData): 'buy' | 'sell' | 'info' => {
  // Check explicit action field
  if (data.action && (data.action === 'buy' || data.action === 'sell')) {
    return data.action;
  } 
  
  // Try to determine action from signal text
  if (data.signal && typeof data.signal === 'string') {
    const signalText = data.signal.toLowerCase();
    if (signalText.includes('buy') || 
        signalText.includes('bullish') || 
        signalText.includes('long') ||
        signalText.includes('breakout')) {
      return 'buy';
    } else if (signalText.includes('sell') || 
              signalText.includes('bearish') || 
              signalText.includes('short') ||
              signalText.includes('breakdown')) {
      return 'sell';
    }
  }
  
  // Default to info
  return 'info';
};

/**
 * Parse and determine strategy from signal text or strategy name
 */
export const parseStrategy = (data: WebhookData): { strategy: string, message: string } => {
  let strategy = '';
  let message = data.message || data.signal || `איתות ${data.action || 'info'} עבור ${data.symbol}`;
  
  // Try to determine strategy from signal text
  if (data.signal && typeof data.signal === 'string') {
    const signalText = data.signal.toLowerCase();
    if (signalText.includes('triangle') || signalText.includes('magic')) {
      strategy = 'magic_triangle';
      message = `משולש הקסם: ${data.signal}`;
    } else if (signalText.includes('wyckoff')) {
      strategy = 'Wyckoff';
      message = `וייקוף: ${data.signal}`;
    } else if (signalText.includes('quarters') || signalText.includes('fibonacci')) {
      strategy = 'quarters';
      message = `שיטת הרבעים: ${data.signal}`;
    }
  }
  
  // Explicitly handle strategy_name if provided
  if (data.strategy_name) {
    switch (data.strategy_name.toLowerCase()) {
      case 'wyckoff':
      case 'wyckoff pattern':
        strategy = 'Wyckoff';
        break;
      case 'magic triangle':
      case 'magic_triangle':
        strategy = 'magic_triangle';
        break;
      case 'quarters':
      case 'quarters strategy':
        strategy = 'quarters';
        break;
    }
  }
  
  return { strategy, message };
};

/**
 * Parse webhook data into a TradingViewAlert object
 */
export const parseWebhookData = (data: WebhookData): TradingViewAlert | null => {
  try {
    console.log('Parsing webhook data:', data);
    
    // Validate required fields
    if (!data.symbol) {
      console.error('Invalid webhook data: missing symbol field');
      return null;
    }
    
    // Parse action type
    const action = parseActionType(data);
    
    // Parse price data
    const price = parseFloat(String(data.price || data.close || '0'));
    if (isNaN(price) || price <= 0) {
      console.error('Invalid price data in webhook');
      return null;
    }
    
    // Parse strategy and message
    const { strategy, message } = parseStrategy(data);
    
    // Parse timestamp
    const timestamp = data.time ? new Date(data.time).getTime() : Date.now();
    
    // Parse details
    let details = data.details || '';
    
    // Add price information if not already in details
    if (!details.includes('מחיר') && !details.includes('price')) {
      details += `${details ? '\n' : ''}מחיר: ${price}`;
    }
    
    // Parse indicators
    const indicators = data.indicators ? 
      (Array.isArray(data.indicators) ? data.indicators : [data.indicators]) : 
      strategy ? [strategy] : [];
    
    // Create alert object
    const alert: TradingViewAlert = {
      symbol: data.symbol,
      action: action,
      message: message,
      indicators: indicators,
      timeframe: data.timeframe || '1d',
      timestamp: timestamp,
      price: price,
      details: details,
      strategy: strategy || data.strategy || '',
      chartUrl: data.chartUrl || `https://www.tradingview.com/chart/?symbol=${data.symbol}`
    };
    
    // Add bar_close to details if available
    if (data.bar_close) {
      alert.details = `${alert.details ? alert.details + '\n' : ''}סגירת נר: ${data.bar_close}`;
    }
    
    console.log('Parsed alert:', alert);
    return alert;
  } catch (error) {
    console.error('Error parsing webhook data:', error);
    return null;
  }
};
