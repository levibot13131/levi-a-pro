
export interface TradeJournalEntry {
  id: string;
  assetId: string;
  assetName: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  entryDate: string; // Changed from number to string
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
  date: string; // Changed from optional to required
  symbol?: string;
  direction: 'long' | 'short'; // Changed from optional to required
  stopLoss: number; // Changed from optional to required
  targetPrice?: number;
  positionSize: number; // Changed from optional to required
  risk: number; // Changed from optional to required
}

export interface TradingJournalEntry {
  id: string;
  assetId: string;
  assetName: string;
  type?: 'buy' | 'sell';
  entryPrice: number;
  entryDate?: string; // Changed from number to string
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
  date: string;  // Already required
  symbol?: string;
  direction: 'long' | 'short'; // Changed from optional to required
  stopLoss: number; // Changed from optional to required
  targetPrice?: number;
  positionSize: number; // Changed from optional to required
  risk: number; // Changed from optional to required
}
