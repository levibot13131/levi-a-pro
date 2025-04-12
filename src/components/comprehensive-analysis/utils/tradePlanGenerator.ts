
export const generateTradePlan = (
  selectedAsset: any,
  technicalAnalysis: any,
  smcPatterns: any,
  assetHistory: any,
  userStrategy: any
) => {
  if (!selectedAsset || !technicalAnalysis || !smcPatterns || !assetHistory) {
    return null;
  }
  
  // Extract the current price
  const currentPrice = assetHistory?.data?.[assetHistory.data.length - 1]?.price || 0;
  
  // Get key levels from technical analysis
  const keyLevels = technicalAnalysis.keyLevels || [];
  
  // Determine action based on technical analysis signal
  let action = 'המתנה'; // Default: Wait
  let reason = 'אין תנאים מספיקים לכניסה לעסקה';
  let actionable = false;
  
  if (technicalAnalysis.overallSignal === 'buy' && technicalAnalysis.signalStrength >= 7) {
    action = 'קנייה';
    reason = `זוהו ${technicalAnalysis.overallSignal === 'buy' ? 'תנאי קנייה' : 'תנאי מכירה'} חזקים עם עוצמת סיגנל ${technicalAnalysis.signalStrength}/10`;
    actionable = true;
  } else if (technicalAnalysis.overallSignal === 'sell' && technicalAnalysis.signalStrength >= 7) {
    action = 'מכירה';
    reason = `זוהו תנאי מכירה חזקים עם עוצמת סיגנל ${technicalAnalysis.signalStrength}/10`;
    actionable = true;
  }
  
  // Create trade levels based on action type
  const tradeLevels = [];
  
  if (actionable) {
    // Find nearby support and resistance levels
    const supports = keyLevels.filter((level: any) => level.type === 'support' && level.price < currentPrice)
      .sort((a: any, b: any) => b.price - a.price);
    
    const resistances = keyLevels.filter((level: any) => level.type === 'resistance' && level.price > currentPrice)
      .sort((a: any, b: any) => a.price - b.price);
    
    // Entry price (current price)
    tradeLevels.push({
      name: 'כניסה',
      price: currentPrice,
      type: 'entry'
    });
    
    // Stop Loss
    if (action === 'קנייה' && supports.length > 0) {
      // Place stop below nearest support
      tradeLevels.push({
        name: 'סטופ לוס',
        price: supports[0].price * 0.98, // 2% below support
        type: 'stop'
      });
    } else if (action === 'מכירה' && resistances.length > 0) {
      // Place stop above nearest resistance
      tradeLevels.push({
        name: 'סטופ לוס',
        price: resistances[0].price * 1.02, // 2% above resistance
        type: 'stop'
      });
    }
    
    // Target price(s)
    if (action === 'קנייה' && resistances.length > 0) {
      // First target at nearest resistance
      tradeLevels.push({
        name: 'יעד ראשון',
        price: resistances[0].price,
        type: 'target'
      });
      
      // Second target if available
      if (resistances.length > 1) {
        tradeLevels.push({
          name: 'יעד שני',
          price: resistances[1].price,
          type: 'target'
        });
      }
    } else if (action === 'מכירה' && supports.length > 0) {
      // First target at nearest support
      tradeLevels.push({
        name: 'יעד ראשון',
        price: supports[0].price,
        type: 'target'
      });
      
      // Second target if available
      if (supports.length > 1) {
        tradeLevels.push({
          name: 'יעד שני',
          price: supports[1].price,
          type: 'target'
        });
      }
    }
  }
  
  // Calculate position size based on user risk rules
  const riskPercent = 1; // Default 1% risk per trade
  let positionSize = '1% מהתיק';
  
  if (actionable && tradeLevels.length >= 2) {
    const entryLevel = tradeLevels.find((level: any) => level.type === 'entry');
    const stopLevel = tradeLevels.find((level: any) => level.type === 'stop');
    
    if (entryLevel && stopLevel) {
      const riskPercent = Math.abs((stopLevel.price - entryLevel.price) / entryLevel.price) * 100;
      if (riskPercent > 0) {
        positionSize = `${(1 / riskPercent).toFixed(2)}% מהתיק`;
      }
    }
  }
  
  return {
    action,
    reason,
    actionable,
    levels: tradeLevels,
    positionSize,
    asset: selectedAsset.id,
    price: currentPrice
  };
};
