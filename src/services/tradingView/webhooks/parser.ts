
import { formatMessage } from '../alerts/formatters';
import { TradingViewAlert, createTradingViewAlert } from '../alerts/types';
import { WebhookData } from './types';

/**
 * Parse webhook data from various formats
 */
export function parseWebhookData(data: any): WebhookData {
  // Handle different formats of webhook data
  
  // TradingView format
  if (data.strategy?.strategy_name || data.strategy_name) {
    return parseTradingViewFormat(data);
  }
  
  // Binance format
  if (data.symbol && (data.binanceOrderType || data.binanceQuantity)) {
    return parseBinanceFormat(data);
  }
  
  // Generic format
  return parseGenericFormat(data);
}

/**
 * Parse TradingView format webhook data
 */
function parseTradingViewFormat(data: any): WebhookData {
  return {
    symbol: data.ticker || data.symbol || 'UNKNOWN',
    action: data.action || data.strategy?.order_action || 'info',
    message: data.message || data.strategy?.order_comment || `Signal for ${data.ticker || data.symbol}`,
    price: data.strategy?.order_price || data.price || data.close,
    indicators: data.indicators || [],
    timeframe: data.timeframe || data.interval || '1d',
    time: data.time || data.bar_time || Date.now(),
    details: data.details || '',
    strategy_name: data.strategy?.strategy_name || data.strategy_name || '',
    chartUrl: data.chartUrl || ''
  };
}

/**
 * Parse Binance format webhook data
 */
function parseBinanceFormat(data: any): WebhookData {
  return {
    symbol: data.symbol,
    action: data.action || data.side?.toLowerCase() || 'info',
    signal: data.signal || 'binance_order',
    price: data.binancePrice || data.price || 0,
    binanceOrderType: data.binanceOrderType,
    binanceQuantity: data.binanceQuantity,
    binancePrice: data.binancePrice,
    binanceExecute: data.binanceExecute,
    time: data.time || Date.now(),
    timeframe: data.timeframe || '1d'
  };
}

/**
 * Parse generic format webhook data
 */
function parseGenericFormat(data: any): WebhookData {
  return {
    symbol: data.symbol || data.ticker || data.coin || 'UNKNOWN',
    action: data.action || data.order || data.signal_type || 'info',
    signal: data.signal || '',
    message: data.message || data.text || '',
    price: data.price || data.current_price || data.close || 0,
    close: data.close || data.price || 0,
    indicators: data.indicators || data.indicator || [],
    timeframe: data.timeframe || data.time_frame || data.interval || '1d',
    time: data.time || data.timestamp || Date.now(),
    details: data.details || data.description || '',
    strategy_name: data.strategy_name || data.strategy || '',
    source: data.source || 'webhook'
  };
}

/**
 * Convert webhook data to TradingView alert
 */
export function webhookDataToAlert(data: WebhookData): TradingViewAlert {
  // Build messages
  const message = data.message || `Alert for ${data.symbol}`;
  
  // Create the alert object
  return createTradingViewAlert({
    symbol: data.symbol,
    action: data.action as ('buy' | 'sell' | 'info'),
    message,
    indicators: Array.isArray(data.indicators) ? data.indicators : data.indicators ? [String(data.indicators)] : [],
    timestamp: typeof data.time === 'number' ? data.time : Date.now(),
    price: typeof data.price === 'number' ? data.price : parseFloat(String(data.price || 0)),
    timeframe: data.timeframe || '1d',
    details: data.details || '',
    strategy: data.strategy_name || '',
    type: 'custom',
    source: data.source || 'webhook',
    priority: 'medium',
    chartUrl: data.chartUrl
  });
}
