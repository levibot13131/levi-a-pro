
import { v4 as uuidv4 } from 'uuid';
import { BacktestSettings, BacktestResult, BacktestTrade, EquityPoint, MonthlyPerformance, AssetPerformance } from './types';
import { generateHistoricalData } from './mockDataGenerator';
import { format } from 'date-fns';

// Run backtest with the given settings
export const runBacktest = async (settings: BacktestSettings): Promise<BacktestResult> => {
  try {
    // Extract settings
    const { 
      assetIds = ['bitcoin'], 
      startDate, 
      endDate, 
      timeframe, 
      initialCapital, 
      strategy,
      takeProfit,
      stopLoss,
      riskPerTrade,
      compounding,
      tradeSize,
      leverage
    } = settings;
    
    // Generate historical data for the given assets
    const assetData = await Promise.all(
      assetIds.map(async (assetId) => {
        const data = await generateHistoricalData(assetId, timeframe);
        return { assetId, data };
      })
    );
    
    // Initialize result structure
    const trades: BacktestTrade[] = [];
    const equity: EquityPoint[] = [];
    let currentCapital = initialCapital;
    let maxCapital = initialCapital;
    
    // For each asset, generate mock trades
    for (const { assetId, data } of assetData) {
      const prices = data.prices;
      let position: 'long' | 'short' | null = null;
      let entryPrice = 0;
      let entryDate = 0;
      let quantity = 0;
      
      // Loop through price data
      for (let i = 1; i < prices.length; i++) {
        const timestamp = prices[i][0];
        const price = prices[i][1];
        const prevPrice = prices[i-1][1];
        const priceChange = (price - prevPrice) / prevPrice;
        
        // Simple strategy based on price movements
        const signal = Math.random() > 0.8 ? 
          (priceChange > 0 ? 'buy' : 'sell') : null;
        
        // Mock equity point for this timestamp
        equity.push({
          date: timestamp,
          value: currentCapital,
          drawdown: ((maxCapital - currentCapital) / maxCapital) * 100
        });
        
        // If we don't have a position and get a signal
        if (!position && signal) {
          position = signal === 'buy' ? 'long' : 'short';
          entryPrice = price;
          entryDate = timestamp;
          
          // Calculate position size
          if (tradeSize === 'fixed') {
            quantity = (currentCapital * (riskPerTrade / 100)) / price;
          } else {
            quantity = (currentCapital * (riskPerTrade / 100) * leverage) / price;
          }
        }
        // If we have a position, check for exit conditions
        else if (position) {
          const isProfit = (position === 'long' && price > entryPrice) || 
                           (position === 'short' && price < entryPrice);
          const profitPercentage = Math.abs((price - entryPrice) / entryPrice) * 100;
          
          // Check if takeProfit or stopLoss is hit
          if ((isProfit && profitPercentage >= takeProfit) || 
              (!isProfit && profitPercentage >= stopLoss) ||
              Math.random() > 0.95) { // Random exit for variety
            
            // Calculate profit
            let profit = position === 'long' ? 
              quantity * (price - entryPrice) : 
              quantity * (entryPrice - price);
            
            // Apply leverage if used
            profit = profit * leverage;
            
            // Record the trade
            const trade: BacktestTrade = {
              id: uuidv4(),
              type: position === 'long' ? 'buy' : 'sell',
              entryPrice,
              entryDate,
              exitPrice: price,
              exitDate: timestamp,
              quantity,
              profit,
              profitPercentage: (profit / (quantity * entryPrice)) * 100,
              assetId,
              direction: position,
              status: 'closed',
              duration: (timestamp - entryDate) / (1000 * 60 * 60 * 24) // duration in days
            };
            
            trades.push(trade);
            
            // Update capital
            if (compounding) {
              currentCapital += profit;
            }
            
            // Update max capital for drawdown calculation
            if (currentCapital > maxCapital) {
              maxCapital = currentCapital;
            }
            
            // Reset position
            position = null;
          }
        }
      }
    }
    
    // Calculate performance metrics
    const winningTrades = trades.filter(t => t.profit > 0);
    const losingTrades = trades.filter(t => t.profit <= 0);
    
    const totalReturn = trades.reduce((sum, trade) => sum + trade.profit, 0);
    const totalReturnPercentage = (totalReturn / initialCapital) * 100;
    const winRate = trades.length > 0 ? (winningTrades.length / trades.length) * 100 : 0;
    
    const averageWin = winningTrades.length > 0 ? 
      winningTrades.reduce((sum, trade) => sum + trade.profit, 0) / winningTrades.length : 0;
    
    const averageLoss = losingTrades.length > 0 ? 
      losingTrades.reduce((sum, trade) => sum + trade.profit, 0) / losingTrades.length : 0;
    
    const profitFactor = Math.abs(averageLoss) > 0 ? 
      Math.abs(averageWin / averageLoss) : 0;
    
    // Calculate max drawdown
    let maxDrawdown = 0;
    for (const point of equity) {
      if (point.drawdown > maxDrawdown) {
        maxDrawdown = point.drawdown;
      }
    }
    
    // Calculate Sharpe ratio (simplified)
    const returns = trades.map(t => t.profitPercentage);
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const stdDev = Math.sqrt(
      returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length
    );
    const sharpeRatio = stdDev > 0 ? avgReturn / stdDev : 0;
    
    // Calculate monthly performance
    const monthly: MonthlyPerformance[] = [];
    const monthMap = new Map<string, { return: number, trades: number }>();
    
    for (const trade of trades) {
      const date = new Date(trade.exitDate);
      const monthKey = format(date, 'yyyy-MM');
      
      if (!monthMap.has(monthKey)) {
        monthMap.set(monthKey, { return: 0, trades: 0 });
      }
      
      const monthData = monthMap.get(monthKey)!;
      monthData.return += trade.profitPercentage;
      monthData.trades += 1;
    }
    
    monthMap.forEach((data, monthKey) => {
      monthly.push({
        period: monthKey,
        return: data.return,
        trades: data.trades
      });
    });
    
    // Calculate asset performance
    const assetPerformance: AssetPerformance[] = [];
    const assetMap = new Map<string, { 
      return: number, 
      trades: number, 
      wins: number,
      totalReturn: number
    }>();
    
    for (const trade of trades) {
      if (!assetMap.has(trade.assetId!)) {
        assetMap.set(trade.assetId!, { 
          return: 0, 
          trades: 0, 
          wins: 0,
          totalReturn: 0
        });
      }
      
      const assetData = assetMap.get(trade.assetId!)!;
      assetData.return += trade.profitPercentage;
      assetData.trades += 1;
      assetData.totalReturn += trade.profit;
      
      if (trade.profit > 0) {
        assetData.wins += 1;
      }
    }
    
    assetMap.forEach((data, assetId) => {
      assetPerformance.push({
        assetId,
        assetName: assetId === 'bitcoin' ? 'Bitcoin' : 
                   assetId === 'ethereum' ? 'Ethereum' : 
                   assetId === 'binancecoin' ? 'Binance Coin' : assetId,
        return: data.return,
        trades: data.trades,
        winRate: data.trades > 0 ? (data.wins / data.trades) * 100 : 0,
        averageReturn: data.trades > 0 ? data.return / data.trades : 0
      });
    });
    
    const averageTradeDuration = trades.length > 0 ?
      trades.reduce((sum, trade) => sum + (trade.duration || 0), 0) / trades.length : 0;
    
    const averageProfit = trades.length > 0 ?
      trades.reduce((sum, trade) => sum + trade.profit, 0) / trades.length : 0;
    
    // Construct the final result
    const result: BacktestResult = {
      id: uuidv4(),
      assetId: assetIds[0],
      settings,
      trades,
      equity,
      monthly,
      assetPerformance,
      performance: {
        totalReturn,
        totalReturnPercentage,
        winRate,
        averageWin,
        averageLoss,
        largestWin: Math.max(...winningTrades.map(t => t.profit), 0),
        largestLoss: Math.min(...losingTrades.map(t => t.profit), 0),
        profitFactor,
        maxDrawdown,
        sharpeRatio,
        totalTrades: trades.length,
        winningTrades: winningTrades.length,
        losingTrades: losingTrades.length,
        averageTradeDuration,
        averageProfit
      },
      createdAt: Date.now()
    };
    
    return result;
  } catch (error) {
    console.error('Error running backtest:', error);
    throw new Error('Failed to run backtest');
  }
};
