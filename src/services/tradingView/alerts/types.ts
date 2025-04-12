
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
