
export interface TradeJournalEntry {
  id: string;
  assetId: string;
  assetName: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  entryDate: number;
  exitPrice?: number;
  exitDate?: number;
  quantity: number;
  leverage?: number;
  fees?: number;
  profit?: number;
  profitPercentage?: number;
  outcome?: 'open' | 'win' | 'loss' | 'breakeven';
  notes?: string;
  tags?: string[];
  strategy?: string;
  date?: string;
  symbol?: string;
  direction?: 'long' | 'short';
  stopLoss?: number;
  targetPrice?: number;
  positionSize?: number;
  risk?: number;
}

export interface TradingJournalEntry {
  id: string;
  assetId: string;
  assetName: string;
  type?: 'buy' | 'sell';
  entryPrice: number;
  entryDate?: number;
  exitPrice?: number;
  exitDate?: number;
  quantity?: number;
  leverage?: number;
  fees?: number;
  profit?: number;
  profitPercentage?: number;
  outcome: 'open' | 'win' | 'loss' | 'breakeven';
  notes?: string;
  tags?: string[];
  strategy: string;
  date: string;  // Changed to required
  symbol?: string;
  direction?: 'long' | 'short';
  stopLoss?: number;
  targetPrice?: number;
  positionSize?: number;
  risk?: number;
}
