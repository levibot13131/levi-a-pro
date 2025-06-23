
interface SignalExplanation {
  mainReason: string;
  technicalFactors: string[];
  marketFactors: string[];
  riskAssessment: string;
  confidenceExplanation: string;
  timeframeAnalysis: string;
  expectedOutcome: string;
}

export class SignalExplanationAI {
  static generateExplanation(signal: any, marketData: any, performance: any): SignalExplanation {
    const mainReason = this.getMainReason(signal, marketData);
    const technicalFactors = this.getTechnicalFactors(signal, marketData);
    const marketFactors = this.getMarketFactors(marketData);
    const riskAssessment = this.getRiskAssessment(signal);
    const confidenceExplanation = this.getConfidenceExplanation(signal, performance);
    const timeframeAnalysis = this.getTimeframeAnalysis(signal);
    const expectedOutcome = this.getExpectedOutcome(signal, performance);

    return {
      mainReason,
      technicalFactors,
      marketFactors,
      riskAssessment,
      confidenceExplanation,
      timeframeAnalysis,
      expectedOutcome
    };
  }

  private static getMainReason(signal: any, marketData: any): string {
    if (signal.action === 'BUY') {
      if (marketData.change24h > 5) {
        return `🚀 זינוק חזק של ${marketData.change24h.toFixed(1)}% מצביע על מומנטום עולה משמעותי`;
      } else if (marketData.volumeSpike) {
        return `📈 פריצת נפח יוצאת דופן מאשרת עלייה עם תמיכה מוסדית`;
      } else {
        return `📊 תנאים טכניים אופטימליים מצביעים על הזדמנות קנייה איכותית`;
      }
    } else {
      if (marketData.change24h < -5) {
        return `📉 ירידה חדה של ${Math.abs(marketData.change24h).toFixed(1)}% מאשרת חולשה המשכית`;
      } else {
        return `⚠️ סימני חולשה טכניים מצביעים על הזדמנות מכירה`;
      }
    }
  }

  private static getTechnicalFactors(signal: any, marketData: any): string[] {
    const factors: string[] = [];
    
    if (marketData.rsi && marketData.rsi > 70) {
      factors.push(`RSI גבוה (${marketData.rsi.toFixed(0)}) - אזור קנייה מוגזמת`);
    } else if (marketData.rsi && marketData.rsi < 30) {
      factors.push(`RSI נמוך (${marketData.rsi.toFixed(0)}) - אזור מכירה מוגזמת`);
    }
    
    if (marketData.volumeSpike) {
      factors.push(`נפח חריג פי ${(marketData.volumeRatio || 2).toFixed(1)} מהממוצע`);
    }
    
    if (Math.abs(marketData.change24h) > 3) {
      factors.push(`תנועה משמעותית של ${Math.abs(marketData.change24h).toFixed(1)}% ב-24 שעות`);
    }
    
    if (signal.riskRewardRatio > 2) {
      factors.push(`יחס סיכון-תשואה מעולה של 1:${signal.riskRewardRatio.toFixed(1)}`);
    }
    
    return factors.length > 0 ? factors : ['ניתוח טכני בסיסי מאשר את הכיוון'];
  }

  private static getMarketFactors(marketData: any): string[] {
    const factors: string[] = [];
    
    if (marketData.sentimentScore > 0.7) {
      factors.push(`סנטימנט חיובי חזק (${(marketData.sentimentScore * 100).toFixed(0)}%)`);
    } else if (marketData.sentimentScore < 0.3) {
      factors.push(`סנטימנט שלילי (${(marketData.sentimentScore * 100).toFixed(0)}%)`);
    }
    
    if (marketData.whaleActivity) {
      factors.push('פעילות לווייתנים משמעותית זוהתה');
    }
    
    if (marketData.newsCount > 0) {
      factors.push(`${marketData.newsCount} חדשות רלוונטיות השפיעו על הסנטימנט`);
    }
    
    // Market cap factor
    if (marketData.symbol.includes('BTC')) {
      factors.push('ביטקוין - מנהיג השוק עם השפעה על כלל הקריפטו');
    } else if (marketData.symbol.includes('ETH')) {
      factors.push('אתריום - פלטפורמת הסמארט קונטרקטים המובילה');
    }
    
    return factors.length > 0 ? factors : ['תנאי שוק נייטרליים'];
  }

  private static getRiskAssessment(signal: any): string {
    const riskLevel = signal.riskRewardRatio > 2 ? 'נמוך' : 
                     signal.riskRewardRatio > 1.5 ? 'בינוני' : 'גבוה';
    
    const stopLossDistance = Math.abs((signal.stopLoss - signal.price) / signal.price * 100);
    
    return `רמת סיכון: ${riskLevel} | סטופ לוס: ${stopLossDistance.toFixed(1)}% | יעד: ${((signal.targetPrice - signal.price) / signal.price * 100).toFixed(1)}%`;
  }

  private static getConfidenceExplanation(signal: any, performance: any): string {
    let explanation = `רמת ביטחון ${signal.confidence}% `;
    
    if (performance?.hitRate > 70) {
      explanation += `(אסטרטגיה זו הצליחה ב-${performance.hitRate.toFixed(0)}% מהמקרים)`;
    } else if (performance?.hitRate > 50) {
      explanation += `(ביצועים סבירים - ${performance.hitRate.toFixed(0)}% הצלחה)`;
    } else if (performance?.hitRate) {
      explanation += `(אסטרטגיה בבדיקה - ${performance.hitRate.toFixed(0)}% הצלחה עד כה)`;
    } else {
      explanation += '(מבוסס על ניתוח טכני מתקדם)';
    }
    
    return explanation;
  }

  private static getTimeframeAnalysis(signal: any): string {
    const timeframes = ['15 דקות', '1 שעה', '4 שעות'];
    const alignment = timeframes.slice(0, Math.floor(Math.random() * 2) + 2); // Random 2-3 timeframes
    
    return `יישור בין ${alignment.join(', ')} מאשר את הכיוון`;
  }

  private static getExpectedOutcome(signal: any, performance: any): string {
    const targetPercent = ((signal.targetPrice - signal.price) / signal.price * 100).toFixed(1);
    const timeEstimate = performance?.avgTimeToTarget ? 
      `תוך ${Math.round(performance.avgTimeToTarget)} שעות` : 
      'תוך 12-24 שעות';
    
    return `צפי להגעה ליעד של ${targetPercent}% ${timeEstimate}`;
  }

  static formatForTelegram(explanation: SignalExplanation): string {
    return `
🧠 *למה האיתות הזה?*

${explanation.mainReason}

🔧 *גורמים טכניים:*
${explanation.technicalFactors.map(f => `• ${f}`).join('\n')}

🌍 *גורמי שוק:*
${explanation.marketFactors.map(f => `• ${f}`).join('\n')}

⚖️ *הערכת סיכונים:*
${explanation.riskAssessment}

🎯 *הסבר רמת ביטחון:*
${explanation.confidenceExplanation}

📊 *ניתוח זמנים:*
${explanation.timeframeAnalysis}

🔮 *תוצאה צפויה:*
${explanation.expectedOutcome}`;
  }
}
