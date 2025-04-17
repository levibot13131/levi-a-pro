
// Types for TradingView chart data
export interface TradingViewChartData {
  symbol: string;
  timeframe: string;
  indicators: string[];
  lastUpdate: number; // Timestamp when data was last updated
  data: {
    timestamp: number;
    price: number;
    volume?: number;
    open?: number;
    high?: number;
    low?: number;
    close?: number;
  }[];
  lastUpdated?: number; // For backward compatibility
}

// Types for TradingView news item
export interface TradingViewNewsItem {
  id: string;
  title: string;
  description: string;
  summary?: string;
  source: string;
  url: string;
  publishDate: number;
  relatedSymbols: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: string;
  // For backward compatibility
  content?: string;
  publishedAt?: string;
}
