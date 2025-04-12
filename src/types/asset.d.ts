
// Add the TradeJournalEntry interface
export interface TradeJournalEntry {
  id: string;
  date: string;
  assetId: string;
  assetName: string;
  direction: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  targetPrice?: number;
  positionSize: number;
  risk: number;
  notes?: string;
  strategy: string; // Make this required
  tags?: string[];
  outcome: 'open' | 'closed' | 'win' | 'loss' | 'breakeven';
}
