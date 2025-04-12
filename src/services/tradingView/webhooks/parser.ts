
import { WebhookData } from './types';
import { TradingViewAlert, createTradingViewAlert } from '../alerts/types';

/**
 * Parse webhook data from TradingView
 */
export function parseWebhookData(data: any): WebhookData {
  try {
    // Handle different formats of data (JSON string or object)
    let parsedData: any;
    if (typeof data === 'string') {
      try {
        parsedData = JSON.parse(data);
      } catch (error) {
        // If not valid JSON, assume it's a simple string message
        parsedData = { message: data };
      }
    } else {
      parsedData = data;
    }

    // Extract symbol
    const symbol = parsedData.symbol || parsedData.ticker || 'UNKNOWN';
    
    // Extract action
    let action: 'buy' | 'sell' | 'info' = 'info';
    if (parsedData.action) {
      if (typeof parsedData.action === 'string') {
        const actionLower = parsedData.action.toLowerCase();
        if (actionLower === 'buy' || actionLower === 'sell') {
          action = actionLower as 'buy' | 'sell';
        }
      }
    } else if (parsedData.signal) {
      const signalLower = String(parsedData.signal).toLowerCase();
      if (signalLower.includes('buy') || signalLower.includes('long')) {
        action = 'buy';
      } else if (signalLower.includes('sell') || signalLower.includes('short')) {
        action = 'sell';
      }
    }
    
    // Create webhook data object
    const webhookData: WebhookData = {
      symbol,
      action,
      message: parsedData.message || parsedData.alert || `Signal for ${symbol}`,
      price: parsedData.price || parsedData.close || 0,
      indicators: parsedData.indicators || [],
      timeframe: parsedData.timeframe || '1d',
      time: parsedData.time || Date.now(),
      details: parsedData.details || '',
      strategy_name: parsedData.strategy_name || parsedData.strategy || '',
      source: parsedData.source || 'tradingview'
    };
    
    return webhookData;
  } catch (error) {
    console.error('Error parsing webhook data:', error);
    return {
      symbol: 'ERROR',
      message: 'Error parsing webhook data',
      action: 'info',
      time: Date.now(),
      price: 0
    };
  }
}

/**
 * Convert webhook data to TradingView alert
 */
export function webhookDataToAlert(data: WebhookData): TradingViewAlert {
  return createTradingViewAlert({
    symbol: data.symbol,
    message: data.message,
    action: data.action || 'info',
    timestamp: typeof data.time === 'number' ? data.time : parseInt(String(data.time)) || Date.now(),
    price: typeof data.price === 'number' ? data.price : parseFloat(String(data.price)) || 0,
    timeframe: data.timeframe || '1d',
    type: data.action === 'buy' || data.action === 'sell' ? 'price' : 'custom',
    indicators: Array.isArray(data.indicators) 
      ? data.indicators 
      : typeof data.indicators === 'string' 
        ? [data.indicators] 
        : [],
    details: data.details || '',
    strategy: data.strategy_name || data.strategy || '',
    source: data.source || 'tradingview',
    chartUrl: data.chartUrl
  });
}
