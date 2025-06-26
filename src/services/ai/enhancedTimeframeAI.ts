
import { supabase } from '@/integrations/supabase/client';
import { binanceSocket } from '../binance/binanceSocket';

interface TimeframeData {
  symbol: string;
  timeframe: string;
  trend: 'bullish' | 'bearish' | 'neutral';
  strength: number; // 0-100
  rsi: number;
  ema21: number;
  ema50: number;
  ema200: number;
  volume: number;
  timestamp: number;
}

interface MultiTimeframeAnalysis {
  symbol: string;
  alignment: number; // 0-100%
  confidence: number;
  overallTrend: 'bullish' | 'bearish' | 'neutral';
  timeframes: {
    [key: string]: TimeframeData;
  };
  conflictingSignals: string[];
  reasoning: string[];
}

export class EnhancedTimeframeAI {
  private static readonly TIMEFRAMES = ['1m', '5m', '15m', '1h', '4h', '1d'];
  private static cache = new Map<string, MultiTimeframeAnalysis>();
  private static cacheExpiry = new Map<string, number>();
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static async analyzeSymbolWithMultiTimeframes(symbol: string): Promise<MultiTimeframeAnalysis> {
    const cacheKey = symbol;
    const now = Date.now();
    
    // Check cache first
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > now) {
      console.log(`📊 Using cached multi-timeframe analysis for ${symbol}`);
      return this.cache.get(cacheKey)!;
    }

    console.log(`🔍 Performing fresh multi-timeframe analysis for ${symbol}`);

    try {
      const timeframeData: { [key: string]: TimeframeData } = {};
      const analysisPromises = this.TIMEFRAMES.map(tf => 
        this.analyzeTimeframe(symbol, tf)
      );

      const results = await Promise.all(analysisPromises);
      
      results.forEach((data, index) => {
        if (data) {
          timeframeData[this.TIMEFRAMES[index]] = data;
        }
      });

      const analysis = this.calculateAlignment(symbol, timeframeData);
      
      // Cache results
      this.cache.set(cacheKey, analysis);
      this.cacheExpiry.set(cacheKey, now + this.CACHE_DURATION);
      
      // Store in database cache - using existing columns
      await this.storeInDatabaseCache(analysis);
      
      return analysis;
      
    } catch (error) {
      console.error(`❌ Multi-timeframe analysis failed for ${symbol}:`, error);
      return this.getDefaultAnalysis(symbol);
    }
  }

  private static async analyzeTimeframe(symbol: string, timeframe: string): Promise<TimeframeData | null> {
    try {
      // For now, we'll simulate technical analysis
      // In production, this would call actual technical indicators
      const mockPrice = 67000 + (Math.random() * 4000) - 2000;
      const change = (Math.random() * 10) - 5;
      
      const trend = this.determineTrend(change, Math.random() * 100);
      const strength = Math.abs(change) * 10;
      
      return {
        symbol,
        timeframe,
        trend,
        strength: Math.min(100, strength),
        rsi: 30 + (Math.random() * 40), // Mock RSI between 30-70
        ema21: mockPrice * (1 + (Math.random() * 0.02) - 0.01),
        ema50: mockPrice * (1 + (Math.random() * 0.04) - 0.02),
        ema200: mockPrice * (1 + (Math.random() * 0.1) - 0.05),
        volume: Math.random() * 1000000,
        timestamp: Date.now()
      };
      
    } catch (error) {
      console.error(`Error analyzing ${timeframe} for ${symbol}:`, error);
      return null;
    }
  }

  private static determineTrend(change: number, volume: number): 'bullish' | 'bearish' | 'neutral' {
    if (Math.abs(change) < 1) return 'neutral';
    if (change > 2 && volume > 50) return 'bullish';
    if (change < -2 && volume > 50) return 'bearish';
    return change > 0 ? 'bullish' : 'bearish';
  }

  private static calculateAlignment(symbol: string, timeframeData: { [key: string]: TimeframeData }): MultiTimeframeAnalysis {
    const validTimeframes = Object.values(timeframeData).filter(tf => tf !== null);
    
    if (validTimeframes.length === 0) {
      return this.getDefaultAnalysis(symbol);
    }

    const bullishCount = validTimeframes.filter(tf => tf.trend === 'bullish').length;
    const bearishCount = validTimeframes.filter(tf => tf.trend === 'bearish').length;
    const neutralCount = validTimeframes.filter(tf => tf.trend === 'neutral').length;
    
    const totalCount = validTimeframes.length;
    const bullishPercent = (bullishCount / totalCount) * 100;
    const bearishPercent = (bearishCount / totalCount) * 100;
    
    let overallTrend: 'bullish' | 'bearish' | 'neutral' = 'neutral';
    let alignment = 0;
    let confidence = 0;
    
    if (bullishCount >= bearishCount && bullishPercent >= 60) {
      overallTrend = 'bullish';
      alignment = bullishPercent;
      confidence = Math.min(95, bullishPercent + (validTimeframes.reduce((sum, tf) => sum + tf.strength, 0) / totalCount));
    } else if (bearishCount > bullishCount && bearishPercent >= 60) {
      overallTrend = 'bearish';
      alignment = bearishPercent;
      confidence = Math.min(95, bearishPercent + (validTimeframes.reduce((sum, tf) => sum + tf.strength, 0) / totalCount));
    } else {
      alignment = Math.max(bullishPercent, bearishPercent);
      confidence = 50 + (alignment - 50) * 0.5; // Lower confidence for mixed signals
    }

    const conflictingSignals: string[] = [];
    const reasoning: string[] = [];
    
    // Check for conflicts
    if (bullishCount > 0 && bearishCount > 0) {
      conflictingSignals.push(`Mixed signals: ${bullishCount} bullish, ${bearishCount} bearish timeframes`);
    }
    
    // Generate reasoning
    reasoning.push(`Multi-timeframe alignment: ${alignment.toFixed(0)}%`);
    reasoning.push(`${bullishCount}/${totalCount} timeframes bullish, ${bearishCount}/${totalCount} bearish`);
    
    if (overallTrend !== 'neutral') {
      reasoning.push(`Strong ${overallTrend} consensus across ${alignment >= 75 ? 'most' : 'majority'} timeframes`);
    } else {
      reasoning.push('Mixed timeframe signals suggest consolidation or trend change');
    }

    return {
      symbol,
      alignment,
      confidence,
      overallTrend,
      timeframes: timeframeData,
      conflictingSignals,
      reasoning
    };
  }

  private static async storeInDatabaseCache(analysis: MultiTimeframeAnalysis) {
    try {
      // Store using existing market_data_cache table structure
      await supabase
        .from('market_data_cache')
        .upsert({
          symbol: analysis.symbol,
          price: 67000, // Mock price - in production get from analysis
          volume: 1000000, // Mock volume
          rsi: 50, // Mock RSI
          sentiment_data: {
            timeframe_analysis: analysis,
            cached_at: new Date().toISOString(),
            expires_at: new Date(Date.now() + this.CACHE_DURATION).toISOString()
          },
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Failed to store timeframe analysis in cache:', error);
    }
  }

  private static getDefaultAnalysis(symbol: string): MultiTimeframeAnalysis {
    return {
      symbol,
      alignment: 50,
      confidence: 30,
      overallTrend: 'neutral',
      timeframes: {},
      conflictingSignals: ['Insufficient data for analysis'],
      reasoning: ['Analysis unavailable - using default neutral assessment']
    };
  }

  static formatTimeframeReport(analysis: MultiTimeframeAnalysis): string {
    const getTrendEmoji = (trend: string) => {
      switch (trend) {
        case 'bullish': return '🟢';
        case 'bearish': return '🔴';
        default: return '⚪';
      }
    };

    let report = `יישור זמנים: `;
    
    this.TIMEFRAMES.forEach(tf => {
      const tfData = analysis.timeframes[tf];
      if (tfData) {
        report += `${tf}${getTrendEmoji(tfData.trend)} `;
      } else {
        report += `${tf}⚫ `;
      }
    });
    
    report += `(${analysis.alignment.toFixed(0)}%)`;
    
    return report;
  }

  static requiresTimeframeAlignment(analysis: MultiTimeframeAnalysis, threshold: number = 75): boolean {
    return analysis.alignment >= threshold;
  }

  static getCachedAnalysis(symbol: string): MultiTimeframeAnalysis | null {
    const cacheKey = symbol;
    const now = Date.now();
    
    if (this.cache.has(cacheKey) && this.cacheExpiry.get(cacheKey)! > now) {
      return this.cache.get(cacheKey)!;
    }
    
    return null;
  }

  static clearCache(symbol?: string) {
    if (symbol) {
      this.cache.delete(symbol);
      this.cacheExpiry.delete(symbol);
    } else {
      this.cache.clear();
      this.cacheExpiry.clear();
    }
  }
}
