import { PricePoint } from '@/types/asset';

export interface ElliotWavePattern {
  wave_id: string;
  symbol: string;
  pattern_type: 'impulse' | 'corrective';
  wave_count: number;
  current_wave: 1 | 2 | 3 | 4 | 5 | 'A' | 'B' | 'C';
  wave_structure: WaveStructure[];
  confidence: number;
  projected_targets: number[];
  invalidation_level: number;
  timestamp: number;
}

export interface WaveStructure {
  wave_number: number | string;
  start_price: number;
  end_price: number;
  start_time: number;
  end_time: number;
  wave_type: 'impulse' | 'correction';
  fibonacci_level?: number;
}

export interface WaveType {
  wave_number: number | string;
  start_price: number;
  end_price: number;
  start_time: number;
  end_time: number;
  wave_type: 'impulse' | 'correction';
  fibonacci_level?: number;
}

export interface ElliotWaveAnalysis {
  wave_id: string;
  symbol: string;
  pattern_type: 'impulse' | 'corrective';
  wave_count: number;
  current_wave: 1 | 2 | 3 | 4 | 5 | 'A' | 'B' | 'C';
  wave_structure: WaveStructure[];
  confidence: number;
  projected_targets: number[];
  invalidation_level: number;
  timestamp: number;
}

class ElliotWaveEngine {
  private fibonacciRatios = [0.236, 0.382, 0.5, 0.618, 0.786, 1.0, 1.272, 1.618, 2.618];
  private minWaveLength = 5; // Minimum bars for wave detection

  analyzeElliotWaves(priceData: PricePoint[], symbol: string): ElliotWavePattern[] {
    if (!priceData || priceData.length < 50) {
      return [];
    }

    const patterns: ElliotWavePattern[] = [];
    
    try {
      // Detect major swing highs and lows
      const swingPoints = this.detectSwingPoints(priceData);
      
      if (swingPoints.length < 8) {
        return patterns;
      }

      // Look for 5-wave impulse patterns
      const impulsePatterns = this.detectImpulseWaves(swingPoints, symbol);
      patterns.push(...impulsePatterns);

      // Look for 3-wave corrective patterns
      const correctivePatterns = this.detectCorrectiveWaves(swingPoints, symbol);
      patterns.push(...correctivePatterns);

      // Filter by confidence and return best patterns
      return patterns
        .filter(p => p.confidence > 0.6)
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 3);

    } catch (error) {
      console.error('Error in Elliott Wave analysis:', error);
      return [];
    }
  }

  private detectSwingPoints(priceData: PricePoint[]): SwingPoint[] {
    const swingPoints: SwingPoint[] = [];
    const lookback = 5;

    for (let i = lookback; i < priceData.length - lookback; i++) {
      const current = priceData[i];
      const isHigh = this.isSwingHigh(priceData, i, lookback);
      const isLow = this.isSwingLow(priceData, i, lookback);

      if (isHigh) {
        swingPoints.push({
          index: i,
          price: current.high,
          time: current.time,
          type: 'high'
        });
      } else if (isLow) {
        swingPoints.push({
          index: i,
          price: current.low,
          time: current.time,
          type: 'low'
        });
      }
    }

    return swingPoints;
  }

  private isSwingHigh(priceData: PricePoint[], index: number, lookback: number): boolean {
    const current = priceData[index].high;
    
    for (let i = index - lookback; i <= index + lookback; i++) {
      if (i !== index && priceData[i] && priceData[i].high >= current) {
        return false;
      }
    }
    return true;
  }

  private isSwingLow(priceData: PricePoint[], index: number, lookback: number): boolean {
    const current = priceData[index].low;
    
    for (let i = index - lookback; i <= index + lookback; i++) {
      if (i !== index && priceData[i] && priceData[i].low <= current) {
        return false;
      }
    }
    return true;
  }

  private detectImpulseWaves(swingPoints: SwingPoint[], symbol: string): ElliotWavePattern[] {
    const patterns: ElliotWavePattern[] = [];

    // Look for 5-wave patterns (alternating high-low or low-high)
    for (let i = 0; i <= swingPoints.length - 5; i++) {
      const fiveWaves = swingPoints.slice(i, i + 5);
      
      // Check if it's a valid 5-wave structure
      if (this.isValidImpulseStructure(fiveWaves)) {
        const pattern = this.createImpulsePattern(fiveWaves, symbol);
        if (pattern) {
          patterns.push(pattern);
        }
      }
    }

    return patterns;
  }

  private detectCorrectiveWaves(swingPoints: SwingPoint[], symbol: string): ElliotWavePattern[] {
    const patterns: ElliotWavePattern[] = [];

    // Look for 3-wave ABC patterns
    for (let i = 0; i <= swingPoints.length - 3; i++) {
      const threeWaves = swingPoints.slice(i, i + 3);
      
      if (this.isValidCorrectiveStructure(threeWaves)) {
        const pattern = this.createCorrectivePattern(threeWaves, symbol);
        if (pattern) {
          patterns.push(pattern);
        }
      }
    }

    return patterns;
  }

  private isValidImpulseStructure(waves: SwingPoint[]): boolean {
    if (waves.length !== 5) return false;

    // Check alternating pattern
    const isAlternating = waves.every((wave, index) => {
      if (index === 0) return true;
      return wave.type !== waves[index - 1].type;
    });

    if (!isAlternating) return false;

    // Elliott Wave rules validation
    const wave1 = Math.abs(waves[1].price - waves[0].price);
    const wave2 = Math.abs(waves[2].price - waves[1].price);
    const wave3 = Math.abs(waves[3].price - waves[2].price);
    const wave4 = Math.abs(waves[4].price - waves[3].price);

    // Wave 3 cannot be the shortest
    if (wave3 < wave1 && wave3 < wave4) return false;

    // Wave 2 cannot retrace more than 100% of wave 1
    if (wave2 > wave1) return false;

    return true;
  }

  private isValidCorrectiveStructure(waves: SwingPoint[]): boolean {
    if (waves.length !== 3) return false;

    // Check alternating pattern for ABC
    return waves[0].type !== waves[1].type && waves[1].type !== waves[2].type;
  }

  private createImpulsePattern(waves: SwingPoint[], symbol: string): ElliotWavePattern | null {
    try {
      const waveStructure: WaveStructure[] = [];
      
      for (let i = 0; i < waves.length - 1; i++) {
        waveStructure.push({
          wave_number: i + 1,
          start_price: waves[i].price,
          end_price: waves[i + 1].price,
          start_time: waves[i].time,
          end_time: waves[i + 1].time,
          wave_type: 'impulse',
          fibonacci_level: this.calculateFibonacciLevel(waves[i].price, waves[i + 1].price, waves)
        });
      }

      // Calculate projected targets using Fibonacci extensions
      const projectedTargets = this.calculateFibonacciTargets(waves);
      const invalidationLevel = this.calculateInvalidationLevel(waves);
      const confidence = this.calculatePatternConfidence(waves, 'impulse');

      return {
        wave_id: `impulse-${symbol}-${Date.now()}`,
        symbol,
        pattern_type: 'impulse',
        wave_count: 5,
        current_wave: this.determineCurrentWave(waves),
        wave_structure: waveStructure,
        confidence,
        projected_targets: projectedTargets,
        invalidation_level: invalidationLevel,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error creating impulse pattern:', error);
      return null;
    }
  }

  private createCorrectivePattern(waves: SwingPoint[], symbol: string): ElliotWavePattern | null {
    try {
      const waveStructure: WaveStructure[] = [];
      
      for (let i = 0; i < waves.length - 1; i++) {
        waveStructure.push({
          wave_number: ['A', 'B', 'C'][i],
          start_price: waves[i].price,
          end_price: waves[i + 1].price,
          start_time: waves[i].time,
          end_time: waves[i + 1].time,
          wave_type: 'correction'
        });
      }

      const projectedTargets = this.calculateCorrectiveTargets(waves);
      const invalidationLevel = this.calculateInvalidationLevel(waves);
      const confidence = this.calculatePatternConfidence(waves, 'corrective');

      return {
        wave_id: `corrective-${symbol}-${Date.now()}`,
        symbol,
        pattern_type: 'corrective',
        wave_count: 3,
        current_wave: 'C',
        wave_structure: waveStructure,
        confidence,
        projected_targets: projectedTargets,
        invalidation_level: invalidationLevel,
        timestamp: Date.now()
      };
    } catch (error) {
      console.error('Error creating corrective pattern:', error);
      return null;
    }
  }

  private calculateFibonacciLevel(startPrice: number, endPrice: number, allWaves: SwingPoint[]): number {
    const moveSize = Math.abs(endPrice - startPrice);
    const totalRange = Math.max(...allWaves.map(w => w.price)) - Math.min(...allWaves.map(w => w.price));
    const ratio = moveSize / totalRange;

    // Find closest Fibonacci ratio
    return this.fibonacciRatios.reduce((closest, current) => 
      Math.abs(current - ratio) < Math.abs(closest - ratio) ? current : closest
    );
  }

  private calculateFibonacciTargets(waves: SwingPoint[]): number[] {
    const firstWave = Math.abs(waves[1].price - waves[0].price);
    const basePrice = waves[waves.length - 1].price;
    const direction = waves[waves.length - 1].price > waves[0].price ? 1 : -1;

    return this.fibonacciRatios.map(ratio => 
      basePrice + (direction * firstWave * ratio)
    );
  }

  private calculateCorrectiveTargets(waves: SwingPoint[]): number[] {
    const cWave = Math.abs(waves[2].price - waves[1].price);
    const aWave = Math.abs(waves[1].price - waves[0].price);
    const basePrice = waves[2].price;
    const direction = waves[2].price > waves[0].price ? 1 : -1;

    // Common corrective ratios
    const correctiveRatios = [0.618, 1.0, 1.272, 1.618];
    
    return correctiveRatios.map(ratio => 
      basePrice + (direction * aWave * ratio)
    );
  }

  private calculateInvalidationLevel(waves: SwingPoint[]): number {
    // Invalidation typically at the start of wave 1 for impulse
    return waves[0].price;
  }

  private calculatePatternConfidence(waves: SwingPoint[], patternType: 'impulse' | 'corrective'): number {
    let confidence = 0.5;

    // Check time symmetry
    const timeDifferences = [];
    for (let i = 1; i < waves.length; i++) {
      timeDifferences.push(waves[i].time - waves[i-1].time);
    }
    
    const avgTime = timeDifferences.reduce((a, b) => a + b, 0) / timeDifferences.length;
    const timeVariance = timeDifferences.reduce((sum, time) => sum + Math.pow(time - avgTime, 2), 0) / timeDifferences.length;
    
    if (timeVariance < avgTime * 0.5) {
      confidence += 0.2; // Reward time symmetry
    }

    // Check price proportions
    if (patternType === 'impulse') {
      const wave1 = Math.abs(waves[1].price - waves[0].price);
      const wave3 = Math.abs(waves[3].price - waves[2].price);
      const wave5 = Math.abs(waves[4].price - waves[3].price);

      // Wave 3 extension
      if (wave3 > wave1 * 1.618) {
        confidence += 0.15;
      }

      // Wave 5 extension or equality
      if (Math.abs(wave5 - wave1) / wave1 < 0.1 || wave5 > wave1 * 1.618) {
        confidence += 0.1;
      }
    }

    return Math.min(0.95, confidence);
  }

  private determineCurrentWave(waves: SwingPoint[]): 1 | 2 | 3 | 4 | 5 {
    // Simplified current wave determination
    // In a real implementation, this would analyze the most recent price action
    return 5;
  }

  private identifyPivotPoints(data: PricePoint[]): PricePoint[] {
    const pivots: PricePoint[] = [];
    const lookback = 3;

    for (let i = lookback; i < data.length - lookback; i++) {
      const current = data[i];
      const isHighPivot = this.isLocalHigh(data, i, lookback);
      const isLowPivot = this.isLocalLow(data, i, lookback);

      if (isHighPivot) {
        pivots.push({
          ...current,
          high: current.high || current.price,
          price: current.high || current.price,
        });
      } else if (isLowPivot) {
        pivots.push({
          ...current,
          low: current.low || current.price,
          price: current.low || current.price,
        });
      }
    }

    return pivots;
  }

  private isLocalHigh(data: PricePoint[], index: number, lookback: number): boolean {
    const current = data[index];
    const currentHigh = current.high || current.price;

    for (let i = index - lookback; i <= index + lookback; i++) {
      if (i !== index && i >= 0 && i < data.length) {
        const compareHigh = data[i].high || data[i].price;
        if (compareHigh >= currentHigh) {
          return false;
        }
      }
    }
    return true;
  }

  private isLocalLow(data: PricePoint[], index: number, lookback: number): boolean {
    const current = data[index];
    const currentLow = current.low || current.price;

    for (let i = index - lookback; i <= index + lookback; i++) {
      if (i !== index && i >= 0 && i < data.length) {
        const compareLow = data[i].low || data[i].price;
        if (compareLow <= currentLow) {
          return false;
        }
      }
    }
    return true;
  }
}

interface SwingPoint {
  index: number;
  price: number;
  time: number;
  type: 'high' | 'low';
}

export const elliotWaveEngine = new ElliotWaveEngine();
