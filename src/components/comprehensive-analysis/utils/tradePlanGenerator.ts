
import { calculateOverallRecommendation } from './recommendationCalculator';

export const generateTradePlan = (
  selectedAsset: any, 
  technicalAnalysis: any, 
  smcPatterns: any, 
  assetHistory: any, 
  userStrategy: any
): { 
  action: string;
  reason: string;
  actionable?: boolean;
  levels?: Array<{ name: string; price: number; type: string }>;
  positionSize?: string;
  riskManagement?: string[];
} => {
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
