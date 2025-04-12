
// Types for TradingView alerts
export interface TradingViewAlert {
  id?: string;
  symbol: string;
  message: string;
  type: 'buy' | 'sell' | 'info';
  timeframe: string;
  price: number;
  timestamp: number;
  indicators: string[];
  source: 'tradingview' | 'custom' | 'webhook';
  priority: 'high' | 'medium' | 'low';
  status?: 'new' | 'processed' | 'error';
  strategy?: string;
  details?: string;
  chartUrl?: string;
  action?: 'buy' | 'sell' | 'info';
}

export interface AlertDestination {
  id: string;
  name: string;
  type: AlertDestinationType;
  active: boolean;
  config: Record<string, any>;
  endpoint?: string;
  headers?: Record<string, string>;
}

export type AlertDestinationType = 'email' | 'telegram' | 'webhook' | 'notification' | 'sms' | 'whatsapp';

export function createTradingViewAlert(data: Partial<TradingViewAlert>): TradingViewAlert {
  return {
    id: data.id || `alert-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    symbol: data.symbol || 'UNKNOWN',
    message: data.message || 'Levi Bot Alert',
    type: data.type || 'info',
    timeframe: data.timeframe || '1d',
    price: data.price || 0,
    timestamp: data.timestamp || Date.now(),
    indicators: data.indicators || [],
    source: data.source || 'custom',
    priority: data.priority || 'medium',
    status: data.status || 'new',
    strategy: data.strategy,
    details: data.details,
    chartUrl: data.chartUrl,
    action: data.action
  };
}
