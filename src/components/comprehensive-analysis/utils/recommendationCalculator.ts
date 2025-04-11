
export const calculateOverallRecommendation = (
  technicalAnalysis: any,
  wyckoffPatterns: any,
  smcPatterns: any,
  whaleMovements: any,
  newsItems: any
): { signal: 'buy' | 'sell' | 'neutral'; strength: number; reasoning: string[] } => {
  if (!technicalAnalysis || !wyckoffPatterns || !smcPatterns || !whaleMovements) {
    return { signal: 'neutral', strength: 5, reasoning: [] };
  }
  
  const reasoning: string[] = [];
  let buyPoints = 0;
  let sellPoints = 0;
  
  // Technical indicators
  if (technicalAnalysis.overallSignal === 'buy') {
    buyPoints += technicalAnalysis.signalStrength / 2;
    reasoning.push(`אינדיקטורים טכניים מראים סיגנל קנייה (${technicalAnalysis.signalStrength}/10)`);
  } else if (technicalAnalysis.overallSignal === 'sell') {
    sellPoints += technicalAnalysis.signalStrength / 2;
    reasoning.push(`אינדיקטורים טכניים מראים סיגנל מכירה (${technicalAnalysis.signalStrength}/10)`);
  }
  
  // Wyckoff analysis
  if (wyckoffPatterns.phase) {
    if (wyckoffPatterns.phase.includes('אקומולציה')) {
      buyPoints += 3;
      reasoning.push(`ניתוח וויקוף מזהה שלב אקומולציה - חיובי לטווח הבינוני`);
    } else if (wyckoffPatterns.phase.includes('דיסטריביושן')) {
      sellPoints += 3;
      reasoning.push(`ניתוח וויקוף מזהה שלב הפצה - שלילי לטווח הבינוני`);
    }
  }
  
  // SMC patterns
  if (smcPatterns.patterns && smcPatterns.patterns.length > 0) {
    const bullishPatterns = smcPatterns.patterns.filter((p: any) => p.bias === 'bullish').length;
    const bearishPatterns = smcPatterns.patterns.filter((p: any) => p.bias === 'bearish').length;
    
    if (bullishPatterns > bearishPatterns) {
      buyPoints += 2;
      reasoning.push(`זיהוי ${bullishPatterns} תבניות SMC חיוביות`);
    } else if (bearishPatterns > bullishPatterns) {
      sellPoints += 2;
      reasoning.push(`זיהוי ${bearishPatterns} תבניות SMC שליליות`);
    }
  }
  
  // Whale movements
  if (whaleMovements && whaleMovements.length > 0) {
    const recentMovements = whaleMovements.filter((m: any) => m.timestamp > Date.now() - 86400000 * 2); // Last 2 days
    const buyVolume = recentMovements
      .filter((m: any) => m.transactionType === 'buy')
      .reduce((total: number, m: any) => total + m.amount, 0);
    const sellVolume = recentMovements
      .filter((m: any) => m.transactionType === 'sell')
      .reduce((total: number, m: any) => total + m.amount, 0);
    
    if (buyVolume > sellVolume * 1.5) {
      buyPoints += 2;
      reasoning.push(`תנועות ארנקים גדולים: קניות משמעותיות ב-48 שעות האחרונות`);
    } else if (sellVolume > buyVolume * 1.5) {
      sellPoints += 2;
      reasoning.push(`תנועות ארנקים גדולים: מכירות משמעותיות ב-48 שעות האחרונות`);
    }
  }
  
  // News sentiment
  if (newsItems && newsItems.length > 0) {
    const positiveNews = newsItems.filter((n: any) => n.sentiment === 'positive').length;
    const negativeNews = newsItems.filter((n: any) => n.sentiment === 'negative').length;
    
    if (positiveNews > negativeNews) {
      buyPoints += 1;
      reasoning.push(`סנטימנט חדשות חיובי`);
    } else if (negativeNews > positiveNews) {
      sellPoints += 1;
      reasoning.push(`סנטימנט חדשות שלילי`);
    }
  }
  
  // Calculate final signal
  const totalPoints = buyPoints + sellPoints;
  let signal: 'buy' | 'sell' | 'neutral';
  let strength: number;
  
  if (buyPoints > sellPoints + 2) {
    signal = 'buy';
    strength = Math.min(10, Math.round((buyPoints / totalPoints) * 10));
  } else if (sellPoints > buyPoints + 2) {
    signal = 'sell';
    strength = Math.min(10, Math.round((sellPoints / totalPoints) * 10));
  } else {
    signal = 'neutral';
    strength = 5;
    reasoning.push('איזון בין סימני קנייה ומכירה, אין איתות חד משמעי');
  }
  
  return { signal, strength, reasoning };
};
