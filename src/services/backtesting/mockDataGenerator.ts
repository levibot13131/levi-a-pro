
import { BacktestSettings, Trade } from './types';
import { getAssetById } from '../realTimeAssetService';

// Generate mock trades and equity curve for backtesting
export const generateMockBacktestData = (settings: BacktestSettings) => {
  const startTime = new Date(settings.startDate).getTime();
  const endTime = new Date(settings.endDate).getTime();
  
  // Generate mock trades
  const mockTrades: Trade[] = [];
  const mockEquity: {date: string; value: number; drawdown: number}[] = [];
  const mockPriceData: {date: string; open: number; high: number; low: number; close: number; volume: number}[] = [];
  
  let capital = settings.initialCapital;
  let highWaterMark = capital;
  
  // Create a date range for the backtest period
  const dateRange: Date[] = [];
  const currentDate = new Date(startTime);
  while (currentDate.getTime() <= endTime) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Get actual asset data if available to make price data more realistic
  let lastPrice = 100 + Math.random() * 20;
  const selectedAsset = settings.assetIds.length > 0 ? getAssetById(settings.assetIds[0]) : null;
  if (selectedAsset) {
    lastPrice = selectedAsset.price;
  }
  
  // Generate price data first for the entire period
  dateRange.forEach((date) => {
    // Use strategy to influence price movement trend 
    let trendBias = 0;
    if (settings.strategy === 'A.A') {
      trendBias = 0.05; // Slight upward bias for A.A strategy
    } else if (settings.strategy === 'SMC') {
      trendBias = 0.03; // Moderate upward bias for SMC
    }
    
    // Simulate price movements with some randomness but also some trend
    const dayTrend = Math.random() > (0.48 - trendBias) ? 1 : -1;
    
    // Volatility based on asset type (if available)
    let volatility = 0.01 + Math.random() * 0.015; // 1-2.5% base volatility
    if (selectedAsset) {
      // Higher volatility for crypto, lower for forex
      if (selectedAsset.type === 'crypto') {
        volatility *= 1.5; 
      } else if (selectedAsset.type === 'forex') {
        volatility *= 0.6;
      }
    }
    
    // Calculate daily price movement
    const changePercent = dayTrend * volatility;
    const open = lastPrice;
    const close = open * (1 + changePercent);
    
    // Randomize intraday high and low with realistic ranges based on asset type
    let highLowRange = Math.max(0.005, Math.random() * 0.02); // 0.5-2% range
    if (selectedAsset && selectedAsset.type === 'crypto') {
      highLowRange *= 1.5; // Crypto has wider intraday ranges
    }
    
    const high = Math.max(open, close) * (1 + highLowRange/2);
    const low = Math.min(open, close) * (1 - highLowRange/2);
    
    // Generate volume with occasional spikes
    let volumeBase = 1000000;
    if (selectedAsset) {
      volumeBase = selectedAsset.volume24h / 10; // Daily volume is roughly 1/10 of 24h volume
    }
    
    const volumeRandom = Math.random();
    const volumeSpike = volumeRandom > 0.9 ? 3 + Math.random() * 2 : 1;
    const volume = volumeBase * volumeSpike;
    
    // Add to price data array
    mockPriceData.push({
      date: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume
    });
    
    lastPrice = close;
  });
  
  // Now generate equity and trades based on the price data and strategy
  let winRate = 0.6; // Default win rate
  
  // Adjust win rate based on strategy
  if (settings.strategy === 'A.A') {
    winRate = 0.68; // A.A has higher win rate
  } else if (settings.strategy === 'SMC') {
    winRate = 0.62; // SMC has good win rate
  } else if (settings.strategy === 'Wyckoff') {
    winRate = 0.59; // Wyckoff slightly lower
  }
  
  mockPriceData.forEach((pricePoint, index) => {
    const date = new Date(pricePoint.date);
    
    // Add to equity curve daily
    // Adjust daily change based on strategy's characteristics
    let strategyFactor = 1.0;
    if (settings.strategy === 'A.A') {
      strategyFactor = 1.2; // A.A tends to have higher returns on successful trades
    } else if (settings.strategy === 'SMC') {
      strategyFactor = 1.1; // SMC has slightly higher returns
    }
    
    const dailyChange = (Math.random() * 2 - 0.9) * strategyFactor * (settings.riskPerTrade / 100) * capital;
    capital += dailyChange;
    
    // Update high water mark if new high
    if (capital > highWaterMark) {
      highWaterMark = capital;
    }
    
    // Calculate drawdown from high water mark
    const drawdown = ((highWaterMark - capital) / highWaterMark) * 100;
    
    // Add to equity curve
    mockEquity.push({
      date: date.toISOString().split('T')[0],
      value: capital,
      drawdown: drawdown
    });
    
    // Occasionally generate a trade (around 2-3 trades per week)
    // Different strategies may have different trading frequencies
    let tradeFrequency = 0.4;
    if (settings.strategy === 'A.A') {
      tradeFrequency = 0.3; // A.A has lower frequency of trades
    } else if (settings.strategy === 'Wyckoff') {
      tradeFrequency = 0.5; // Wyckoff has higher frequency
    }
    
    if (Math.random() < tradeFrequency && mockTrades.length < 50) {
      const trade = generateMockTrade(date, settings, mockTrades.length, pricePoint.close, winRate);
      mockTrades.push(trade);
    }
  });
  
  return { mockTrades, mockEquity, mockPriceData };
};

// Generate a single mock trade with more realistic behavior
const generateMockTrade = (
  date: Date, 
  settings: BacktestSettings, 
  index: number, 
  currentPrice: number,
  winRate: number
): Trade => {
  const isWin = Math.random() < winRate;
  
  // Determine direction based on strategy characteristics
  let directionBias = 0.5; // Default 50/50 split
  if (settings.strategy === 'A.A' && isWin) {
    directionBias = 0.6; // A.A tends to do better with long positions
  } else if (settings.strategy === 'SMC' && isWin) {
    directionBias = 0.55; // SMC slight long bias
  }
  
  const direction = Math.random() < directionBias ? 'long' : 'short';
  
  // Get actual asset if available
  const selectedAsset = settings.assetIds.length > 0 ? getAssetById(settings.assetIds[0]) : null;
  
  // Use actual asset price if available
  const entryPrice = selectedAsset ? selectedAsset.price * (0.95 + Math.random() * 0.1) : currentPrice;
  
  // Set stop loss and take profit based on strategy characteristics
  let stopLossPercent, takeProfitPercent;
  
  if (settings.strategy === 'A.A') {
    stopLossPercent = 0.02 + Math.random() * 0.01; // 2-3%
    takeProfitPercent = stopLossPercent * settings.riskRewardRatio;
  } else if (settings.strategy === 'SMC') {
    stopLossPercent = 0.025 + Math.random() * 0.015; // 2.5-4%
    takeProfitPercent = stopLossPercent * settings.riskRewardRatio;
  } else if (settings.strategy === 'Wyckoff') {
    stopLossPercent = 0.03 + Math.random() * 0.02; // 3-5%
    takeProfitPercent = stopLossPercent * settings.riskRewardRatio;
  } else {
    stopLossPercent = 0.02 + Math.random() * 0.03; // 2-5%
    takeProfitPercent = stopLossPercent * settings.riskRewardRatio;
  }
  
  const stopLoss = direction === 'long' 
    ? entryPrice * (1 - stopLossPercent)
    : entryPrice * (1 + stopLossPercent);
    
  const takeProfit = direction === 'long'
    ? entryPrice * (1 + takeProfitPercent)
    : entryPrice * (1 - takeProfitPercent);
  
  // Position size calculation with more realistic risk management
  const risk = (settings.riskPerTrade / 100) * settings.initialCapital;
  const positionSize = risk / Math.abs(entryPrice - stopLoss);
  
  // Calculate profit/loss
  let exitPrice, profit, profitPercentage, exitDate, status;
  if (isWin) {
    exitPrice = takeProfit;
    profit = direction === 'long' 
      ? (exitPrice - entryPrice) * positionSize
      : (entryPrice - exitPrice) * positionSize;
    status = 'target';
  } else {
    exitPrice = stopLoss;
    profit = direction === 'long'
      ? (exitPrice - entryPrice) * positionSize
      : (entryPrice - exitPrice) * positionSize;
    status = 'stopped';
  }
  profitPercentage = (profit / (settings.initialCapital)) * 100;
  
  // Exit date is 1-10 days after entry based on strategy
  let tradeDuration;
  if (settings.strategy === 'A.A') {
    tradeDuration = Math.floor(Math.random() * 7) + 1; // 1-7 days for A.A
  } else if (settings.strategy === 'SMC') {
    tradeDuration = Math.floor(Math.random() * 5) + 2; // 2-6 days for SMC
  } else {
    tradeDuration = Math.floor(Math.random() * 10) + 1; // 1-10 days
  }
  
  const exitDay = new Date(date);
  exitDay.setDate(exitDay.getDate() + tradeDuration);
  exitDate = exitDay.toISOString().split('T')[0];
  
  // Generate market condition with relationship to win/loss
  const marketConditions = ['bull', 'bear', 'sideways'];
  let marketConditionBias = isWin ? [0.6, 0.1, 0.3] : [0.3, 0.5, 0.2]; // Different probabilities based on win/loss
  
  // Adjust bias based on direction
  if (direction === 'short') {
    marketConditionBias = isWin ? [0.1, 0.7, 0.2] : [0.5, 0.2, 0.3];
  }
  
  // Select market condition based on biased random
  const randomValue = Math.random();
  let cumulativeProbability = 0;
  let selectedIndex = 0;
  
  for (let i = 0; i < marketConditionBias.length; i++) {
    cumulativeProbability += marketConditionBias[i];
    if (randomValue <= cumulativeProbability) {
      selectedIndex = i;
      break;
    }
  }
  
  const marketCondition = marketConditions[selectedIndex];
  
  // Generate random trading session with time-appropriate biases
  const tradingSessions = ['asian', 'european', 'american'];
  const hourOfDay = date.getHours();
  
  // Bias session based on hour
  let sessionBias;
  if (hourOfDay >= 0 && hourOfDay < 8) {
    sessionBias = [0.7, 0.2, 0.1]; // Asian session more likely
  } else if (hourOfDay >= 8 && hourOfDay < 16) {
    sessionBias = [0.1, 0.7, 0.2]; // European session more likely
  } else {
    sessionBias = [0.1, 0.2, 0.7]; // American session more likely
  }
  
  // Select trading session based on biased random
  const sessionRandom = Math.random();
  let cumulativeSessionProb = 0;
  let sessionIndex = 0;
  
  for (let i = 0; i < sessionBias.length; i++) {
    cumulativeSessionProb += sessionBias[i];
    if (sessionRandom <= cumulativeSessionProb) {
      sessionIndex = i;
      break;
    }
  }
  
  const tradingSession = tradingSessions[sessionIndex] as 'asian' | 'european' | 'american';
  
  // Generate more realistic entry reasons based on strategy and outcome
  let entryReason = '';
  if (settings.strategy === 'A.A') {
    if (isWin) {
      const reasons = [
        'פריצת התנגדות A.A מובהקת',
        'פריצת קו מגמה עם נר היפוך',
        'התכנסות ופריצה במבנה A.A תקין',
        'דחייה מרמת תמיכה גבוהה A.A',
        'איתות A.A בפיבונאצ׳י 0.618'
      ];
      entryReason = reasons[Math.floor(Math.random() * reasons.length)];
    } else {
      const reasons = [
        'כשל בפריצת התנגדות',
        'היפוך מגמה לא צפוי',
        'פריצה שווא במבנה A.A',
        'חדירת רמת תמיכה מובהקת',
        'אות מעורפל במבנה A.A'
      ];
      entryReason = reasons[Math.floor(Math.random() * reasons.length)];
    }
  } else if (settings.strategy === 'SMC') {
    if (isWin) {
      const reasons = [
        'איתור רמת לחץ ומבנה מחיר מובהק',
        'בלוק הצעה תקין עם מבנה היפוך',
        'מבנה מפנה SMC תקני',
        'שבירת רמת ביקוש חזקה',
        'דחייה מרמת בסיס אספקה'
      ];
      entryReason = reasons[Math.floor(Math.random() * reasons.length)];
    } else {
      const reasons = [
        'חדירת אזור הביקוש',
        'כשל בהתכנסות מחיר',
        'תגובה חלשה לבלוק היצע',
        'שווא בזיהוי רמת לחץ',
        'שינוי מגמה פתאומי'
      ];
      entryReason = reasons[Math.floor(Math.random() * reasons.length)];
    }
  } else if (settings.strategy === 'Wyckoff') {
    if (isWin) {
      const reasons = [
        'סיום אזור אקומולציה מובהק',
        'מבנה Wyckoff שלם',
        'תבנית Spring תקנית',
        'זיהוי שלב הבדיקה בפאזה C',
        'זיהוי נכון של שלב ההיפוך'
      ];
      entryReason = reasons[Math.floor(Math.random() * reasons.length)];
    } else {
      const reasons = [
        'דחייה מאזור ספרינג',
        'כשל בזיהוי שלב Wyckoff',
        'בדיקה לא תקינה של שפל קודם',
        'זיהוי שגוי של שלב האקומולציה',
        'חוסר נפח תומך בהיפוך'
      ];
      entryReason = reasons[Math.floor(Math.random() * reasons.length)];
    }
  } else {
    if (isWin) {
      entryReason = 'איתות קניה מובהק באינדיקטורים';
    } else {
      entryReason = 'סיגנל חלש או סותר';
    }
  }
  
  // Generate exit reason based on outcome
  let exitReason;
  if (status === 'target') {
    const targetReasons = [
      'הגעה למחיר יעד',
      'מימוש רווח בהתאם לתכנית',
      'השגת יחס סיכוי/סיכון מתוכנן',
      'הגעה לרמת התנגדות/תמיכה חזקה'
    ];
    exitReason = targetReasons[Math.floor(Math.random() * targetReasons.length)];
  } else {
    const stopReasons = [
      'הפעלת סטופ לוס',
      'שבירת רמת תמיכה קריטית',
      'היפוך מגמה פתאומי',
      'יציאה בהפסד מתוכנן'
    ];
    exitReason = stopReasons[Math.floor(Math.random() * stopReasons.length)];
  }

  // Get actual asset name if available
  const assetName = selectedAsset ? selectedAsset.name : ['Bitcoin', 'Ethereum', 'Apple', 'Microsoft', 'EUR/USD'][Math.floor(Math.random() * 5)];
  
  // Create the trade with more realistic data
  return {
    id: `trade-${index + 1}`,
    assetId: settings.assetIds[Math.floor(Math.random() * settings.assetIds.length)],
    assetName,
    direction,
    entryDate: date.toISOString().split('T')[0],
    entryPrice,
    stopLoss,
    takeProfit,
    positionSize,
    exitDate,
    exitPrice,
    profit,
    profitPercentage,
    status,
    duration: tradeDuration,
    maxDrawdown: Math.random() * (isWin ? 1 : 3), // Lower drawdown for winning trades
    strategyUsed: settings.strategy,
    marketCondition,
    entryReason,
    exitReason,
    tradingSession
  };
};
