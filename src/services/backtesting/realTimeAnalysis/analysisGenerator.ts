
import { Asset, TradeSignal } from '@/types/asset';
import { getStoredSignals } from './signalStorage';

/**
 * Generate analysis from stored trading signals
 * @returns Analysis summary
 */
export const generateSignalAnalysis = (assetId?: string) => {
  const signals = getStoredSignals();
  const relevantSignals = assetId ? signals.filter(s => s.assetId === assetId) : signals;
  
  if (!relevantSignals.length) {
    return {
      totalSignals: 0,
      buySignals: 0,
      sellSignals: 0,
      strongSignals: 0,
      recentSignals: 0,
      summary: "אין מספיק איתותים לניתוח",
      recommendation: "המתן לאיתותים נוספים"
    };
  }
  
  // Count different signal types
  const buySignals = relevantSignals.filter(s => s.type === 'buy').length;
  const sellSignals = relevantSignals.filter(s => s.type === 'sell').length;
  const strongSignals = relevantSignals.filter(s => s.strength === 'strong').length;
  
  // Count recent signals (last 24 hours)
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const recentSignals = relevantSignals.filter(s => s.timestamp > oneDayAgo).length;
  
  // Get most common strategy
  const strategies = relevantSignals.map(s => s.strategy);
  const strategyCount: Record<string, number> = {};
  strategies.forEach(s => {
    strategyCount[s] = (strategyCount[s] || 0) + 1;
  });
  const mostCommonStrategy = Object.entries(strategyCount)
    .sort((a, b) => b[1] - a[1])
    .map(entry => entry[0])[0];
  
  // Calculate buy/sell ratio
  const buyToSellRatio = sellSignals > 0 ? buySignals / sellSignals : buySignals;
  
  // Generate summary
  let summary = '';
  let recommendation = '';
  
  if (buySignals > sellSignals * 2) {
    summary = "מגמה חיובית מובהקת עם עודף איתותי קנייה";
    recommendation = "שקול פוזיציות קנייה עם ניהול סיכונים הולם";
  } else if (sellSignals > buySignals * 2) {
    summary = "מגמה שלילית מובהקת עם עודף איתותי מכירה";
    recommendation = "שקול פוזיציות מכירה או יציאה מפוזיציות קיימות";
  } else if (buySignals > sellSignals) {
    summary = "נטייה חיובית קלה עם יותר איתותי קנייה מאשר מכירה";
    recommendation = "המתן לאישור נוסף לפני הכניסה לעסקאות";
  } else if (sellSignals > buySignals) {
    summary = "נטייה שלילית קלה עם יותר איתותי מכירה מאשר קנייה";
    recommendation = "נקוט משנה זהירות בפוזיציות קנייה";
  } else {
    summary = "שיווי משקל בין איתותי קנייה ומכירה";
    recommendation = "המתן להתבהרות המגמה";
  }
  
  // Add strength analysis
  if (strongSignals > relevantSignals.length * 0.6) {
    summary += "; רוב האיתותים חזקים, מה שמעיד על בהירות בתנאי השוק";
  } else if (strongSignals < relevantSignals.length * 0.3) {
    summary += "; רוב האיתותים חלשים, מה שמעיד על חוסר ודאות בשוק";
  }
  
  return {
    totalSignals: relevantSignals.length,
    buySignals,
    sellSignals,
    strongSignals,
    recentSignals,
    buyToSellRatio: buyToSellRatio.toFixed(2),
    mostCommonStrategy,
    summary,
    recommendation
  };
};
