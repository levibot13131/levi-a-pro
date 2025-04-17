
/**
 * Types for TradingView chart data and news integration
 */

/**
 * Represents chart data from TradingView
 * @property symbol - Trading symbol (e.g., 'BTCUSD')
 * @property timeframe - Chart timeframe (e.g., '1D', '4h')
 * @property indicators - List of active indicators
 * @property lastUpdate - Timestamp when data was last updated
 * @property data - Array of price data points
 * @property lastUpdated - Deprecated; use lastUpdate instead
 */
export interface TradingViewChartData {
  symbol: string;
  timeframe: string;
  indicators: string[];
  lastUpdate: number; // Timestamp when data was last updated
  data: TradingViewDataPoint[];
  lastUpdated?: number; // For backward compatibility
}

/**
 * Represents a single data point in a TradingView chart
 * @property timestamp - Unix timestamp in milliseconds
 * @property price - Current price
 * @property volume - Optional trading volume
 * @property open - Optional opening price
 * @property high - Optional highest price in the period
 * @property low - Optional lowest price in the period
 * @property close - Optional closing price
 */
export interface TradingViewDataPoint {
  timestamp: number;
  price: number;
  volume?: number;
  open?: number;
  high?: number;
  low?: number;
  close?: number;
}

/**
 * Represents a news item from TradingView
 * @property id - Unique identifier
 * @property title - News headline
 * @property description - Short description of the news
 * @property summary - Optional longer summary
 * @property source - News source name
 * @property url - Link to full article
 * @property publishDate - Timestamp when the news was published
 * @property relatedSymbols - Array of symbols related to this news
 * @property sentiment - Optional sentiment classification
 * @property category - Optional news category
 * @property content - Deprecated; use description instead
 * @property publishedAt - Deprecated; use publishDate instead
 */
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

/**
 * Represents TradingView authentication credentials
 * @property username - TradingView account username
 * @property password - TradingView account password (not stored persistently)
 * @property apiKey - TradingView API key
 * @property lastConnected - Timestamp of last successful connection
 * @property isConnected - Backward compatibility flag
 */
export interface TradingViewCredentials {
  username: string;
  password?: string;
  apiKey?: string;
  lastConnected: number;
  isConnected?: boolean;
}
