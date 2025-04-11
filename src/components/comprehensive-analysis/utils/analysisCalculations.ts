
export const calculateOverallRecommendation = (
  technicalAnalysis: any,
  wyckoffPatterns: any,
  smcPatterns: any,
  whaleMovements: any,
  newsItems: any
) => {
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

export const generateTradePlan = (
  selectedAsset: any, 
  technicalAnalysis: any, 
  smcPatterns: any, 
  assetHistory: any, 
  userStrategy: any
) => {
  if (!selectedAsset || !technicalAnalysis) return null;
  
  const currentPrice = assetHistory?.data[assetHistory.data.length - 1]?.price || selectedAsset.price;
  const recommendation = calculateOverallRecommendation(
    technicalAnalysis, 
    { phase: '' }, // Placeholder for wyckoffPatterns
    smcPatterns || { patterns: [] }, 
    [], // Placeholder for whaleMovements
    [] // Placeholder for newsItems
  );
  
  if (recommendation.signal === 'neutral') {
    return {
      action: 'המתנה',
      reason: 'אין איתות חד-משמעי במצב השוק הנוכחי',
      levels: []
    };
  }
  
  // Calculate key price levels based on available analysis
  const keyLevels: Array<{ name: string; price: number; type: string }> = [];
  const isPriceNearSupportOrResistance = () => {
    // Simple implementation - in a real app this would be more sophisticated
    return Math.random() > 0.5;
  };
  
  // Include SMC levels if available
  if (smcPatterns?.patterns && smcPatterns.patterns.length > 0) {
    const relevantPatterns = smcPatterns.patterns.filter((p: any) => 
      p.bias === (recommendation.signal === 'buy' ? 'bullish' : 'bearish')
    );
    
    if (relevantPatterns.length > 0) {
      const selectedPattern = relevantPatterns[0];
      
      keyLevels.push(
        { name: 'כניסה', price: selectedPattern.entryZone.min, type: 'entry' },
        { name: 'סטופ לוס', price: selectedPattern.stopLoss || 0, type: 'stop' },
        { name: 'יעד', price: selectedPattern.targetPrice || 0, type: 'target' }
      );
    }
  } else {
    // Fallback if no SMC patterns - generate approximate levels
    if (recommendation.signal === 'buy') {
      const entryPrice = currentPrice * 0.99;
      const stopLoss = entryPrice * 0.95;
      const targetPrice = entryPrice * 1.1;
      
      keyLevels.push(
        { name: 'כניסה', price: entryPrice, type: 'entry' },
        { name: 'סטופ לוס', price: stopLoss, type: 'stop' },
        { name: 'יעד', price: targetPrice, type: 'target' }
      );
    } else {
      const entryPrice = currentPrice * 1.01;
      const stopLoss = entryPrice * 1.05;
      const targetPrice = entryPrice * 0.9;
      
      keyLevels.push(
        { name: 'כניסה', price: entryPrice, type: 'entry' },
        { name: 'סטופ לוס', price: stopLoss, type: 'stop' },
        { name: 'יעד', price: targetPrice, type: 'target' }
      );
    }
  }
  
  // Check if the current price action aligns with user's entry rules
  const meetsEntryRules = () => {
    let rulesMet = 0;
    
    // Rule: Multiple indicators alignment
    if (technicalAnalysis) {
      const buySignals = technicalAnalysis.indicators.filter((i: any) => i.signal === 'buy').length;
      const sellSignals = technicalAnalysis.indicators.filter((i: any) => i.signal === 'sell').length;
      
      if ((recommendation.signal === 'buy' && buySignals >= 3) || 
          (recommendation.signal === 'sell' && sellSignals >= 3)) {
        rulesMet += 1;
      }
    }
    
    // Rule: Price near support/resistance
    if (isPriceNearSupportOrResistance()) {
      rulesMet += 1;
    }
    
    // Rule: Pattern recognition
    if ((smcPatterns?.patterns && smcPatterns.patterns.length > 0)) {
      rulesMet += 1;
    }
    
    // 3 or more rules met
    return rulesMet >= 2;
  };
  
  const entryCriteriaMet = meetsEntryRules();
  
  return {
    action: recommendation.signal === 'buy' ? 'קנייה' : 'מכירה',
    reason: entryCriteriaMet ? 
      `האנליזה המשולבת מצביעה על עסקת ${recommendation.signal === 'buy' ? 'קנייה' : 'מכירה'} פוטנציאלית העומדת בקריטריוני הכניסה` : 
      `המתנה לתנאי כניסה אופטימליים יותר`,
    actionable: entryCriteriaMet,
    levels: keyLevels,
    positionSize: entryCriteriaMet ? `1% מהתיק, יחס סיכוי:סיכון כ-${(keyLevels[2]?.price && keyLevels[1]?.price) ? 
      Math.abs((keyLevels[2].price - keyLevels[0].price) / (keyLevels[1].price - keyLevels[0].price)).toFixed(1) : '?'}` : '',
    riskManagement: userStrategy.riskRules
  };
};
