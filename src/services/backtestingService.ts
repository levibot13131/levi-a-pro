
import { Asset, PricePoint, TradeSignal } from "@/types/asset";
import { PositionSizingCalculation } from "@/services/customTradingStrategyService";

export interface BacktestSettings {
  initialCapital: number; // Make this required
  riskPerTrade: number;
  strategy: 'KSEM' | 'SMC' | 'Wyckoff' | 'Custom';
  entryType: 'market' | 'limit';
  stopLossType: 'fixed' | 'atr' | 'support';
  takeProfitType: 'fixed' | 'resistance' | 'riskReward';
  riskRewardRatio: number;
  timeframe: string;
  startDate: string;
  endDate: string;
  trailingStop: boolean;
  maxOpenTrades: number;
  assetIds: string[];
}

export interface Trade {
  id: string;
  assetId: string;
  assetName: string;
  direction: 'long' | 'short';
  entryDate: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  positionSize: number;
  exitDate?: string;
  exitPrice?: number;
  profit?: number;
  profitPercentage?: number;
  status: 'open' | 'closed' | 'stopped' | 'target';
  duration?: number; // in days
  maxDrawdown?: number;
  strategyUsed: string;
  signalId?: string;
}

export interface BacktestResults {
  trades: Trade[];
  performance: {
    totalReturn: number;
    totalReturnPercentage: number;
    winRate: number;
    averageWin: number;
    averageLoss: number;
    largestWin: number;
    largestLoss: number;
    profitFactor: number;
    maxDrawdown: number;
    sharpeRatio: number;
    totalTrades: number;
    winningTrades: number;
    losingTrades: number;
    averageTradeDuration: number;
  };
  equity: {
    date: string;
    value: number;
    drawdown: number;
  }[];
  monthly: {
    period: string;
    return: number;
    trades: number;
  }[];
  assetPerformance: {
    assetId: string;
    assetName: string;
    return: number;
    trades: number;
    winRate: number;
  }[];
}

// Run a backtest with the given settings
export const runBacktest = async (
  settings: BacktestSettings
): Promise<BacktestResults> => {
  // Fetch historical data for each asset in the settings
  const startTime = new Date(settings.startDate).getTime();
  const endTime = new Date(settings.endDate).getTime();
  
  // This is a mock implementation - in a real system, you would:
  // 1. Fetch actual historical data for each asset
  // 2. Generate signals based on your strategy rules
  // 3. Execute trades based on those signals and settings
  // 4. Calculate performance metrics
  
  // Simulate waiting for calculation
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Generate mock trades
  const mockTrades: Trade[] = [];
  const mockEquity: {date: string; value: number; drawdown: number}[] = [];
  let capital = settings.initialCapital;
  let highWaterMark = capital;
  let lowWaterMark = capital;
  
  // Create a date range for the backtest period
  const dateRange: Date[] = [];
  const currentDate = new Date(startTime);
  while (currentDate.getTime() <= endTime) {
    dateRange.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Generate mock equity curve
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
      const trade: Trade = {
        id: `trade-${mockTrades.length + 1}`,
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
      
      mockTrades.push(trade);
    }
  });
  
  // Calculate performance metrics
  const winningTrades = mockTrades.filter(t => (t.profit || 0) > 0);
  const losingTrades = mockTrades.filter(t => (t.profit || 0) <= 0);
  
  const totalReturn = mockTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  const totalReturnPercentage = (totalReturn / settings.initialCapital) * 100;
  const winRate = (winningTrades.length / mockTrades.length) * 100;
  
  const averageWin = winningTrades.length
    ? winningTrades.reduce((sum, trade) => sum + (trade.profitPercentage || 0), 0) / winningTrades.length
    : 0;
    
  const averageLoss = losingTrades.length
    ? losingTrades.reduce((sum, trade) => sum + (trade.profitPercentage || 0), 0) / losingTrades.length
    : 0;
    
  const largestWin = winningTrades.length
    ? Math.max(...winningTrades.map(trade => trade.profitPercentage || 0))
    : 0;
    
  const largestLoss = losingTrades.length
    ? Math.min(...losingTrades.map(trade => trade.profitPercentage || 0))
    : 0;
    
  const profitFactor = Math.abs(averageLoss) > 0
    ? Math.abs(averageWin / averageLoss)
    : Infinity;
  
  // Calculate max drawdown from equity curve
  const maxDrawdown = mockEquity.length
    ? Math.max(...mockEquity.map(point => point.drawdown))
    : 0;
  
  // Calculate Sharpe ratio (simplified)
  const returns = mockEquity.map((point, index, array) => {
    if (index === 0) return 0;
    return (point.value - array[index - 1].value) / array[index - 1].value;
  });
  
  const averageReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
  const stdDeviation = Math.sqrt(
    returns.reduce((sum, ret) => sum + Math.pow(ret - averageReturn, 2), 0) / returns.length
  );
  
  const sharpeRatio = stdDeviation > 0 ? (averageReturn / stdDeviation) * Math.sqrt(252) : 0;
  
  // Generate monthly performance data
  const monthlyMap = new Map<string, {return: number, trades: number}>();
  mockTrades.forEach(trade => {
    const month = trade.entryDate.substring(0, 7); // YYYY-MM
    const existingData = monthlyMap.get(month) || {return: 0, trades: 0};
    monthlyMap.set(month, {
      return: existingData.return + (trade.profitPercentage || 0),
      trades: existingData.trades + 1
    });
  });
  
  const monthly = Array.from(monthlyMap.entries()).map(([period, data]) => ({
    period,
    return: data.return,
    trades: data.trades
  }));
  
  // Generate asset performance data
  const assetMap = new Map<string, {
    assetName: string,
    return: number,
    trades: number,
    wins: number
  }>();
  
  mockTrades.forEach(trade => {
    const existingData = assetMap.get(trade.assetId) || {
      assetName: trade.assetName,
      return: 0,
      trades: 0,
      wins: 0
    };
    
    assetMap.set(trade.assetId, {
      assetName: trade.assetName,
      return: existingData.return + (trade.profitPercentage || 0),
      trades: existingData.trades + 1,
      wins: existingData.wins + ((trade.profit || 0) > 0 ? 1 : 0)
    });
  });
  
  const assetPerformance = Array.from(assetMap.entries()).map(([assetId, data]) => ({
    assetId,
    assetName: data.assetName,
    return: data.return,
    trades: data.trades,
    winRate: (data.wins / data.trades) * 100
  }));
  
  // Return the results
  return {
    trades: mockTrades,
    performance: {
      totalReturn,
      totalReturnPercentage,
      winRate,
      averageWin,
      averageLoss,
      largestWin,
      largestLoss,
      profitFactor,
      maxDrawdown,
      sharpeRatio,
      totalTrades: mockTrades.length,
      winningTrades: winningTrades.length,
      losingTrades: losingTrades.length,
      averageTradeDuration: mockTrades.reduce((sum, trade) => sum + (trade.duration || 0), 0) / mockTrades.length
    },
    equity: mockEquity,
    monthly,
    assetPerformance
  };
};

// Helper function to generate signals from historical data
export const generateSignalsFromHistory = (
  priceData: PricePoint[],
  strategy: string
): TradeSignal[] => {
  // In a real implementation, this would apply your trading strategy rules
  // to historical data and generate entry/exit signals
  
  const signals: TradeSignal[] = [];
  
  // Simple example: Generate a signal when price increases by 5% in 3 bars
  for (let i = 3; i < priceData.length; i++) {
    const priceChange = (priceData[i].price - priceData[i - 3].price) / priceData[i - 3].price;
    
    if (priceChange > 0.05) {
      signals.push({
        id: `signal-${i}`,
        assetId: 'mock-asset',
        type: 'buy',
        price: priceData[i].price,
        timestamp: priceData[i].timestamp,
        strength: Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak',
        strategy: strategy,
        timeframe: '1d',
        targetPrice: priceData[i].price * 1.1,
        stopLoss: priceData[i].price * 0.95,
        riskRewardRatio: 2.0,
        notes: 'מחיר עלה ב-5% תוך 3 נרות'
      });
    } else if (priceChange < -0.05) {
      signals.push({
        id: `signal-${i}`,
        assetId: 'mock-asset',
        type: 'sell',
        price: priceData[i].price,
        timestamp: priceData[i].timestamp,
        strength: Math.random() > 0.7 ? 'strong' : Math.random() > 0.4 ? 'medium' : 'weak',
        strategy: strategy,
        timeframe: '1d',
        targetPrice: priceData[i].price * 0.9,
        stopLoss: priceData[i].price * 1.05,
        riskRewardRatio: 2.0,
        notes: 'מחיר ירד ב-5% תוך 3 נרות'
      });
    }
  }
  
  return signals;
};

// Helper function to calculate optimal position size
export const calculateOptimalPosition = (
  capital: number,
  riskPercent: number,
  entryPrice: number,
  stopLossPrice: number
): PositionSizingCalculation => {
  const riskAmount = capital * (riskPercent / 100);
  const priceDiff = Math.abs(entryPrice - stopLossPrice);
  const positionSize = riskAmount / priceDiff;
  
  return {
    accountSize: capital,
    riskPercentage: riskPercent,
    entryPrice,
    stopLossPrice,
    positionSize,
    maxLossAmount: riskAmount,
    riskRewardRatio: 0, // This would be calculated based on target price
  };
};
