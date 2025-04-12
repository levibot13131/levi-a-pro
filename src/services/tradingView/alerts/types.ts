
export type AlertDestinationType = 'telegram' | 'webhook' | 'whatsapp' | 'email' | 'sms';

export interface AlertDestination {
  id: string;
  name: string;
  type: AlertDestinationType;
  active: boolean;
  endpoint?: string;
  headers?: Record<string, string>;
  config: {
    method?: 'POST' | 'GET';
    format?: 'json' | 'form';
    botToken?: string;
    chatId?: string;
    phone?: string;
    template?: string;
  };
}

export interface AlertMessage {
  title: string;
  message: string;
  timestamp: number;
  symbol: string;
  price: number;
  action: 'buy' | 'sell' | 'info';
  timeframe: string;
  indicator?: string;
  imageUrl?: string;
}

export interface TradingViewAlert {
  symbol: string;
  action: 'buy' | 'sell' | 'info';
  message: string;
  indicators?: string[];
  timestamp: number;
  price: number;
  timeframe: string;
  details?: string;
  strategy?: string;
  type: 'price' | 'indicator' | 'pattern' | 'custom';
  source: string;
  priority: 'high' | 'medium' | 'low';
  chartUrl?: string; // Added missing property
}

export function createTradingViewAlert(data: Partial<TradingViewAlert>): TradingViewAlert {
  return {
    symbol: data.symbol || 'UNKNOWN',
    action: data.action || 'info',
    message: data.message || '',
    indicators: data.indicators || [],
    timestamp: data.timestamp || Date.now(),
    price: data.price || 0,
    timeframe: data.timeframe || '1d',
    details: data.details || '',
    strategy: data.strategy || '',
    type: data.type || 'custom',
    source: data.source || 'tradingview',
    priority: data.priority || 'medium',
    chartUrl: data.chartUrl,
  };
}
