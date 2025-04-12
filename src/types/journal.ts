
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
  strategy?: string; // Make strategy optional in TradeJournalEntry
}

export interface TradingJournalEntry {
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
  outcome: 'open' | 'win' | 'loss' | 'breakeven';
  notes?: string;
  tags?: string[];
  strategy: string; // Strategy is required in TradingJournalEntry
}
