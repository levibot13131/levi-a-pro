
import { WebhookData } from './types';
import { TradingViewAlert, createTradingViewAlert } from '../alerts/types';
import { toast } from 'sonner';

/**
 * Validate webhook data from TradingView
 */
export const validateWebhookData = (data: any): boolean => {
  console.log('Validating webhook data:', data);
  
  // Check if data exists
  if (!data) {
    console.error('Webhook validation failed: No data received');
    return false;
  }
  
  // Check if symbol exists (required field)
  if (!data.symbol) {
    console.error('Webhook validation failed: Missing symbol field');
    return false;
  }
  
  // Further validation as needed
  const hasAction = !!data.action || !!data.signal;
  const hasPrice = !!data.price || !!data.close;
  
  console.log('Webhook validation results:', { 
    hasSymbol: !!data.symbol, 
    hasAction, 
    hasPrice,
    isValid: true // If we got here, it's valid enough to process
  });
  
  return true;
};

/**
 * Parse action type from webhook data
 */
export const parseActionType = (data: WebhookData): 'buy' | 'sell' | 'info' => {
  // Check explicit action field
  if (data.action && (data.action === 'buy' || data.action === 'sell')) {
    console.log(`Found explicit action type: ${data.action}`);
    return data.action;
  } 
  
  // Try to determine action from signal text
  if (data.signal && typeof data.signal === 'string') {
    const signalText = data.signal.toLowerCase();
    if (signalText.includes('buy') || 
        signalText.includes('bullish') || 
        signalText.includes('long') ||
        signalText.includes('breakout')) {
      console.log('Determined action type from signal text: buy');
      return 'buy';
    } else if (signalText.includes('sell') || 
              signalText.includes('bearish') || 
              signalText.includes('short') ||
              signalText.includes('breakdown')) {
      console.log('Determined action type from signal text: sell');
      return 'sell';
    }
  }
  
  console.log('No explicit action found, defaulting to: info');
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
      console.log('Determined strategy from signal: magic_triangle');
    } else if (signalText.includes('wyckoff')) {
      strategy = 'Wyckoff';
      message = `וייקוף: ${data.signal}`;
      console.log('Determined strategy from signal: Wyckoff');
    } else if (signalText.includes('quarters') || signalText.includes('fibonacci')) {
      strategy = 'quarters';
      message = `שיטת הרבעים: ${data.signal}`;
      console.log('Determined strategy from signal: quarters');
    }
  }
  
  // Explicitly handle strategy_name if provided
  if (data.strategy_name) {
    console.log(`Found explicit strategy_name: ${data.strategy_name}`);
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
      default:
        // If none of the known strategies, use the provided name
        strategy = data.strategy_name;
    }
  }
  
  // If strategy is provided directly, use it if no other strategy found
  if (!strategy && data.strategy) {
    strategy = data.strategy;
    console.log(`Using provided strategy: ${strategy}`);
  }
  
  return { strategy, message };
};

/**
 * Parse webhook data into a TradingViewAlert object
 */
export const parseWebhookData = (data: WebhookData): TradingViewAlert | null => {
  try {
    console.log('Parsing webhook data:', data);
    
    // Validate data first
    if (!validateWebhookData(data)) {
      return null;
    }
    
    // Parse action type
    const action = parseActionType(data);
    
    // Parse price data
    const price = parseFloat(String(data.price || data.close || '0'));
    if (isNaN(price) || price <= 0) {
      console.error('Invalid price data in webhook:', data.price);
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
    
    console.log('Parsed webhook data into alert:', alert);
    return alert;
  } catch (error) {
    console.error('Error parsing webhook data:', error);
    return null;
  }
};
