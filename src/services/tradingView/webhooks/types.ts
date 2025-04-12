
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
  automatic?: boolean;  // Flag indicating if the signal was generated automatically
  source?: string;      // Source of the alert (e.g., 'tradingview', 'binance', 'manual')
  
  // Binance-specific fields
  binanceOrderType?: 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'STOP_LOSS_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT';
  binanceQuantity?: number | string;
  binancePrice?: number | string;
  binanceExecute?: boolean; // Whether to execute the trade on Binance
  fundamentalReason?: string; // Fundamental analysis reason for the signal
  confidence?: number; // Confidence level (0-100)
  riskLevel?: 'low' | 'medium' | 'high';
  
  // Sentiment analysis fields
  marketSentiment?: number; // Overall market sentiment (-100 to 100)
  assetSentiment?: number; // Asset-specific sentiment (-100 to 100)
  socialMentions?: number; // Number of social mentions in the last 24 hours
  sentimentChange?: number; // Change in sentiment over the last 24 hours
  
  // Technical analysis enhancements
  technicalScore?: number; // Technical score (0-100)
  supportLevel?: number; // Nearest support level
  resistanceLevel?: number; // Nearest resistance level
  volatilityScore?: number; // Volatility score (0-100)
  volumeAnalysis?: string; // Analysis of volume (e.g., "High", "Low", "Average")
}
