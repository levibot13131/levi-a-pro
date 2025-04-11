
import { WebhookData } from "./types";

/**
 * Generate sample webhook data for testing
 */
export const generateSampleWebhookData = (type: 'buy' | 'sell' | 'info' = 'info'): WebhookData => {
  const now = new Date();
  const timeStr = now.toISOString();
  
  // Select symbol based on type
  const symbol = type === 'buy' ? 'BTC/USD' : type === 'sell' ? 'ETH/USD' : 'XRP/USD';
  
  // Generate price based on symbol
  let price = 0;
  switch (symbol) {
    case 'BTC/USD':
      price = 47250 + (Math.random() * 1000);
      break;
    case 'ETH/USD':
      price = 2450 + (Math.random() * 100);
      break;
    case 'XRP/USD':
      price = 0.50 + (Math.random() * 0.1);
      break;
    default:
      price = 100 + (Math.random() * 10);
  }
  
  // Format price
  const formattedPrice = price.toFixed(2);
  
  // Generate strategy based on type
  let strategy = '';
  let message = '';
  let details = '';
  
  if (type === 'buy') {
    strategy = 'magic_triangle';
    message = 'זוהה פריצת משולש הקסם כלפי מעלה';
    details = 'RSI מעל 60, חציית ממוצעים נעים';
  } else if (type === 'sell') {
    strategy = 'Wyckoff';
    message = 'נמצא דפוס חלוקה של וייקוף במחיר';
    details = 'נפח יורד, PSY חלש, שבירת תמיכה';
  } else {
    strategy = 'quarters';
    message = 'עדכון מחיר: בדיקת רמת תמיכה';
    details = 'הגיע לרמת רבע שני במסגרת זמן 4 שעות';
  }
  
  // Create sample webhook data
  const data: WebhookData = {
    symbol: symbol,
    action: type,
    signal: message,
    message: message,
    price: formattedPrice,
    close: formattedPrice,
    indicators: ['RSI', 'MA Cross', strategy],
    timeframe: '1d',
    time: timeStr,
    details: details,
    strategy_name: strategy,
    strategy: strategy,
    bar_close: formattedPrice,
    chartUrl: `https://www.tradingview.com/chart/?symbol=${symbol.replace('/', '')}`
  };
  
  console.log('Generated sample webhook data:', data);
  return data;
};

/**
 * Create a sample alert for testing
 */
export const createSampleAlert = (type: 'buy' | 'sell' | 'info' = 'info') => {
  // Generate sample webhook data
  const data = generateSampleWebhookData(type);
  
  // Create an alert based on the sample data (will be processed by the webhook parser)
  return {
    symbol: data.symbol,
    message: data.message || '',
    action: type,
    indicators: data.indicators || [],
    timeframe: data.timeframe || '1d',
    timestamp: Date.now(),
    price: parseFloat(data.price?.toString() || '0'),
    details: data.details || '',
    strategy: data.strategy || '',
    chartUrl: data.chartUrl || ''
  };
};

/**
 * Simulate a webhook request from TradingView
 */
export const simulateWebhookRequest = (type: 'buy' | 'sell' | 'info' = 'info'): any => {
  // Generate sample webhook data
  const data = generateSampleWebhookData(type);
  
  // Create a simulated request object
  return {
    body: data,
    headers: {
      'content-type': 'application/json',
      'user-agent': 'TradingView'
    }
  };
};
