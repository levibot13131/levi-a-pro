
// Types for TradingView alerts
export interface TradingViewAlert {
  id: string;
  symbol: string;
  message: string;
  type: 'buy' | 'sell' | 'info';
  timeframe: string;
  price: number;
  timestamp: number;
  indicators: string[];
  source: 'tradingview' | 'custom' | 'webhook';
  priority: 'high' | 'medium' | 'low';
  status: 'new' | 'delivered' | 'failed';
}

export const createTradingViewAlert = (partial: Partial<TradingViewAlert>): TradingViewAlert => {
  return {
    id: partial.id || `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    symbol: partial.symbol || 'UNKNOWN',
    message: partial.message || 'No message provided',
    type: partial.type || 'info',
    timeframe: partial.timeframe || '1d',
    price: partial.price || 0,
    timestamp: partial.timestamp || Date.now(),
    indicators: partial.indicators || [],
    source: partial.source || 'custom',
    priority: partial.priority || 'medium',
    status: partial.status || 'new'
  };
};
