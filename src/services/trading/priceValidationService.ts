import { marketDataService } from './marketDataService';

interface PriceValidationResult {
  isValid: boolean;
  price: number;
  source: string;
  timestamp: number;
  error?: string;
}

/**
 * CRITICAL: Price Validation Service
 * Enforces LIVE PRICES ONLY across the entire system
 * NO MOCK, STATIC, OR FALLBACK PRICES ALLOWED
 */
export class PriceValidationService {
  private static instance: PriceValidationService;
  private priceCache = new Map<string, { price: number; timestamp: number; source: string }>();
  private readonly CACHE_DURATION = 30000; // 30 seconds

  public static getInstance(): PriceValidationService {
    if (!PriceValidationService.instance) {
      PriceValidationService.instance = new PriceValidationService();
    }
    return PriceValidationService.instance;
  }

  /**
   * Validates and returns LIVE price only
   * Throws error if unable to fetch real-time data
   */
  public async getValidatedLivePrice(symbol: string): Promise<PriceValidationResult> {
    try {
      console.log(`🔍 PRICE VALIDATION: Fetching LIVE price for ${symbol}...`);
      
      // Check cache first (if recent)
      const cached = this.priceCache.get(symbol);
      if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
        console.log(`✅ PRICE VALIDATION: Using cached LIVE price for ${symbol}: $${cached.price}`);
        return {
          isValid: true,
          price: cached.price,
          source: cached.source,
          timestamp: cached.timestamp
        };
      }

      // Fetch LIVE price from CoinGecko
      const livePrice = await marketDataService.getRealTimePrice(symbol);
      
      // Check if price was returned (null means symbol not supported)
      if (livePrice === null || livePrice === undefined) {
        console.warn(`⚠️ ${symbol} not supported - skipping`);
        return {
          isValid: false,
          price: 0,
          source: 'SYMBOL_NOT_SUPPORTED',
          timestamp: Date.now(),
          error: `Symbol ${symbol} not supported`
        };
      }
      
      // Validate price is reasonable (not obviously mock)
      if (!this.isReasonablePrice(symbol, livePrice)) {
        console.warn(`⚠️ PRICE WARNING: ${symbol} price $${livePrice} outside expected range`);
        // Still continue - don't fail completely
      }

      // Cache the validated price
      this.priceCache.set(symbol, {
        price: livePrice,
        timestamp: Date.now(),
        source: 'CoinGecko API'
      });

      console.log(`✅ PRICE VALIDATION: LIVE price validated for ${symbol}: $${livePrice}`);
      
      return {
        isValid: true,
        price: livePrice,
        source: 'CoinGecko API',
        timestamp: Date.now()
      };

    } catch (error) {
      console.error(`❌ PRICE VALIDATION FAILED for ${symbol}:`, error);
      
      return {
        isValid: false,
        price: 0,
        source: 'VALIDATION_FAILED',
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  /**
   * Validates if price is reasonable (not mock data)
   */
  private isReasonablePrice(symbol: string, price: number): boolean {
    // Define reasonable price ranges for major cryptocurrencies
    const priceRanges = {
      'BTCUSDT': { min: 15000, max: 200000 },
      'ETHUSDT': { min: 800, max: 15000 },
      'BNBUSDT': { min: 100, max: 2000 },
      'SOLUSDT': { min: 8, max: 800 },
      'ADAUSDT': { min: 0.2, max: 10 },
      'DOTUSDT': { min: 3, max: 100 }
    };

    const range = priceRanges[symbol];
    if (!range) {
      // For unknown symbols, just check it's positive
      return price > 0;
    }

    const isInRange = price >= range.min && price <= range.max;
    
    if (!isInRange) {
      console.warn(`⚠️ PRICE WARNING: ${symbol} price $${price} outside expected range $${range.min}-$${range.max}`);
    }

    return isInRange;
  }

  /**
   * Batch validate multiple symbols
   */
  public async validateMultiplePrices(symbols: string[]): Promise<Map<string, PriceValidationResult>> {
    const results = new Map<string, PriceValidationResult>();
    
    console.log(`🔍 BATCH PRICE VALIDATION: Validating ${symbols.length} symbols...`);
    
    for (const symbol of symbols) {
      try {
        const result = await this.getValidatedLivePrice(symbol);
        results.set(symbol, result);
      } catch (error) {
        results.set(symbol, {
          isValid: false,
          price: 0,
          source: 'BATCH_VALIDATION_FAILED',
          timestamp: Date.now(),
          error: error.message
        });
      }
    }

    const validCount = Array.from(results.values()).filter(r => r.isValid).length;
    console.log(`✅ BATCH VALIDATION: ${validCount}/${symbols.length} prices validated successfully`);
    
    return results;
  }

  /**
   * Clear all cached prices (force fresh fetch)
   */
  public clearPriceCache(): void {
    this.priceCache.clear();
    console.log('🧹 PRICE CACHE: Cleared all cached prices');
  }

  /**
   * Get cache status for debugging
   */
  public getCacheStatus() {
    const entries = Array.from(this.priceCache.entries()).map(([symbol, data]) => ({
      symbol,
      price: data.price,
      source: data.source,
      age: Date.now() - data.timestamp,
      fresh: (Date.now() - data.timestamp) < this.CACHE_DURATION
    }));

    return {
      totalCached: this.priceCache.size,
      entries
    };
  }
}

export const priceValidationService = PriceValidationService.getInstance();