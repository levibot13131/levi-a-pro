
// Whale tracker service
import { toast } from 'sonner';

export interface WhaleMovement {
  id: string;
  assetId: string;
  walletAddress: string;
  walletLabel?: string;
  amount: number;
  timestamp: number;
  transactionType: 'exchange_deposit' | 'exchange_withdrawal' | 'wallet_transfer';
  source?: string;
  destination?: string;
  impact: {
    significance: 'low' | 'medium' | 'high' | 'very-high';
    priceImpact: number;
  };
}

export interface WhaleBehaviorPattern {
  pattern: string;
  description: string;
  confidence: number;
  lastOccurrence: number;
  priceImpact: string;
  recommendation: string;
}

export const getWhaleMovements = async (assetId: string, days: number = 7): Promise<WhaleMovement[]> => {
  // In a real application, this would fetch data from an API
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  
  return mockWhaleMovements.filter(movement => 
    movement.assetId.toLowerCase() === assetId.toLowerCase() &&
    movement.timestamp > Date.now() - days * 24 * 60 * 60 * 1000
  );
};

export const getWhaleBehaviorPatterns = async (assetId: string): Promise<WhaleBehaviorPattern[]> => {
  // In a real application, this would fetch data from an API
  await new Promise(resolve => setTimeout(resolve, 700)); // Simulate API delay
  
  return mockWhaleBehaviorPatterns.filter(pattern => 
    pattern.pattern.toLowerCase().includes(assetId.toLowerCase()) ||
    Math.random() > 0.5 // Randomly include some patterns for demonstration
  );
};

export const subscribeToWhaleAlerts = async (assetId: string): Promise<boolean> => {
  // Simulate subscription
  await new Promise(resolve => setTimeout(resolve, 300));
  
  toast.success('נרשמת להתראות על תנועות ארנקים גדולים', {
    description: `תקבל התראות בזמן אמת על תנועות משמעותיות של ${assetId}`
  });
  
  return true;
};

// Mock data for demonstration
const mockWhaleMovements: WhaleMovement[] = [
  {
    id: 'wm-1',
    assetId: 'bitcoin',
    walletAddress: '3FZbgi29cpjq2GjdwV8eyHuJJnkLtktZc5',
    walletLabel: 'Binance Cold Wallet',
    amount: 2500000,
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    transactionType: 'exchange_withdrawal',
    source: 'Binance',
    destination: 'Unknown Wallet',
    impact: {
      significance: 'very-high',
      priceImpact: 3.2
    }
  },
  {
    id: 'wm-2',
    assetId: 'bitcoin',
    walletAddress: '1LQoWist8KkaUXSPKZHNvEyfrEkPHzSsCd',
    amount: 1800000,
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    transactionType: 'wallet_transfer',
    source: 'Unknown Wallet',
    destination: 'Coinbase',
    impact: {
      significance: 'high',
      priceImpact: 2.1
    }
  },
  {
    id: 'wm-3',
    assetId: 'ethereum',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    walletLabel: 'FTX Reserve Wallet',
    amount: 950000,
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    transactionType: 'exchange_deposit',
    source: 'Unknown Wallet',
    destination: 'FTX',
    impact: {
      significance: 'medium',
      priceImpact: 1.2
    }
  }
];

const mockWhaleBehaviorPatterns: WhaleBehaviorPattern[] = [
  {
    pattern: 'Bitcoin Accumulation Pattern',
    description: 'Whale addresses holding over $100M in BTC have been consistently accumulating over the past 30 days.',
    confidence: 85,
    lastOccurrence: Date.now() - 5 * 24 * 60 * 60 * 1000,
    priceImpact: '+5-8% within 14 days',
    recommendation: 'Consider accumulating on dips, as whale holders historically lead price movements.'
  },
  {
    pattern: 'Ethereum Exchange Outflows',
    description: 'Large amounts of ETH being withdrawn from exchanges to private wallets, suggesting reduced selling pressure.',
    confidence: 78,
    lastOccurrence: Date.now() - 2 * 24 * 60 * 60 * 1000,
    priceImpact: '+3-6% within 7 days',
    recommendation: 'Bullish signal suggesting reduced selling pressure. Consider increasing position size.'
  },
  {
    pattern: 'Bitcoin Distribution to Exchanges',
    description: 'Several large wallets have moved significant BTC to exchanges in the past 48 hours.',
    confidence: 67,
    lastOccurrence: Date.now() - 1 * 24 * 60 * 60 * 1000,
    priceImpact: '-4-7% within 5 days',
    recommendation: 'Consider taking some profits or setting tighter stop losses to protect against potential downside.'
  }
];
