
import { TradeSignal } from '@/types/asset';

// Asset name mapping for more readable signals
const assetNameMap: Record<string, string> = {
  'bitcoin': 'BTC',
  'ethereum': 'ETH',
  'binancecoin': 'BNB',
  'solana': 'SOL',
  'cardano': 'ADA',
  'ripple': 'XRP',
  'polkadot': 'DOT',
  'avalanche': 'AVAX'
};

// Strategies
const strategies = [
  'RSI Divergence',
  'MACD Crossover',
  'Breakout',
  'Support Bounce',
  'EMA Cross',
  'Bollinger Bounce',
  'Volume Spike',
  'Double Bottom',
  'Triple Top'
];

// Timeframes
const timeframes = ['5m', '15m', '1h', '4h', '1d'];

// Random in range
const randomInRange = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

// Random choice from array
const randomChoice = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Generate a mock signal for the given asset
export const generateSignal = (assetId: string, strategy?: string): TradeSignal => {
  const now = Date.now();
  const signalType = Math.random() > 0.5 ? 'buy' : 'sell';
  const basePrice = 1000 + Math.random() * 50000;
  const strengths = ['weak', 'medium', 'strong'] as ['weak', 'medium', 'strong'];
  
  // Get symbol name from map or create one
  const symbolName = assetNameMap[assetId] || assetId.substring(0, 3).toUpperCase();
  
  const signal: TradeSignal = {
    id: `signal_${now}_${assetId}`,
    assetId,
    symbolName,
    type: signalType,
    price: basePrice,
    timestamp: now,
    strength: randomChoice(strengths),
    strategy: strategy || randomChoice(strategies),
    timeframe: randomChoice(timeframes),
    targetPrice: signalType === 'buy' ? basePrice * 1.05 : basePrice * 0.95,
    stopLoss: signalType === 'buy' ? basePrice * 0.98 : basePrice * 1.02,
    riskRewardRatio: 2.5,
    createdAt: now,
    confidence: Math.floor(randomInRange(60, 95)),
    indicator: signalType === 'buy' ? 'פריצת התנגדות' : 'שבירת תמיכה',
    description: signalType === 'buy' 
      ? 'איתות קנייה בהתבסס על ניתוח טכני ומומנטום חיובי'
      : 'איתות מכירה בהתבסס על היפוך מגמה ואינדיקטורים שליליים',
    notes: 'פרטים נוספים על האיתות יופיעו כאן.'
  };
  
  return signal;
};
