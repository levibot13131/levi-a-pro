
export interface WebhookSignal {
  id: string;
  timestamp: number;
  symbol: string;
  message: string;
  action: 'buy' | 'sell' | 'info';
  source: string;
  details?: string;
}
