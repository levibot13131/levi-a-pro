
import { BacktestSettings, Trade } from './types';

// Generate mock trades and equity curve for backtesting
export const generateMockBacktestData = (settings: BacktestSettings) => {
  const startTime = new Date(settings.startDate).getTime();
  const endTime = new Date(settings.endDate).getTime();
  
  // Generate mock trades
  const mockTrades: Trade[] = [];
  const mockEquity: {date: string; value: number; drawdown: number}[] = [];
  let capital = settings.initialCapital;
  let highWaterMark = capital;
  
  // Create a date range for the backtest period
  const dateRange: Date[] = [];
  const currentDate = new Date(startTime);
  while (currentDate.getTime() <= endTime) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Generate mock equity curve and trades
  dateRange.forEach((date, index) => {
    // Add some randomness to simulate trading results
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
      const trade = generateMockTrade(date, settings, mockTrades.length);
      mockTrades.push(trade);
    }
  });
  
  return { mockTrades, mockEquity };
};

// Generate a single mock trade
const generateMockTrade = (date: Date, settings: BacktestSettings, index: number): Trade => {
  const isWin = Math.random() > 0.4; // 60% win rate
  const direction = Math.random() > 0.5 ? 'long' : 'short';
  const entryPrice = 100 + Math.random() * 20;
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
    strategyUsed: settings.strategy
  };
};
