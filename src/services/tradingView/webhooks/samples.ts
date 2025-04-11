
import { TradingViewAlert, createTradingViewAlert } from '../alerts/types';

/**
 * Create a sample alert for testing
 */
export const createSampleAlert = (action: 'buy' | 'sell' | 'info' = 'info'): TradingViewAlert => {
  const symbols = ['BTCUSD', 'ETHUSD', 'AAPL', 'AMZN', 'TSLA'];
  const timeframes = ['5m', '15m', '1h', '4h', '1d'];
  const indicators = ['RSI', 'MACD', 'MA Cross', 'Bollinger Bands', 'Volume Profile'];
  const strategies = ['Wyckoff', 'magic_triangle', 'quarters'];
  
  const symbol = symbols[Math.floor(Math.random() * symbols.length)];
  const price = symbol.includes('USD') ? 
    (symbol === 'BTCUSD' ? 55000 + Math.random() * 10000 : 2500 + Math.random() * 1000) : 
    100 + Math.random() * 200;
  
  const selectedStrategy = strategies[Math.floor(Math.random() * strategies.length)];
  let message = '';
  
  switch(selectedStrategy) {
    case 'Wyckoff':
      message = action === 'buy' ? 
        'זוהה שלב מצבר (accumulation) בדפוס Wyckoff' : 
        'זוהה שלב חלוקה (distribution) בדפוס Wyckoff';
      break;
    case 'magic_triangle':
      message = action === 'buy' ? 
        'פריצת משולש הקסם כלפי מעלה' : 
        'שבירת משולש הקסם כלפי מטה';
      break;
    case 'quarters':
      message = action === 'buy' ? 
        'השלמת תיקון 3/4 והתחלת מהלך עולה' : 
        'שבירת רמת 1/4 והתחלת מהלך יורד';
      break;
  }
  
  return createTradingViewAlert(
    symbol,
    action,
    price,
    timeframes[Math.floor(Math.random() * timeframes.length)],
    message,
    [indicators[Math.floor(Math.random() * indicators.length)]],
    `איתות שנוצר ע"י אסטרטגיית ${selectedStrategy}`,
    selectedStrategy,
    `https://www.tradingview.com/chart/?symbol=${symbol}`
  );
};
