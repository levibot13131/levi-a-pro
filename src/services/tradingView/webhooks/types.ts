
import { TradingViewAlert } from "../alerts/types";

export interface WebhookData {
  symbol: string;
  action?: 'buy' | 'sell' | 'info';
  signal?: string;
  message?: string;
  price?: string | number;
  close?: string | number;
  indicators?: string | string[];
  timeframe?: string;
  time?: string | number;
  details?: string;
  strategy_name?: string;
  strategy?: string;
  bar_close?: string | number;
  chartUrl?: string;
  automatic?: boolean;
  source?: string;
}
