
// Alert destination types
export type AlertDestinationType = 'webhook' | 'telegram' | 'whatsapp' | 'email';

// Alert destination interface
export interface AlertDestination {
  id: string;
  name: string;
  type: AlertDestinationType;
  active: boolean;
  endpoint?: string;  // URL for webhooks
  headers?: Record<string, string>;  // Headers for webhook requests
}

// Alert message interface
export interface AlertMessage {
  id: string;
  symbol: string;
  price: number;
  action: 'buy' | 'sell' | 'info';
  message: string;
  timestamp: number;
  source: string;
}

// Alert result interface
export interface AlertResult {
  success: boolean;
  destinationId: string;
  destinationType: AlertDestinationType;
  error?: string;
  timestamp: number;
}

// Alert status interface
export interface AlertStatus {
  message: AlertMessage;
  results: AlertResult[];
  timestamp: number;
}
