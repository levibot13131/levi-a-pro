
import { PricePoint, TradeSignal } from "@/types/asset";
import { getWhaleMovements, WhaleMovement } from "@/services/whaleTrackerService";

/**
 * Generates trading signals based on whale activities and significant market movements
 */
export const generateWhaleSignals = async (
  priceData: PricePoint[],
  assetId: string,
  strategy: string = "whale-tracking"
): Promise<TradeSignal[]> => {
  if (!priceData || priceData.length < 10) {
    return [];
  }

  try {
    // Get whale movement data for the asset
    const whaleMovements = await getWhaleMovements(assetId, 30);
    
    // Filter for significant whale movements
    const significantMovements = whaleMovements.filter(
      movement => movement.impact.significance === 'high' || movement.impact.significance === 'very-high'
    );
    
    // Create signals from whale movements
    const signals: TradeSignal[] = significantMovements.map(movement => {
      // Find closest price point to the movement timestamp
      const closestPricePoint = priceData.reduce((prev, curr) => {
        return Math.abs(curr.timestamp - movement.timestamp) < Math.abs(prev.timestamp - movement.timestamp)
          ? curr
          : prev;
      });
      
      // Determine if this is a buy or sell signal based on the whale's activity
      const signalType = movement.transactionType === 'buy' ? 'buy' : 'sell';
      
      // Calculate signal strength based on movement significance and size
      let strength: 'weak' | 'medium' | 'strong';
      if (movement.impact.significance === 'very-high') {
        strength = 'strong';
      } else if (movement.impact.significance === 'high' && movement.amount > 500000) {
        strength = 'strong';
      } else if (movement.impact.significance === 'high') {
        strength = 'medium';
      } else {
        strength = 'weak';
      }
      
      // Generate signal ID
      const signalId = `whale-${movement.id}-${Date.now()}`;
      
      // Calculate potential stop loss and take profit levels
      const stopLossPercent = signalType === 'buy' ? -2 : 2;
      const takeProfitPercent = signalType === 'buy' ? 5 : -5;
      
      const stopLoss = closestPricePoint.price * (1 + (stopLossPercent / 100));
      const targetPrice = closestPricePoint.price * (1 + (takeProfitPercent / 100));
      
      // Create the signal
      return {
        id: signalId,
        assetId,
        type: signalType,
        price: closestPricePoint.price,
        timestamp: movement.timestamp,
        strength,
        strategy: `Whale ${strategy} - ${movement.walletLabel || 'Large Wallet'} Activity`,
        timeframe: '1d',
        targetPrice,
        stopLoss,
        riskRewardRatio: Math.abs(takeProfitPercent / stopLossPercent),
        notes: `Signal based on ${movement.walletLabel || 'whale wallet'} movement of $${movement.amount.toLocaleString()} with estimated market impact of ${movement.impact.priceImpact.toFixed(2)}%.`
      };
    });
    
    return signals;
  } catch (error) {
    console.error("Error generating whale signals:", error);
    return [];
  }
};
