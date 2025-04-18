export interface TradingViewAlert {
  id?: string;
  symbol: string;
  message: string;
  action: 'buy' | 'sell' | 'info';
  timestamp: number;
  price: number;
  timeframe: string;
  type: 'price' | 'indicator' | 'custom';
  indicators?: string[];
  details?: string;
  strategy?: string;
  source?: string;
  priority?: 'low' | 'medium' | 'high';
  chartUrl?: string;
  confidence?: number;
}

export interface AlertDestination {
  id: string;
  type: 'telegram' | 'whatsapp' | 'email' | 'webhook';
  name: string;
  active: boolean;
  endpoint?: string;
  headers?: Record<string, string>;
  config?: Record<string, any>;
}

export function createTradingViewAlert(data: Partial<TradingViewAlert> & { symbol: string; message: string }): TradingViewAlert {
  return {
    symbol: data.symbol,
    message: data.message,
    action: data.action || 'info',
    timestamp: data.timestamp || Date.now(),
    price: data.price || 0,
    timeframe: data.timeframe || '1d',
    type: data.type || 'custom',
    indicators: data.indicators || [],
    details: data.details || '',
    strategy: data.strategy || '',
    source: data.source || 'system',
    priority: data.priority || 'medium',
    chartUrl: data.chartUrl
  };
}
