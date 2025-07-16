/**
 * Dynamic Coin List Management
 * Updates trading pairs weekly based on volume, volatility, and market trends
 */

import { supabase } from '@/integrations/supabase/client';

export interface CoinMetrics {
  symbol: string;
  volume_24h: number;
  price_change_24h: number;
  market_cap: number;
  volatility_7d: number;
  trending_score: number;
  liquidity_score: number;
}

export interface CoinListUpdate {
  added: string[];
  removed: string[];
  reason: string;
  timestamp: number;
}

export class DynamicCoinListManager {
  private static instance: DynamicCoinListManager;
  private currentCoinList: string[] = [
    'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
    'ADAUSDT', 'AVAXUSDT', 'DOTUSDT', 'LINKUSDT', 'MATICUSDT',
    'LTCUSDT', 'ATOMUSDT', 'FTMUSDT', 'ALGOUSDT', 'VETUSDT',
    'ICPUSDT', 'FILUSDT', 'TRXUSDT', 'ETCUSDT', 'XLMUSDT'
  ];

  private excludedCoins: string[] = [
    'USTCUSDT', 'LUNAUSDT' // Problematic coins
  ];

  public static getInstance(): DynamicCoinListManager {
    if (!DynamicCoinListManager.instance) {
      DynamicCoinListManager.instance = new DynamicCoinListManager();
    }
    return DynamicCoinListManager.instance;
  }

  /**
   * Update coin list based on market metrics
   */
  public async updateCoinList(): Promise<CoinListUpdate> {
    console.log('🔄 Starting weekly coin list update...');

    try {
      // Fetch market data for analysis
      const marketData = await this.fetchMarketData();
      
      // Analyze current coins
      const analysis = this.analyzeCoinPerformance(marketData);
      
      // Determine coins to add/remove
      const update = this.determineListChanges(analysis);
      
      // Apply changes
      if (update.added.length > 0 || update.removed.length > 0) {
        this.applyCoinListChanges(update);
        await this.logCoinListUpdate(update);
      }

      console.log('✅ Coin list update completed:', update);
      return update;

    } catch (error) {
      console.error('❌ Failed to update coin list:', error);
      return {
        added: [],
        removed: [],
        reason: `Update failed: ${error.message}`,
        timestamp: Date.now()
      };
    }
  }

  /**
   * Fetch market data for all potential coins
   */
  private async fetchMarketData(): Promise<CoinMetrics[]> {
    console.log('📊 Fetching market data for coin analysis...');

    // Mock market data - replace with real API calls
    const mockData: CoinMetrics[] = [
      // Current coins
      { symbol: 'BTCUSDT', volume_24h: 1500000000, price_change_24h: 2.5, market_cap: 800000000000, volatility_7d: 0.15, trending_score: 0.9, liquidity_score: 1.0 },
      { symbol: 'ETHUSDT', volume_24h: 800000000, price_change_24h: 3.2, market_cap: 300000000000, volatility_7d: 0.18, trending_score: 0.85, liquidity_score: 0.95 },
      { symbol: 'BNBUSDT', volume_24h: 200000000, price_change_24h: 1.8, market_cap: 50000000000, volatility_7d: 0.22, trending_score: 0.7, liquidity_score: 0.8 },
      
      // Potential new coins
      { symbol: 'ARBUSDT', volume_24h: 150000000, price_change_24h: 8.5, market_cap: 15000000000, volatility_7d: 0.35, trending_score: 0.95, liquidity_score: 0.75 },
      { symbol: 'OPUSDT', volume_24h: 120000000, price_change_24h: 6.2, market_cap: 12000000000, volatility_7d: 0.32, trending_score: 0.9, liquidity_score: 0.7 },
      { symbol: 'INJUSDT', volume_24h: 90000000, price_change_24h: 12.1, market_cap: 8000000000, volatility_7d: 0.45, trending_score: 0.88, liquidity_score: 0.65 },
      
      // Underperforming coins
      { symbol: 'LTCUSDT', volume_24h: 50000000, price_change_24h: 0.2, market_cap: 8000000000, volatility_7d: 0.08, trending_score: 0.3, liquidity_score: 0.6 },
      { symbol: 'ETCUSDT', volume_24h: 30000000, price_change_24h: -1.2, market_cap: 3000000000, volatility_7d: 0.12, trending_score: 0.25, liquidity_score: 0.5 }
    ];

    return mockData;
  }

  /**
   * Analyze coin performance and categorize
   */
  private analyzeCoinPerformance(marketData: CoinMetrics[]): any {
    const analysis = {
      hotCoins: [] as CoinMetrics[],
      coldCoins: [] as CoinMetrics[],
      stableCoins: [] as CoinMetrics[],
      newOpportunities: [] as CoinMetrics[]
    };

    marketData.forEach(coin => {
      // Skip excluded coins
      if (this.excludedCoins.includes(coin.symbol)) return;

      const score = this.calculateCoinScore(coin);

      if (score > 0.8) {
        analysis.hotCoins.push(coin);
      } else if (score < 0.3) {
        analysis.coldCoins.push(coin);
      } else if (coin.volatility_7d < 0.15) {
        analysis.stableCoins.push(coin);
      }

      // Check if it's a new opportunity (not in current list)
      if (!this.currentCoinList.includes(coin.symbol) && score > 0.7) {
        analysis.newOpportunities.push(coin);
      }
    });

    return analysis;
  }

  /**
   * Calculate overall score for a coin
   */
  private calculateCoinScore(coin: CoinMetrics): number {
    // Normalize values and calculate weighted score
    const volumeScore = Math.min(coin.volume_24h / 1000000000, 1); // Cap at 1B
    const trendingScore = coin.trending_score;
    const liquidityScore = coin.liquidity_score;
    const volatilityScore = Math.min(coin.volatility_7d / 0.5, 1); // Cap volatility benefit
    const marketCapScore = Math.min(coin.market_cap / 100000000000, 1); // Cap at 100B

    // Weighted average
    return (
      volumeScore * 0.3 +
      trendingScore * 0.25 +
      liquidityScore * 0.2 +
      volatilityScore * 0.15 +
      marketCapScore * 0.1
    );
  }

  /**
   * Determine which coins to add/remove
   */
  private determineListChanges(analysis: any): CoinListUpdate {
    const added: string[] = [];
    const removed: string[] = [];
    let reason = '';

    // Add hot new opportunities (max 3 per week)
    const topOpportunities = analysis.newOpportunities
      .sort((a, b) => this.calculateCoinScore(b) - this.calculateCoinScore(a))
      .slice(0, 3);

    topOpportunities.forEach(coin => {
      if (this.currentCoinList.length < 60) { // Max 60 coins
        added.push(coin.symbol);
      }
    });

    // Remove cold/underperforming coins
    const coldCoinsInList = analysis.coldCoins
      .filter(coin => this.currentCoinList.includes(coin.symbol))
      .sort((a, b) => this.calculateCoinScore(a) - this.calculateCoinScore(b))
      .slice(0, 2); // Remove max 2 per week

    coldCoinsInList.forEach(coin => {
      // Keep core coins (BTC, ETH, BNB)
      if (!['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].includes(coin.symbol)) {
        removed.push(coin.symbol);
      }
    });

    // Generate reason
    if (added.length > 0 && removed.length > 0) {
      reason = `Added ${added.length} hot coins, removed ${removed.length} underperforming coins`;
    } else if (added.length > 0) {
      reason = `Added ${added.length} trending coins`;
    } else if (removed.length > 0) {
      reason = `Removed ${removed.length} underperforming coins`;
    } else {
      reason = 'No changes needed - all coins performing adequately';
    }

    return {
      added,
      removed,
      reason,
      timestamp: Date.now()
    };
  }

  /**
   * Apply coin list changes
   */
  private applyCoinListChanges(update: CoinListUpdate): void {
    // Remove coins
    update.removed.forEach(symbol => {
      const index = this.currentCoinList.indexOf(symbol);
      if (index > -1) {
        this.currentCoinList.splice(index, 1);
      }
    });

    // Add new coins
    update.added.forEach(symbol => {
      if (!this.currentCoinList.includes(symbol)) {
        this.currentCoinList.push(symbol);
      }
    });

    console.log(`🔄 Coin list updated: ${this.currentCoinList.length} total coins`);
  }

  /**
   * Log coin list update to database
   */
  private async logCoinListUpdate(update: CoinListUpdate): Promise<void> {
    try {
      const { error } = await supabase
        .from('market_intelligence')
        .insert({
          title: 'Coin List Update',
          content_type: 'coin_list_update',
          content: update.reason,
          source: 'dynamic_coin_manager',
          metadata: {
            added: update.added,
            removed: update.removed,
            total_coins: this.currentCoinList.length,
            timestamp: update.timestamp
          }
        });

      if (error) throw error;
      console.log('✅ Coin list update logged to database');

    } catch (error) {
      console.error('❌ Failed to log coin list update:', error);
    }
  }

  /**
   * Get current coin list
   */
  public getCurrentCoinList(): string[] {
    return [...this.currentCoinList];
  }

  /**
   * Get coin list stats
   */
  public getCoinListStats(): any {
    return {
      totalCoins: this.currentCoinList.length,
      lastUpdate: 'Weekly automatic update',
      categories: {
        major: this.currentCoinList.filter(s => ['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].includes(s)).length,
        altcoins: this.currentCoinList.filter(s => !['BTCUSDT', 'ETHUSDT', 'BNBUSDT'].includes(s)).length
      }
    };
  }

  /**
   * Schedule weekly updates (call this from a cron job or edge function)
   */
  public async scheduleWeeklyUpdate(): Promise<void> {
    const lastUpdate = localStorage.getItem('last_coin_update');
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    
    if (!lastUpdate || Date.now() - parseInt(lastUpdate) > oneWeek) {
      await this.updateCoinList();
      localStorage.setItem('last_coin_update', Date.now().toString());
    }
  }
}

export const dynamicCoinListManager = DynamicCoinListManager.getInstance();
