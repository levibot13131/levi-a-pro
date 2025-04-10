
import { BacktestSettings, Trade } from './types';

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
  
  // Generate price data first for the entire period
  let lastPrice = 100 + Math.random() * 20;
  dateRange.forEach((date) => {
    // Simulate price movements with some randomness but also some trend
    const dayTrend = Math.random() > 0.48 ? 1 : -1; // Slight bias towards upward movement
    const volatility = 0.01 + Math.random() * 0.015; // 1-2.5% volatility
    
    // Calculate daily price movement
    const changePercent = dayTrend * volatility;
    const open = lastPrice;
    const close = open * (1 + changePercent);
    
    // Randomize intraday high and low with sensible ranges
    const highLowRange = Math.max(0.005, Math.random() * 0.02); // 0.5-2% range
    const high = Math.max(open, close) * (1 + highLowRange/2);
    const low = Math.min(open, close) * (1 - highLowRange/2);
    
    // Generate volume with occasional spikes
    const volumeBase = 1000000;
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
  
  // Now generate equity and trades based on the price data
  mockPriceData.forEach((pricePoint, index) => {
    const date = new Date(pricePoint.date);
    
    // Add to equity curve daily
    const dailyChange = (Math.random() * 2 - 0.9) * (settings.riskPerTrade / 100) * capital;
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
    if (Math.random() < 0.4 && mockTrades.length < 50) {
      const trade = generateMockTrade(date, settings, mockTrades.length, pricePoint.close);
      mockTrades.push(trade);
    }
  });
  
  return { mockTrades, mockEquity, mockPriceData };
};

// Generate a single mock trade
const generateMockTrade = (date: Date, settings: BacktestSettings, index: number, currentPrice: number): Trade => {
  const isWin = Math.random() > 0.4; // 60% win rate
  const direction = Math.random() > 0.5 ? 'long' : 'short';
  const entryPrice = currentPrice;
  const stopLoss = direction === 'long' 
    ? entryPrice * (1 - 0.03 - Math.random() * 0.02) 
    : entryPrice * (1 + 0.03 + Math.random() * 0.02);
  const takeProfit = direction === 'long'
    ? entryPrice * (1 + settings.riskRewardRatio * 0.03)
    : entryPrice * (1 - settings.riskRewardRatio * 0.03);
  
  // Position size calculation
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
  
  // Exit date is 1-10 days after entry
  const exitDay = new Date(date);
  exitDay.setDate(exitDay.getDate() + Math.floor(Math.random() * 10) + 1);
  exitDate = exitDay.toISOString().split('T')[0];
  
  // Generate random market condition
  const marketConditions = ['bull', 'bear', 'sideways'];
  const marketCondition = marketConditions[Math.floor(Math.random() * marketConditions.length)];
  
  // Generate random trading session
  const tradingSessions = ['asian', 'european', 'american'];
  const tradingSession = tradingSessions[Math.floor(Math.random() * tradingSessions.length)] as 'asian' | 'european' | 'american';
  
  // Generate entry reason based on strategy
  let entryReason = '';
  if (settings.strategy === 'KSEM') {
    entryReason = isWin ? 'פריצת התנגדות קסם' : 'כשל בפריצת התנגדות';
  } else if (settings.strategy === 'SMC') {
    entryReason = isWin ? 'איתור רמת לחץ ומבנה מחיר' : 'חדירת אזור הביקוש';
  } else if (settings.strategy === 'Wyckoff') {
    entryReason = isWin ? 'סיום אזור אקומולציה' : 'דחייה מאזור ספרינג';
  } else {
    entryReason = isWin ? 'איתות קניה באינדיקטורים' : 'סיגנל חלש';
  }
  
  // Generate exit reason
  const exitReason = status === 'target'
    ? 'הגעה למחיר יעד'
    : 'הפעלת סטופ לוס';
  
  // Create the trade
  return {
    id: `trade-${index + 1}`,
    assetId: settings.assetIds[Math.floor(Math.random() * settings.assetIds.length)],
    assetName: ['Bitcoin', 'Ethereum', 'Apple', 'Microsoft', 'EUR/USD'][Math.floor(Math.random() * 5)],
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
    duration: Math.floor((new Date(exitDate).getTime() - date.getTime()) / (1000 * 60 * 60 * 24)),
    maxDrawdown: Math.random() * 2,
    strategyUsed: settings.strategy,
    marketCondition,
    entryReason,
    exitReason,
    tradingSession
  };
};
