
export interface WebhookSignal {
  symbol: string;
  message: string;
  indicators: string[];
  timeframe: string;
  timestamp: number;
  price: number;
  action: 'buy' | 'sell' | 'info';
  strength: number;
  details?: string;
}

export interface AlertDestination {
  id: string;
  name: string;
  type: AlertDestinationType;
  active: boolean;
  config: Record<string, any>;
}

export type AlertDestinationType = 'email' | 'telegram' | 'webhook' | 'notification' | 'sms';
