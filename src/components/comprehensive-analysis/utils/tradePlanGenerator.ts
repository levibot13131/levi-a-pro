
interface TradePlan {
  entryPrice: number | null;
  stopLoss: number | null;
  takeProfit: number | null;
  riskRewardRatio: number | null;
  positionSize: number | null;
  maxRisk: string | null;
  direction: 'long' | 'short' | null;
  timeframe: string | null;
  description: string[];
  keyLevels: { price: number; type: string; description: string }[];
}

export const generateTradePlan = (
  currentPrice: number,
  technicalAnalysis: any,
  patterns: any,
  historicalData: any,
  supportResistanceLevels: any[],
  userSettings: any = {}
): TradePlan => {
  // Default empty plan
  const emptyPlan: TradePlan = {
    entryPrice: null,
    stopLoss: null,
    takeProfit: null,
    riskRewardRatio: null,
    positionSize: null,
    maxRisk: null,
    direction: null,
    timeframe: null,
    description: ['לא ניתן לייצר תוכנית מסחר עם הנתונים הקיימים'],
    keyLevels: []
  };

  // Check if we have sufficient data to generate a plan
  if (!currentPrice || !technicalAnalysis || !patterns || !supportResistanceLevels) {
    return emptyPlan;
  }

  try {
    // Determine direction based on technical analysis
    const direction = technicalAnalysis.overallSignal === 'buy' ? 'long' : 
                      technicalAnalysis.overallSignal === 'sell' ? 'short' : null;
    
    if (!direction) {
      return {
        ...emptyPlan,
        description: ['אין איתות מסחר ברור, מומלץ להמתין']
      };
    }

    // Find nearest support/resistance levels
    const sortedLevels = [...supportResistanceLevels].sort((a, b) => 
      Math.abs(a.price - currentPrice) - Math.abs(b.price - currentPrice)
    );

    // Nearest support (below current price)
    const nearestSupport = supportResistanceLevels
      .filter(level => level.type === 'support' && level.price < currentPrice)
      .sort((a, b) => b.price - a.price)[0];

    // Nearest resistance (above current price)
    const nearestResistance = supportResistanceLevels
      .filter(level => level.type === 'resistance' && level.price > currentPrice)
      .sort((a, b) => a.price - b.price)[0];

    // Determine entry, stop loss and take profit based on direction and levels
    let entryPrice: number;
    let stopLoss: number;
    let takeProfit: number;
    
    if (direction === 'long') {
      // For long positions
      entryPrice = currentPrice;
      stopLoss = nearestSupport ? nearestSupport.price * 0.99 : currentPrice * 0.95;
      takeProfit = nearestResistance ? nearestResistance.price : currentPrice * 1.1;
    } else {
      // For short positions
      entryPrice = currentPrice;
      stopLoss = nearestResistance ? nearestResistance.price * 1.01 : currentPrice * 1.05;
      takeProfit = nearestSupport ? nearestSupport.price : currentPrice * 0.9;
    }

    // Calculate risk-reward ratio
    const risk = Math.abs(entryPrice - stopLoss);
    const reward = Math.abs(entryPrice - takeProfit);
    const riskRewardRatio = risk > 0 ? (reward / risk) : 0;

    // Calculate position size (assuming 2% risk per trade by default)
    const accountSize = userSettings.accountSize || 10000;
    const riskPercentage = userSettings.riskPercentage || 2;
    const maxRiskAmount = accountSize * (riskPercentage / 100);
    const positionSize = risk > 0 ? (maxRiskAmount / risk) : 0;

    // Generate description based on the plan
    const description = [
      direction === 'long' ? 'פוזיציית קנייה (Long)' : 'פוזיציית מכירה (Short)',
      `כניסה במחיר ${entryPrice.toFixed(2)}`,
      `סטופ לוס במחיר ${stopLoss.toFixed(2)} (${((Math.abs(entryPrice - stopLoss) / entryPrice) * 100).toFixed(2)}%)`,
      `טייק פרופיט במחיר ${takeProfit.toFixed(2)} (${((Math.abs(entryPrice - takeProfit) / entryPrice) * 100).toFixed(2)}%)`,
      `יחס סיכוי/סיכון: ${riskRewardRatio.toFixed(2)}`,
      `גודל פוזיציה מומלץ: ${positionSize.toFixed(2)} יחידות`,
      `סיכון מקסימלי: ${maxRiskAmount.toFixed(2)} (${riskPercentage}% מההון)`
    ];

    // Key price levels to watch
    const keyLevels = [
      { price: entryPrice, type: 'entry', description: 'מחיר כניסה' },
      { price: stopLoss, type: 'stop', description: 'סטופ לוס' },
      { price: takeProfit, type: 'target', description: 'טייק פרופיט' }
    ];

    // Add support/resistance levels if available
    if (nearestSupport) {
      keyLevels.push({ 
        price: nearestSupport.price, 
        type: 'support', 
        description: 'תמיכה קרובה' 
      });
    }
    
    if (nearestResistance) {
      keyLevels.push({ 
        price: nearestResistance.price, 
        type: 'resistance', 
        description: 'התנגדות קרובה' 
      });
    }

    // Determine timeframe based on patterns or user settings
    const timeframe = userSettings.timeframe || '1d';

    return {
      entryPrice,
      stopLoss,
      takeProfit,
      riskRewardRatio,
      positionSize,
      maxRisk: `${maxRiskAmount.toFixed(2)} (${riskPercentage}%)`,
      direction: direction as 'long' | 'short',
      timeframe,
      description,
      keyLevels
    };
  } catch (error) {
    console.error('Error generating trade plan:', error);
    return {
      ...emptyPlan,
      description: ['שגיאה בייצור תוכנית מסחר', 'נא לנסות שוב מאוחר יותר']
    };
  }
};
