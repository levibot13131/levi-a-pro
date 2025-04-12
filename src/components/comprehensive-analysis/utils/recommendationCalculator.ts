
export const calculateOverallRecommendation = (
  technicalAnalysis: any,
  wyckoffPatterns: any,
  smcPatterns: any,
  whaleMovements: any,
  newsItems: any
): { signal: 'buy' | 'sell' | 'neutral'; strength: number; reasoning: string[] } => {
  if (!technicalAnalysis || !wyckoffPatterns || !smcPatterns || !whaleMovements) {
    return { signal: 'neutral', strength: 5, reasoning: ['נתונים חסרים או לא מספקים'] };
  }
  
  const reasoning: string[] = [];
  let buyPoints = 0;
  let sellPoints = 0;
  
  // Technical indicators
  if (technicalAnalysis.overallSignal === 'buy') {
    buyPoints += technicalAnalysis.signalStrength / 2;
    reasoning.push(`אינדיקטורים טכניים מראים סימני קנייה (${technicalAnalysis.signalStrength}/10)`);
  } else if (technicalAnalysis.overallSignal === 'sell') {
    sellPoints += technicalAnalysis.signalStrength / 2;
    reasoning.push(`אינדיקטורים טכניים מראים סימני מכירה (${technicalAnalysis.signalStrength}/10)`);
  }
  
  // Wyckoff Analysis
  if (wyckoffPatterns && wyckoffPatterns.length > 0) {
    const latestPattern = wyckoffPatterns[0];
    if (latestPattern.type.includes('accumulation')) {
      buyPoints += 2;
      reasoning.push(`תבנית Wyckoff מראה צבירה (${latestPattern.strength}/10)`);
    } else if (latestPattern.type.includes('distribution')) {
      sellPoints += 2;
      reasoning.push(`תבנית Wyckoff מראה הפצה (${latestPattern.strength}/10)`);
    }
  }
  
  // SMC Patterns
  if (smcPatterns && smcPatterns.length > 0) {
    const bullishPatterns = smcPatterns.filter(p => p.direction === 'bullish').length;
    const bearishPatterns = smcPatterns.filter(p => p.direction === 'bearish').length;
    
    if (bullishPatterns > bearishPatterns) {
      buyPoints += 1.5;
      reasoning.push(`זוהו ${bullishPatterns} תבניות SMC חיוביות`);
    } else if (bearishPatterns > bullishPatterns) {
      sellPoints += 1.5;
      reasoning.push(`זוהו ${bearishPatterns} תבניות SMC שליליות`);
    }
  }
  
  // Whale Movements
  if (whaleMovements) {
    if (whaleMovements.netInflowOutflow > 0) {
      buyPoints += 1.5;
      reasoning.push(`תנועות לוויתן חיוביות, זרימת הון נטו: ${whaleMovements.netInflowOutflow.toFixed(2)}%`);
    } else if (whaleMovements.netInflowOutflow < 0) {
      sellPoints += 1.5;
      reasoning.push(`תנועות לוויתן שליליות, זרימת הון נטו: ${whaleMovements.netInflowOutflow.toFixed(2)}%`);
    }
  }
  
  // News Sentiment
  if (newsItems && newsItems.length > 0) {
    const sentiment = newsItems.reduce((acc, item) => acc + item.sentiment, 0) / newsItems.length;
    
    if (sentiment > 0.6) {
      buyPoints += 1;
      reasoning.push(`סנטימנט חדשותי חיובי (${(sentiment * 10).toFixed(1)}/10)`);
    } else if (sentiment < 0.4) {
      sellPoints += 1;
      reasoning.push(`סנטימנט חדשותי שלילי (${(sentiment * 10).toFixed(1)}/10)`);
    }
  }
  
  // Calculate final signal and strength
  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 5;
  
  if (buyPoints > sellPoints && buyPoints > 2) {
    signal = 'buy';
    strength = Math.min(Math.round(buyPoints), 10);
    reasoning.unshift(`איתות קנייה עם עוצמה של ${strength}/10`);
  } else if (sellPoints > buyPoints && sellPoints > 2) {
    signal = 'sell';
    strength = Math.min(Math.round(sellPoints), 10);
    reasoning.unshift(`איתות מכירה עם עוצמה של ${strength}/10`);
  } else {
    reasoning.unshift('אין איתות ברור, המלצה ניטרלית');
  }
  
  return { signal, strength, reasoning };
};
