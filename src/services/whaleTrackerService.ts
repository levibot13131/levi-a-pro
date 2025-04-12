
// Mock whale data service

export interface WhaleMovement {
  id: string;
  timestamp: number;
  fromAddress: string;
  toAddress: string;
  amount: number;
  transactionType: 'transfer' | 'buy' | 'sell' | 'stake' | 'unstake';
  asset: string;
  usdValue: number;
  transactionHash: string;
}

export interface WhaleBehaviorPattern {
  id: string;
  name: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  timeframe: string;
  affectedAssets: string[];
}

// Get whale movements for an asset
export const getWhaleMovements = async (assetId: string, days: number = 7): Promise<WhaleMovement[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Generate mock whale movements
  const movements: WhaleMovement[] = [];
  const now = Date.now();
  const daysInMs = days * 24 * 60 * 60 * 1000;
  
  // Base amount depends on the asset
  let baseAmount = 10;
  let baseUsdValue = 500000;
  
  if (assetId === 'bitcoin') {
    baseAmount = 10;
    baseUsdValue = 500000;
  } else if (assetId === 'ethereum') {
    baseAmount = 100;
    baseUsdValue = 300000;
  } else if (assetId === 'solana') {
    baseAmount = 5000;
    baseUsdValue = 700000;
  } else {
    baseAmount = 1000;
    baseUsdValue = 200000;
  }
  
  // Generate 5-15 random whale movements
  const count = 5 + Math.floor(Math.random() * 10);
  
  for (let i = 0; i < count; i++) {
    // Random timestamp within the specified days
    const timestamp = now - Math.random() * daysInMs;
    
    // Random transaction type with weighted distribution
    const typeRandom = Math.random();
    let transactionType: 'transfer' | 'buy' | 'sell' | 'stake' | 'unstake';
    
    if (typeRandom < 0.4) {
      transactionType = 'transfer';
    } else if (typeRandom < 0.7) {
      transactionType = Math.random() > 0.5 ? 'buy' : 'sell';
    } else {
      transactionType = Math.random() > 0.5 ? 'stake' : 'unstake';
    }
    
    // Random amount scaling
    const amountScale = 0.5 + Math.random() * 2.5;
    const amount = baseAmount * amountScale;
    const usdValue = baseUsdValue * amountScale;
    
    // Random addresses
    const fromAddress = `0x${Math.random().toString(16).substring(2, 14)}...${Math.random().toString(16).substring(2, 6)}`;
    const toAddress = `0x${Math.random().toString(16).substring(2, 14)}...${Math.random().toString(16).substring(2, 6)}`;
    
    movements.push({
      id: `movement-${i}-${Date.now()}`,
      timestamp,
      fromAddress,
      toAddress,
      amount,
      transactionType,
      asset: assetId,
      usdValue,
      transactionHash: `0x${Math.random().toString(16).substring(2, 42)}`
    });
  }
  
  // Sort by timestamp (newest first)
  return movements.sort((a, b) => b.timestamp - a.timestamp);
};

// Get whale behavior patterns
export const getWhaleBehaviorPatterns = async (assetId: string): Promise<WhaleBehaviorPattern[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Generate 1-3 behavior patterns
  const patterns: WhaleBehaviorPattern[] = [];
  const count = 1 + Math.floor(Math.random() * 3);
  
  const patternTemplates = [
    {
      name: 'אקומולציה מוסדית',
      description: 'זוהתה תבנית של צבירת מטבעות על ידי ארנקים גדולים, המתרחשת במקביל לירידות מחיר קלות. התנהגות זו מרמזת על ציפייה למגמה חיובית בטווח הבינוני.',
      impact: 'high' as const
    },
    {
      name: 'הפצה שקטה',
      description: 'נצפתה פעילות של חלוקת מטבעות ממספר ארנקים גדולים לארנקים קטנים יותר, לרוב סימן להקטנת חשיפה לקראת תיקון אפשרי.',
      impact: 'medium' as const
    },
    {
      name: 'העברות בין בורסות',
      description: 'נצפו העברות משמעותיות בין בורסות, מה שיכול להצביע על הכנות למסחר אגרסיבי או לקיחת רווחים.',
      impact: 'low' as const
    },
    {
      name: 'הסטת נזילות',
      description: 'ארנקים גדולים מעבירים נכסים מחוזים חכמים של DeFi, מה שעלול להשפיע על נזילות הפרוטוקולים.',
      impact: 'medium' as const
    },
    {
      name: 'מומנטום קנייה',
      description: 'זוהתה התכנסות של פעילות קנייה מארנקים גדולים, המעידה על אמון במחיר הנוכחי.',
      impact: 'high' as const
    }
  ];
  
  // Select random patterns
  const selectedIndices = new Set<number>();
  while (selectedIndices.size < count) {
    const index = Math.floor(Math.random() * patternTemplates.length);
    selectedIndices.add(index);
  }
  
  let i = 0;
  for (const index of selectedIndices) {
    const template = patternTemplates[index];
    const confidence = 60 + Math.floor(Math.random() * 35);
    
    patterns.push({
      id: `pattern-${i}-${Date.now()}`,
      name: template.name,
      description: template.description,
      confidence,
      impact: template.impact,
      timeframe: ['24h', '7d', '30d'][Math.floor(Math.random() * 3)],
      affectedAssets: [assetId]
    });
    
    i++;
  }
  
  return patterns;
};
