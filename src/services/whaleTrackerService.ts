
import { WhaleMovement, WhaleBehaviorPattern } from '@/hooks/use-market-news';

// Get whale movements for a specific asset
export const getWhaleMovements = async (assetId: string, days: number = 7): Promise<WhaleMovement[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate mock whale movements based on asset ID and days
  const movements: WhaleMovement[] = [];
  
  // Number of movements to generate
  const count = Math.min(10, Math.max(3, days));
  
  for (let i = 0; i < count; i++) {
    // Random transaction type
    const transactionTypes = ['exchange_deposit', 'exchange_withdrawal', 'wallet_transfer'] as const;
    const transactionType = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
    
    // Random amount based on asset
    let amount = 0;
    if (assetId === 'bitcoin') {
      amount = 100 + Math.random() * 900;
    } else if (assetId === 'ethereum') {
      amount = 500 + Math.random() * 4500;
    } else {
      amount = 1000 + Math.random() * 9000;
    }
    
    // Random timestamp within the specified days
    const timestamp = new Date(
      Date.now() - Math.random() * days * 24 * 60 * 60 * 1000
    ).toISOString();
    
    // Random exchanges
    const exchanges = ['Binance', 'Coinbase', 'Kraken', 'FTX', 'Huobi'];
    const exchange = exchanges[Math.floor(Math.random() * exchanges.length)];
    
    // Create wallet address
    const walletAddress = `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`;
    
    // Determine source and destination based on transaction type
    let source = '';
    let destination = '';
    if (transactionType === 'exchange_deposit') {
      source = 'Unknown Wallet';
      destination = exchange;
    } else if (transactionType === 'exchange_withdrawal') {
      source = exchange;
      destination = 'Unknown Wallet';
    } else {
      source = `Wallet ${Math.floor(Math.random() * 100)}`;
      destination = `Wallet ${Math.floor(Math.random() * 100)}`;
    }
    
    // Random significance
    const significances = ['very-high', 'high', 'medium', 'low'] as const;
    const significance = significances[Math.floor(Math.random() * significances.length)];
    
    // Random price impact based on significance
    let priceImpact = 0;
    if (significance === 'very-high') priceImpact = 3 + Math.random() * 2;
    else if (significance === 'high') priceImpact = 1.5 + Math.random() * 1.5;
    else if (significance === 'medium') priceImpact = 0.5 + Math.random() * 1;
    else priceImpact = Math.random() * 0.5;
    
    movements.push({
      id: `${assetId}-${i}`,
      assetId,
      amount,
      fromAddress: source.toLowerCase().includes('wallet') ? walletAddress : `${source.toLowerCase()}_wallet`,
      toAddress: destination.toLowerCase().includes('wallet') ? walletAddress : `${destination.toLowerCase()}_wallet`,
      timestamp,
      transactionType,
      exchangeName: exchange,
      walletAddress,
      walletLabel: Math.random() > 0.7 ? `Whale Wallet #${i+1}` : undefined,
      source,
      destination,
      impact: { 
        significance, 
        priceImpact
      }
    });
  }
  
  // Sort by timestamp (newest first)
  return movements.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

// Get whale behavior patterns for a specific asset
export const getWhaleBehaviorPatterns = async (assetId: string): Promise<WhaleBehaviorPattern[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Common patterns
  const commonPatterns: WhaleBehaviorPattern[] = [
    {
      pattern: 'Accumulation Pattern',
      description: 'Major holders are accumulating this asset quietly',
      confidence: 75,
      lastOccurrence: Date.now() - 172800000, // 2 days ago
      priceImpact: '+3.5% expected',
      recommendation: 'Consider adding to position while price is stable'
    },
    {
      pattern: 'Distribution to Exchanges',
      description: 'Whales moving assets to exchanges - possible selling pressure',
      confidence: 68,
      lastOccurrence: Date.now() - 86400000, // 1 day ago
      priceImpact: '-2.8% expected',
      recommendation: 'Monitor closely, consider reducing exposure temporarily'
    }
  ];
  
  // Asset-specific patterns
  const specificPatterns: Record<string, WhaleBehaviorPattern[]> = {
    'bitcoin': [
      {
        pattern: 'Miner Distribution',
        description: 'Bitcoin miners are selling more than usual',
        confidence: 82,
        lastOccurrence: Date.now() - 43200000, // 12 hours ago
        priceImpact: '-4.2% expected',
        recommendation: 'Short-term bearish signal, consider hedging positions'
      }
    ],
    'ethereum': [
      {
        pattern: 'ETH 2.0 Staking Increase',
        description: 'Major holders increasing ETH 2.0 staking positions',
        confidence: 79,
        lastOccurrence: Date.now() - 129600000, // 36 hours ago
        priceImpact: '+5.1% expected',
        recommendation: 'Bullish mid-term signal as supply is locked'
      }
    ]
  };
  
  // Combine common patterns with asset-specific ones if they exist
  return [
    ...commonPatterns,
    ...(specificPatterns[assetId] || [])
  ];
};
