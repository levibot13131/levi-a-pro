
import { WebhookData } from './types';
import { v4 as uuidv4 } from 'uuid';
import { TradingViewAlert } from '../alerts/types';

/**
 * Generate sample webhook data for testing
 */
export const generateSampleWebhookData = (
  type: 'buy' | 'sell' | 'info' = 'info',
  customSymbol?: string
): WebhookData => {
  const symbols = ['BTC/USD', 'ETH/USD', 'XRP/USD', 'SOL/USD', 'ADA/USD', 'DOT/USD'];
  const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d', '1w'];
  
  // Select random symbol if not provided
  const symbol = customSymbol || symbols[Math.floor(Math.random() * symbols.length)];
  const price = type === 'buy' 
    ? Math.floor(Math.random() * 5000) + 30000  // Higher price for buy signals
    : Math.floor(Math.random() * 3000) + 28000; // Lower price for sell signals
  
  // Select random timeframe
  const timeframe = timeframes[Math.floor(Math.random() * timeframes.length)];
  
  // Base webhook data
  const data: WebhookData = {
    symbol,
    price,
    timeframe,
    time: Date.now(),
  };
  
  // Add different properties based on signal type
  switch (type) {
    case 'buy':
      return {
        ...data,
        action: 'buy',
        signal: 'BUY Signal Detected',
        message: `Buy Signal for ${symbol} at $${price}`,
        indicators: ['RSI', 'MACD', 'Magic Triangle'],
        strategy_name: 'magic_triangle',
        details: 'RSI is oversold, price formed a bullish pattern',
        chartUrl: `https://www.tradingview.com/chart/?symbol=${symbol.replace('/', '')}`
      };
      
    case 'sell':
      return {
        ...data,
        action: 'sell',
        signal: 'SELL Signal Detected',
        message: `Sell Signal for ${symbol} at $${price}`,
        indicators: ['RSI', 'MACD', 'Wyckoff'],
        strategy_name: 'Wyckoff',
        details: 'RSI is overbought, price reached distribution phase',
        chartUrl: `https://www.tradingview.com/chart/?symbol=${symbol.replace('/', '')}`
      };
      
    default:
      // Info signal
      return {
        ...data,
        action: 'info',
        signal: 'Market Update',
        message: `${symbol} is trading at $${price}`,
        indicators: ['Quarters', 'Support/Resistance'],
        strategy_name: 'quarters',
        details: 'Price is at key support level',
        chartUrl: `https://www.tradingview.com/chart/?symbol=${symbol.replace('/', '')}`
      };
  }
};

/**
 * Create a sample TradingView alert for testing
 */
export const createSampleAlert = (
  type: 'buy' | 'sell' | 'info' = 'info',
  customSymbol?: string
): TradingViewAlert => {
  const webhookData = generateSampleWebhookData(type, customSymbol);
  
  // Default values
  const symbol = webhookData.symbol || 'BTC/USD';
  const price = Number(webhookData.price || 30000);
  const timestamp = webhookData.time ? Number(webhookData.time) : Date.now();
  const action = webhookData.action || 'info';
  
  const alert: TradingViewAlert = {
    symbol,
    message: webhookData.message || `${action.toUpperCase()} signal for ${symbol}`,
    indicators: Array.isArray(webhookData.indicators) 
      ? webhookData.indicators 
      : webhookData.indicators 
        ? [webhookData.indicators] 
        : ['Sample Indicator'],
    timeframe: webhookData.timeframe || '1d',
    timestamp,
    price,
    action: action as 'buy' | 'sell' | 'info',
    details: webhookData.details || `Sample ${action} signal details`,
    strategy: webhookData.strategy_name || '',
    chartUrl: webhookData.chartUrl || `https://www.tradingview.com/chart/?symbol=${symbol.replace('/', '')}`
  };
  
  return alert;
};

/**
 * Simulate a webhook request from TradingView
 */
export const simulateWebhookRequest = (type: 'buy' | 'sell' | 'info' = 'info'): any => {
  const data = generateSampleWebhookData(type);
  
  // Simulate a request object with body property
  return {
    body: data
  };
};
