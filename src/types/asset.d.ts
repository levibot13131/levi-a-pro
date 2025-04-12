export interface TradeJournalEntry {
  id: string;
  assetId: string;
  assetName: string;
  date: string;
  direction: 'long' | 'short';
  entryPrice: number;
  stopLoss: number;
  targetPrice?: number;
  positionSize: number;
  risk: number;
  notes?: string;
  strategy: string; // Now required
  tags?: string[];
  outcome: 'open' | 'win' | 'loss' | 'breakeven';
}
