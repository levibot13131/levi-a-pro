
import { SignalMemoryAI } from './signalMemoryAI';
import { SignalExplanationAI } from './signalExplanationAI';
import { CorrelationEngine } from './correlationEngine';
import { TimeframeConfirmationAI } from './timeframeConfirmationAI';

export interface EnhancedSignalResult {
  shouldSignal: boolean;
  leviScore: number;
  explanation: any;
  correlationReport: string;
  timeframeReport: string;
  confidence: number;
  reasoning: string[];
}

export class EnhancedSignalProcessor {
  static async processSignal(
    symbol: string,
    action: 'BUY' | 'SELL',
    price: number,
    marketData: any,
    sentimentData: any,
    strategy: string = 'enhanced-ai'
  ): Promise<EnhancedSignalResult> {
    console.log(`🧠 Enhanced AI processing signal for ${symbol}...`);
    
    // Get historical performance and calculate LeviScore
    const performance = await SignalMemoryAI.getHistoricalPerformance(symbol, strategy, '15m');
    const baseConfidence = 75; // Starting confidence
    const leviScore = await SignalMemoryAI.getLeviScore(symbol, strategy, baseConfidence, marketData);
    
    console.log(`📊 LeviScore calculated: ${leviScore}% (base: ${baseConfidence}%, performance boost: ${performance.hitRate.toFixed(0)}%)`);
    
    // Analyze correlations (News-Onchain-Price triangulation)
    const correlation = await CorrelationEngine.analyzeTriangulation(symbol, marketData, sentimentData);
    const correlationReport = CorrelationEngine.generateCorrelationReport(correlation);
    
    console.log(`🔗 Correlation analysis: ${correlationReport}`);
    
    // Multi-timeframe confirmation
    const timeframeAnalysis = TimeframeConfirmationAI.analyzeMultiTimeframes(marketData);
    const timeframeReport = TimeframeConfirmationAI.generateTimeframeReport(timeframeAnalysis);
    
    console.log(`⏰ Timeframe analysis: ${timeframeReport}`);
    
    // Calculate final confidence
    let finalConfidence = leviScore;
    
    // Apply correlation boost
    if (correlation.correlationScore > 80) finalConfidence += 10;
    else if (correlation.correlationScore > 60) finalConfidence += 5;
    else if (correlation.correlationScore < 40) finalConfidence -= 10;
    
    // Apply timeframe alignment boost
    if (timeframeAnalysis.alignment > 85) finalConfidence += 8;
    else if (timeframeAnalysis.alignment > 70) finalConfidence += 4;
    else if (timeframeAnalysis.alignment < 50) finalConfidence -= 8;
    
    // Cap confidence at 100
    finalConfidence = Math.min(100, finalConfidence);
    
    // Decision logic - require high standards
    const shouldSignal = 
      finalConfidence >= 80 && // High confidence required
      correlation.correlationScore >= 60 && // At least 2/3 confirmations
      timeframeAnalysis.alignment >= 70 && // Strong timeframe alignment
      leviScore >= 75; // Good historical performance
    
    const reasoning = [];
    reasoning.push(`LeviScore: ${leviScore}% (ביצועים היסטוריים: ${performance.hitRate.toFixed(0)}%)`);
    reasoning.push(`אישור משולש: ${correlation.correlationScore.toFixed(0)}%`);
    reasoning.push(`יישור זמנים: ${timeframeAnalysis.alignment.toFixed(0)}%`);
    reasoning.push(`ביטחון סופי: ${finalConfidence}%`);
    
    if (shouldSignal) {
      reasoning.push(`✅ כל הקריטריונים המתקדמים מתקיימים`);
    } else {
      if (finalConfidence < 80) reasoning.push(`❌ ביטחון נמוך מ-80%`);
      if (correlation.correlationScore < 60) reasoning.push(`❌ אישור משולש חלש`);
      if (timeframeAnalysis.alignment < 70) reasoning.push(`❌ יישור זמנים לא מספק`);
      if (leviScore < 75) reasoning.push(`❌ LeviScore נמוך מ-75%`);
    }
    
    // Generate explanation
    const explanation = SignalExplanationAI.generateExplanation(
      { action, price, confidence: finalConfidence, riskRewardRatio: 2.1 },
      marketData,
      performance
    );
    
    console.log(`🎯 Enhanced signal decision: ${shouldSignal ? 'APPROVED' : 'REJECTED'} (${finalConfidence}%)`);
    
    return {
      shouldSignal,
      leviScore,
      explanation,
      correlationReport,
      timeframeReport,
      confidence: finalConfidence,
      reasoning
    };
  }
}
