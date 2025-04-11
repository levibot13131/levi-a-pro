
// Re-export everything from the modular files
export * from './alerts/types';
export * from './alerts/destinations';
export * from './alerts/sender';
export * from './alerts/formatters';
export * from './webhooks';

// Create helper function to create sample alerts for testing
export const createSampleAlert = (type: 'buy' | 'sell' | 'info' = 'info'): import('./alerts/types').TradingViewAlert => {
  const timestamp = Date.now();
  
  // Generate appropriate symbol, price, and message based on alert type
  let symbol = 'BTC/USD';
  let price = 51244.50;
  let message = 'TradingView alert sample';
  let indicators = ['RSI', 'MACD'];
  
  switch (type) {
    case 'buy':
      symbol = 'BTC/USD';
      price = 51244.50 + (Math.random() * 500);
      message = 'זוהה איתות קנייה חזק עבור Bitcoin';
      indicators = ['RSI', 'MACD', 'Golden Cross'];
      break;
    case 'sell':
      symbol = 'ETH/USD';
      price = 3022.75 - (Math.random() * 100);
      message = 'התקבל איתות מכירה למטבע Ethereum';
      indicators = ['RSI', 'Bearish Divergence'];
      break;
    case 'info':
      symbol = 'XRP/USD';
      price = 0.5023 + (Math.random() * 0.05);
      message = 'עדכון שוק: תנודתיות גבוהה צפויה';
      indicators = ['Market Volume', 'Volatility Index'];
      break;
  }
  
  // Create a properly formatted alert object
  return {
    symbol,
    message,
    indicators,
    timeframe: '1d',
    timestamp,
    price,
    action: type,
    details: `זוהי הודעת בדיקה מהמערכת. סוג: ${type}, זמן: ${new Date(timestamp).toLocaleString('he-IL')}`,
    strategy: type === 'buy' ? 'magic_triangle' : type === 'sell' ? 'Wyckoff' : 'market_analysis'
  };
};
