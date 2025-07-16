/**
 * Market Heat Index
 * Measures overall market temperature and sentiment
 */

import { supabase } from '@/integrations/supabase/client';

export interface HeatIndexData {
  overallHeat: number; // 0-100
  sentiment: 'extreme_fear' | 'fear' | 'neutral' | 'greed' | 'extreme_greed';
  volatility: 'low' | 'medium' | 'high' | 'extreme';
  volume: 'low' | 'medium' | 'high' | 'extreme';
  newsImpact: number;
  whaleActivity: number;
  technicalStrength: number;
  riskLevel: 'low' | 'medium' | 'high' | 'extreme';
  recommendation: 'strong_buy' | 'buy' | 'hold' | 'sell' | 'strong_sell';
  lastUpdated: string;
}

export interface MarketMetrics {
  fearGreedIndex: number;
  btcDominance: number;
  totalMarketCap: number;
  totalVolume24h: number;
  activeCryptocurrencies: number;
  marketCapChange24h: number;
}

export class MarketHeatIndex {
  private static instance: MarketHeatIndex;
  private currentHeatIndex: HeatIndexData | null = null;
  private lastUpdate = 0;
  private readonly UPDATE_INTERVAL = 300000; // 5 minutes

  public static getInstance(): MarketHeatIndex {
    if (!MarketHeatIndex.instance) {
      MarketHeatIndex.instance = new MarketHeatIndex();
    }
    return MarketHeatIndex.instance;
  }

  /**
   * Get current market heat index
   */
  public async getCurrentHeatIndex(): Promise<HeatIndexData> {
    console.log('🌡️ Calculating market heat index');
    
    // Check if update is needed
    if (this.currentHeatIndex && Date.now() - this.lastUpdate < this.UPDATE_INTERVAL) {
      return this.currentHeatIndex;
    }

    try {
      // Gather market data
      const marketMetrics = await this.gatherMarketMetrics();
      const newsData = await this.analyzeNewsImpact();
      const whaleData = await this.analyzeWhaleActivity();
      const technicalData = await this.analyzeTechnicalStrength();

      // Calculate heat index
      const heatIndex = this.calculateHeatIndex({
        marketMetrics,
        newsData,
        whaleData,
        technicalData
      });

      this.currentHeatIndex = heatIndex;
      this.lastUpdate = Date.now();

      console.log(`🌡️ Market Heat Index: ${heatIndex.overallHeat}/100 (${heatIndex.sentiment})`);
      return heatIndex;
    } catch (error) {
      console.error('❌ Error calculating heat index:', error);
      
      // Return default/cached data on error
      return this.currentHeatIndex || this.getDefaultHeatIndex();
    }
  }

  /**
   * Gather market metrics
   */
  private async gatherMarketMetrics(): Promise<MarketMetrics> {
    try {
      // In a real implementation, this would fetch from CoinGecko/CMC API
      // For now, using simulated data based on market intelligence
      
      const { data: intelligence } = await supabase
        .from('market_intelligence')
        .select('*')
        .order('processed_at', { ascending: false })
        .limit(100);

      // Analyze recent intelligence for market sentiment
      const recentNews = intelligence?.filter(item => 
        Date.now() - new Date(item.processed_at).getTime() < 86400000 // Last 24h
      ) || [];

      const positiveNews = recentNews.filter(item => item.sentiment === 'positive').length;
      const negativeNews = recentNews.filter(item => item.sentiment === 'negative').length;
      const totalNews = recentNews.length;

      // Calculate derived fear/greed index
      let fearGreedIndex = 50; // Neutral
      if (totalNews > 0) {
        const sentimentRatio = positiveNews / totalNews;
        fearGreedIndex = Math.round(sentimentRatio * 100);
      }

      return {
        fearGreedIndex,
        btcDominance: 45 + Math.random() * 10, // Simulated 45-55%
        totalMarketCap: 1200000000000 + Math.random() * 400000000000, // $1.2-1.6T
        totalVolume24h: 50000000000 + Math.random() * 100000000000, // $50-150B
        activeCryptocurrencies: 13000 + Math.round(Math.random() * 2000),
        marketCapChange24h: -5 + Math.random() * 10 // -5% to +5%
      };
    } catch (error) {
      console.error('❌ Error gathering market metrics:', error);
      return this.getDefaultMarketMetrics();
    }
  }

  /**
   * Analyze news impact
   */
  private async analyzeNewsImpact(): Promise<number> {
    try {
      const { data: news } = await supabase
        .from('market_intelligence')
        .select('*')
        .eq('content_type', 'news')
        .gte('processed_at', new Date(Date.now() - 86400000).toISOString()) // Last 24h
        .order('processed_at', { ascending: false });

      if (!news || news.length === 0) return 50; // Neutral

      let impactScore = 0;
      let totalWeight = 0;

      news.forEach(item => {
        let weight = 1;
        
        // Weight by impact level
        if (item.impact_level === 'high') weight = 3;
        else if (item.impact_level === 'medium') weight = 2;

        // Weight by sentiment
        let sentimentScore = 50;
        if (item.sentiment === 'positive') sentimentScore = 75;
        else if (item.sentiment === 'negative') sentimentScore = 25;

        impactScore += sentimentScore * weight;
        totalWeight += weight;
      });

      return totalWeight > 0 ? impactScore / totalWeight : 50;
    } catch (error) {
      console.error('❌ Error analyzing news impact:', error);
      return 50;
    }
  }

  /**
   * Analyze whale activity
   */
  private async analyzeWhaleActivity(): Promise<number> {
    try {
      const { data: whales } = await supabase
        .from('market_intelligence')
        .select('*')
        .eq('content_type', 'whale_alert')
        .gte('processed_at', new Date(Date.now() - 86400000).toISOString()) // Last 24h
        .order('processed_at', { ascending: false });

      if (!whales || whales.length === 0) return 50; // Neutral

      let activityScore = 50;
      let buyActivity = 0;
      let sellActivity = 0;

      whales.forEach(whale => {
        const metadata = typeof whale.metadata === 'object' && whale.metadata !== null ? 
                        whale.metadata as Record<string, any> : {};
        const amount = Number(metadata.amount) || 0;
        
        if (metadata.type === 'buy' || metadata.transaction_type === 'buy') {
          buyActivity += amount;
        } else if (metadata.type === 'sell' || metadata.transaction_type === 'sell') {
          sellActivity += amount;
        }
      });

      const totalActivity = buyActivity + sellActivity;
      if (totalActivity > 0) {
        const buyRatio = buyActivity / totalActivity;
        activityScore = 30 + (buyRatio * 40); // 30-70 range based on buy/sell ratio
        
        // Boost for high activity
        if (whales.length > 10) activityScore += 10;
        if (whales.length > 20) activityScore += 10;
      }

      return Math.max(0, Math.min(100, activityScore));
    } catch (error) {
      console.error('❌ Error analyzing whale activity:', error);
      return 50;
    }
  }

  /**
   * Analyze technical strength
   */
  private async analyzeTechnicalStrength(): Promise<number> {
    try {
      // Get recent market data cache
      const { data: marketData } = await supabase
        .from('market_data_cache')
        .select('*')
        .in('symbol', ['BTCUSDT', 'ETHUSDT'])
        .order('created_at', { ascending: false })
        .limit(10);

      if (!marketData || marketData.length === 0) return 50;

      let technicalScore = 50;
      let validMetrics = 0;

      marketData.forEach(data => {
        // RSI analysis
        if (data.rsi) {
          if (data.rsi > 70) technicalScore -= 10; // Overbought
          else if (data.rsi < 30) technicalScore += 10; // Oversold
          else if (data.rsi > 50) technicalScore += 5; // Bullish
          validMetrics++;
        }

        // VWAP analysis
        if (data.vwap && data.price) {
          if (data.price > data.vwap) technicalScore += 5; // Above VWAP
          else technicalScore -= 5; // Below VWAP
          validMetrics++;
        }

        // Volume analysis
        if (data.volume) {
          const avgVolume = 1000000; // Placeholder
          if (data.volume > avgVolume * 1.5) technicalScore += 5; // High volume
          else if (data.volume < avgVolume * 0.5) technicalScore -= 5; // Low volume
          validMetrics++;
        }
      });

      return validMetrics > 0 ? Math.max(0, Math.min(100, technicalScore)) : 50;
    } catch (error) {
      console.error('❌ Error analyzing technical strength:', error);
      return 50;
    }
  }

  /**
   * Calculate overall heat index
   */
  private calculateHeatIndex(data: any): HeatIndexData {
    const {
      marketMetrics,
      newsData,
      whaleData,
      technicalData
    } = data;

    // Weighted calculation
    const weights = {
      fearGreed: 0.3,
      news: 0.25,
      whale: 0.2,
      technical: 0.15,
      volume: 0.1
    };

    let overallHeat = 0;
    overallHeat += marketMetrics.fearGreedIndex * weights.fearGreed;
    overallHeat += newsData * weights.news;
    overallHeat += whaleData * weights.whale;
    overallHeat += technicalData * weights.technical;
    
    // Volume factor
    const volumeScore = this.calculateVolumeScore(marketMetrics);
    overallHeat += volumeScore * weights.volume;

    overallHeat = Math.round(Math.max(0, Math.min(100, overallHeat)));

    // Determine sentiment
    const sentiment = this.determineSentiment(overallHeat);
    
    // Determine volatility
    const volatility = this.determineVolatility(marketMetrics);
    
    // Determine volume level
    const volume = this.determineVolumeLevel(volumeScore);
    
    // Calculate risk level
    const riskLevel = this.calculateRiskLevel(overallHeat, volatility);
    
    // Generate recommendation
    const recommendation = this.generateRecommendation(overallHeat, riskLevel);

    return {
      overallHeat,
      sentiment,
      volatility,
      volume,
      newsImpact: newsData,
      whaleActivity: whaleData,
      technicalStrength: technicalData,
      riskLevel,
      recommendation,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Calculate volume score
   */
  private calculateVolumeScore(metrics: MarketMetrics): number {
    // Simplified volume scoring
    const avgVolume = 75000000000; // $75B average
    const ratio = metrics.totalVolume24h / avgVolume;
    
    if (ratio > 2) return 80; // Very high volume
    if (ratio > 1.5) return 70; // High volume
    if (ratio > 1) return 60; // Above average
    if (ratio > 0.7) return 50; // Average
    if (ratio > 0.5) return 40; // Below average
    return 30; // Low volume
  }

  /**
   * Determine sentiment from heat index
   */
  private determineSentiment(heat: number): HeatIndexData['sentiment'] {
    if (heat >= 80) return 'extreme_greed';
    if (heat >= 65) return 'greed';
    if (heat >= 35) return 'neutral';
    if (heat >= 20) return 'fear';
    return 'extreme_fear';
  }

  /**
   * Determine volatility
   */
  private determineVolatility(metrics: MarketMetrics): HeatIndexData['volatility'] {
    const changePercent = Math.abs(metrics.marketCapChange24h);
    
    if (changePercent > 8) return 'extreme';
    if (changePercent > 5) return 'high';
    if (changePercent > 2) return 'medium';
    return 'low';
  }

  /**
   * Determine volume level
   */
  private determineVolumeLevel(volumeScore: number): HeatIndexData['volume'] {
    if (volumeScore >= 75) return 'extreme';
    if (volumeScore >= 65) return 'high';
    if (volumeScore >= 45) return 'medium';
    return 'low';
  }

  /**
   * Calculate risk level
   */
  private calculateRiskLevel(heat: number, volatility: HeatIndexData['volatility']): HeatIndexData['riskLevel'] {
    let riskScore = 0;
    
    // Heat-based risk
    if (heat > 85 || heat < 15) riskScore += 2; // Extreme sentiment
    else if (heat > 75 || heat < 25) riskScore += 1; // High sentiment
    
    // Volatility risk
    if (volatility === 'extreme') riskScore += 2;
    else if (volatility === 'high') riskScore += 1;
    
    if (riskScore >= 3) return 'extreme';
    if (riskScore >= 2) return 'high';
    if (riskScore >= 1) return 'medium';
    return 'low';
  }

  /**
   * Generate recommendation
   */
  private generateRecommendation(heat: number, riskLevel: HeatIndexData['riskLevel']): HeatIndexData['recommendation'] {
    // Conservative approach for high risk
    if (riskLevel === 'extreme') {
      return heat > 50 ? 'hold' : 'sell';
    }
    
    if (heat >= 80) return 'sell'; // Too greedy
    if (heat >= 65) return 'hold'; // Greedy
    if (heat >= 35) return 'hold'; // Neutral
    if (heat >= 20) return 'buy'; // Fearful
    return 'strong_buy'; // Extremely fearful
  }

  /**
   * Get default heat index
   */
  private getDefaultHeatIndex(): HeatIndexData {
    return {
      overallHeat: 50,
      sentiment: 'neutral',
      volatility: 'medium',
      volume: 'medium',
      newsImpact: 50,
      whaleActivity: 50,
      technicalStrength: 50,
      riskLevel: 'medium',
      recommendation: 'hold',
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Get default market metrics
   */
  private getDefaultMarketMetrics(): MarketMetrics {
    return {
      fearGreedIndex: 50,
      btcDominance: 50,
      totalMarketCap: 1400000000000,
      totalVolume24h: 75000000000,
      activeCryptocurrencies: 14000,
      marketCapChange24h: 0
    };
  }

  /**
   * Generate heat index summary
   */
  public generateHeatSummary(heatData: HeatIndexData): string {
    let summary = `🌡️ MARKET HEAT INDEX: ${heatData.overallHeat}/100\n\n`;
    
    // Overall sentiment
    const sentimentEmoji = {
      'extreme_fear': '😱',
      'fear': '😰',
      'neutral': '😐',
      'greed': '🤑',
      'extreme_greed': '🔥'
    };
    
    summary += `${sentimentEmoji[heatData.sentiment]} Sentiment: ${heatData.sentiment.replace('_', ' ').toUpperCase()}\n`;
    summary += `⚡ Volatility: ${heatData.volatility.toUpperCase()}\n`;
    summary += `📊 Volume: ${heatData.volume.toUpperCase()}\n`;
    summary += `⚠️ Risk Level: ${heatData.riskLevel.toUpperCase()}\n\n`;
    
    // Detailed metrics
    summary += `📰 News Impact: ${heatData.newsImpact.toFixed(0)}/100\n`;
    summary += `🐋 Whale Activity: ${heatData.whaleActivity.toFixed(0)}/100\n`;
    summary += `📈 Technical Strength: ${heatData.technicalStrength.toFixed(0)}/100\n\n`;
    
    // Recommendation
    const recEmoji = {
      'strong_buy': '🟢🟢',
      'buy': '🟢',
      'hold': '🟡',
      'sell': '🔴',
      'strong_sell': '🔴🔴'
    };
    
    summary += `${recEmoji[heatData.recommendation]} Recommendation: ${heatData.recommendation.replace('_', ' ').toUpperCase()}`;
    
    return summary;
  }

  /**
   * Reset heat index
   */
  public reset(): void {
    this.currentHeatIndex = null;
    this.lastUpdate = 0;
    console.log('🔄 Market heat index reset');
  }
}

export const marketHeatIndex = MarketHeatIndex.getInstance();