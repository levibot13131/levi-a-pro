
import { TradingViewAlert, createTradingViewAlert } from './alerts/types';
import { sendAlert } from './alerts/sender';
import { toast } from 'sonner';

// Process incoming webhook data from TradingView
export const processWebhookData = async (data: any): Promise<boolean> => {
  try {
    console.log('Processing webhook data:', data);
    
    // Make sure we have the required fields
    if (!data.symbol || !data.action) {
      console.error('Invalid webhook data: missing required fields');
      return false;
    }
    
    // Parse the price data, or use a default if not available
    const price = parseFloat(data.price || data.close || '0');
    if (isNaN(price) || price <= 0) {
      console.error('Invalid price data in webhook');
      return false;
    }
    
    // Create an alert from the webhook data
    const alert: TradingViewAlert = {
      symbol: data.symbol,
      action: data.action === 'buy' || data.action === 'sell' ? data.action : 'info',
      message: data.message || `איתות ${data.action} עבור ${data.symbol}`,
      indicators: data.indicators ? 
        (Array.isArray(data.indicators) ? data.indicators : [data.indicators]) : 
        [],
      timeframe: data.timeframe || '1d',
      timestamp: data.timestamp ? parseInt(data.timestamp) : Date.now(),
      price: price,
      details: data.details || '',
      strategy: data.strategy || '',
      chartUrl: data.chartUrl || ''
    };
    
    // Map specific TradingView strategy indicators to our system
    if (data.strategy_name) {
      switch (data.strategy_name.toLowerCase()) {
        case 'wyckoff':
        case 'wyckoff pattern':
          alert.strategy = 'Wyckoff';
          break;
        case 'magic triangle':
        case 'magic_triangle':
          alert.strategy = 'magic_triangle';
          break;
        case 'quarters':
        case 'quarters strategy':
          alert.strategy = 'quarters';
          break;
      }
    }
    
    // If we get a bar_close field, add it to the details
    if (data.bar_close) {
      alert.details = `${alert.details ? alert.details + '\n' : ''}סגירת נר: ${data.bar_close}`;
    }
    
    // Send the alert
    const success = await sendAlert(alert);
    
    if (success) {
      console.log('Successfully processed webhook data and sent alert');
    } else {
      console.error('Failed to send alert');
    }
    
    return success;
  } catch (error) {
    console.error('Error processing webhook data:', error);
    toast.error('שגיאה בעיבוד נתוני Webhook', {
      description: 'אירעה שגיאה בעיבוד נתונים מ-TradingView'
    });
    return false;
  }
};

// Handle webhook request from TradingView
export const handleTradingViewWebhook = async (req: any): Promise<boolean> => {
  try {
    let data = req.body;
    
    // If the request body is a string, try to parse it as JSON
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error('Failed to parse webhook data as JSON');
        return false;
      }
    }
    
    // Process the webhook data
    return await processWebhookData(data);
  } catch (error) {
    console.error('Error handling TradingView webhook:', error);
    return false;
  }
};

// Create a sample alert for testing
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
