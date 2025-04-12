
import { WebhookData } from './types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Generate sample webhook data for testing
 */
export const generateSampleWebhookData = (type: 'buy' | 'sell' | 'info' = 'info'): WebhookData => {
  const timestamp = Date.now();
  
  // Base webhook data
  const baseData: WebhookData = {
    symbol: 'BTCUSD',
    time: timestamp,
    timeframe: '1D',
    price: 0,
    action: type,
  };
  
  // Customize data based on type
  switch (type) {
    case 'buy':
      return {
        ...baseData,
        symbol: 'BTCUSD',
        price: 51244.50 + (Math.random() * 500),
        message: 'זוהה איתות קנייה חזק על Bitcoin',
        indicators: 'RSI,MACD,Golden Cross',
        strategy_name: 'Magic Triangle Strategy',
        details: 'מומנטום חיובי חזק, RSI עולה מעל 50, חציית MACD',
        automatic: Math.random() > 0.5 // 50% chance for automatic flag
      };
    case 'sell':
      return {
        ...baseData,
        symbol: 'ETHUSD',
        price: 3022.75 - (Math.random() * 100),
        message: 'התקבל איתות מכירה על Ethereum',
        indicators: 'RSI,Bearish Divergence',
        strategy_name: 'Wyckoff Distribution',
        details: 'דחייה ברמת התנגדות חזקה, RSI מראה דיברגנס שלילי',
        source: Math.random() > 0.5 ? 'automatic_watchlist' : 'manual'
      };
    case 'info':
      return {
        ...baseData,
        symbol: 'XRPUSD',
        price: 0.5023 + (Math.random() * 0.05),
        message: 'עדכון שוק: תנודתיות גבוהה צפויה',
        indicators: 'Market Volume,Volatility Index',
        strategy_name: 'Market Analysis',
        details: 'זוהתה עליה בתנודתיות השוק, מומלץ לנהוג במשנה זהירות'
      };
    default:
      return baseData;
  }
};

/**
 * Simulate a webhook request from TradingView
 */
export const simulateWebhookRequest = (type: 'buy' | 'sell' | 'info' = 'info') => {
  const webhookData = generateSampleWebhookData(type);
  
  return {
    headers: {
      'content-type': 'application/json',
      'user-agent': 'TradingView'
    },
    body: webhookData
  };
};

/**
 * Create a webhook payload in a different format to test compatibility
 */
export const createAlternativeFormatWebhook = (type: 'buy' | 'sell' | 'info' = 'info'): string => {
  const symbols = {
    buy: 'BTCUSD',
    sell: 'ETHUSD',
    info: 'XRPUSD'
  };
  
  const messages = {
    buy: 'BUY: Bitcoin crossed above 50-day MA',
    sell: 'SELL: Ethereum rejected at resistance',
    info: 'INFO: Market volatility increasing'
  };
  
  const prices = {
    buy: '51244.50',
    sell: '3022.75',
    info: '0.5023'
  };
  
  // Create simple string format that our parser should still handle
  return `${symbols[type]}, ${type}, ${prices[type]}, ${messages[type]}`;
};
