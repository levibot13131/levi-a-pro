
import { WebhookData } from './types';
import { TradingViewAlert, createTradingViewAlert } from '../alerts/types';
import { toast } from 'sonner';

/**
 * Validate webhook data from TradingView
 */
export const validateWebhookData = (data: any): boolean => {
  console.log('Validating webhook data:', JSON.stringify(data, null, 2));
  
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
  
  if (!hasAction) {
    console.warn('Webhook validation warning: Missing action/signal field');
  }
  
  if (!hasPrice) {
    console.warn('Webhook validation warning: Missing price/close field');
  }
  
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
        signalText.includes('long') || 
        signalText.includes('קנייה') || 
        signalText.includes('לונג') ||
        signalText.includes('bullish') || 
        signalText.includes('עולה') ||
        signalText.includes('breakout') ||
        signalText.includes('פריצה')) {
      console.log('Determined action type from signal text: buy');
      return 'buy';
    } else if (signalText.includes('sell') || 
              signalText.includes('short') || 
              signalText.includes('מכירה') || 
              signalText.includes('שורט') ||
              signalText.includes('bearish') || 
              signalText.includes('יורד') ||
              signalText.includes('breakdown') ||
              signalText.includes('שבירה')) {
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
    
    console.log('Analyzing signal text for strategy:', signalText);
    
    if (signalText.includes('triangle') || 
        signalText.includes('magic') || 
        signalText.includes('משולש')) {
      strategy = 'magic_triangle';
      message = message || `משולש הקסם: ${data.signal}`;
      console.log('Determined strategy from signal: magic_triangle');
    } else if (signalText.includes('wyckoff') || 
               signalText.includes('וייקוף')) {
      strategy = 'Wyckoff';
      message = message || `וייקוף: ${data.signal}`;
      console.log('Determined strategy from signal: Wyckoff');
    } else if (signalText.includes('quarters') || 
               signalText.includes('fibonacci') || 
               signalText.includes('רבעים') || 
               signalText.includes('פיבונאצ\'י')) {
      strategy = 'quarters';
      message = message || `שיטת הרבעים: ${data.signal}`;
      console.log('Determined strategy from signal: quarters');
    }
  }
  
  // Explicitly handle strategy_name if provided
  if (data.strategy_name) {
    console.log(`Found explicit strategy_name: ${data.strategy_name}`);
    
    const strategyName = data.strategy_name.toLowerCase();
    
    if (strategyName.includes('wyckoff')) {
      strategy = 'Wyckoff';
    } else if (strategyName.includes('magic') || strategyName.includes('triangle') || strategyName.includes('משולש')) {
      strategy = 'magic_triangle';
    } else if (strategyName.includes('quarters') || strategyName.includes('רבעים')) {
      strategy = 'quarters';
    } else {
      // If none of the known strategies, use the provided name
      strategy = data.strategy_name;
    }
  }
  
  // If strategy is provided directly, use it if no other strategy found
  if (!strategy && data.strategy) {
    strategy = data.strategy;
    console.log(`Using provided strategy: ${strategy}`);
  }
  
  console.log('Parsed strategy result:', { strategy, message });
  return { strategy, message };
};

/**
 * Parse webhook data into a TradingViewAlert object
 */
export const parseWebhookData = (data: WebhookData): TradingViewAlert | null => {
  try {
    console.log('Parsing webhook data into alert:', JSON.stringify(data, null, 2));
    
    // Validate data first
    if (!validateWebhookData(data)) {
      console.error('❌ Webhook validation failed during parsing');
      return null;
    }
    
    // Parse action type
    const action = parseActionType(data);
    console.log(`Parsed action type: ${action}`);
    
    // Parse price data
    const price = parseFloat(String(data.price || data.close || '0'));
    if (isNaN(price) || price <= 0) {
      console.error('Invalid price data in webhook:', data.price);
      return null;
    }
    console.log(`Parsed price: ${price}`);
    
    // Parse strategy and message
    const { strategy, message } = parseStrategy(data);
    console.log(`Parsed strategy: ${strategy}, message: ${message}`);
    
    // Parse timestamp
    const timestamp = data.time ? new Date(data.time).getTime() : Date.now();
    console.log(`Parsed timestamp: ${new Date(timestamp).toISOString()}`);
    
    // Parse details
    let details = data.details || '';
    
    // Add price information if not already in details
    if (!details.includes('מחיר') && !details.includes('price')) {
      details += `${details ? '\n' : ''}מחיר: ${price}`;
    }
    
    // Parse indicators
    let indicators: string[] = [];
    if (data.indicators) {
      if (Array.isArray(data.indicators)) {
        indicators = data.indicators;
      } else if (typeof data.indicators === 'string') {
        // Split if it's a comma-separated string
        indicators = data.indicators.split(',').map(i => i.trim());
      } else {
        indicators = [String(data.indicators)];
      }
    } else if (strategy) {
      indicators = [strategy];
    }
    
    console.log(`Parsed indicators: ${indicators.join(', ')}`);
    
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
    if (data.bar_close && !details.includes('סגירת נר')) {
      alert.details = `${alert.details ? alert.details + '\n' : ''}סגירת נר: ${data.bar_close}`;
    }
    
    console.log('Successfully parsed webhook data into alert:', JSON.stringify(alert, null, 2));
    return alert;
  } catch (error) {
    console.error('Error parsing webhook data:', error);
    return null;
  }
};
