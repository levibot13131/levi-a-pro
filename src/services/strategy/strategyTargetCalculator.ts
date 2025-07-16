import { MarketData } from '@/types/trading';

export interface TargetCalculation {
  strategy: string;
  targets: {
    prePrimary?: number;      // מטרה טרום ראשונית
    primary: number;          // מטרה ראשונה
    secondary?: number;       // מטרה שנייה
    main: number;            // מטרה עיקרית
    extended?: number;        // מטרה מורחבת
  };
  stopLoss: number;
  reasoning: string[];
  riskRewardRatio: number;
  managementRules: string[];
}

interface FibonacciLevels {
  level236: number;
  level382: number;
  level500: number;
  level618: number;
  level786: number;
  level1000: number;
  level1272: number;
  level1618: number;
}

export class StrategyTargetCalculator {
  
  /**
   * חישוב מטרות לשיטה האישית של אלמוג
   */
  static calculatePersonalMethodTargets(
    symbol: string, 
    action: 'BUY' | 'SELL', 
    entryPrice: number, 
    marketData: MarketData
  ): TargetCalculation {
    const reasoning: string[] = [];
    const managementRules: string[] = [];
    
    // רמות פיבונאצ'י בסיסיות
    const fibLevels = this.calculateFibonacciLevels(entryPrice, action, marketData);
    
    let targets: any = {};
    let stopLoss: number;
    
    if (action === 'BUY') {
      // שיטה אישית - מטרות בהתבסס על לחץ רגשי ופריצות
      targets.prePrimary = entryPrice * 1.008;      // 0.8% - יציאה חלקית מהירה
      targets.primary = entryPrice * 1.015;         // 1.5% - מטרה ראשונה
      targets.secondary = fibLevels.level382;       // פיבו 38.2%
      targets.main = fibLevels.level618;            // פיבו 61.8% - מטרה עיקרית
      targets.extended = fibLevels.level1000;       // פיבו 100% - למקרי פריצה חזקה
      
      stopLoss = entryPrice * 0.985;                // 1.5% - סטופ הדוק
      
      reasoning.push('• שיטה אישית: יציאה מהירה ב-0.8% לכיסוי עמלות');
      reasoning.push('• פיבונאצ׳י 38.2% כמטרה שנייה');
      reasoning.push('• פיבונאצ׳י 61.8% כמטרה עיקרית');
      reasoning.push('• אסטרטגיית לחץ רגשי - יציאה מדורגת');
      
      managementRules.push('יציאה של 25% במטרה הטרום ראשונית');
      managementRules.push('יציאה של 35% במטרה הראשונה');
      managementRules.push('יציאה של 30% במטרה השנייה');
      managementRules.push('החזקת 10% למטרה העיקרית');
      
    } else { // SELL
      targets.prePrimary = entryPrice * 0.992;      // 0.8% - יציאה חלקית מהירה
      targets.primary = entryPrice * 0.985;         // 1.5% - מטרה ראשונה
      targets.secondary = fibLevels.level382;       // פיבו 38.2%
      targets.main = fibLevels.level618;            // פיבו 61.8% - מטרה עיקרית
      targets.extended = fibLevels.level1000;       // פיבו 100%
      
      stopLoss = entryPrice * 1.015;                // 1.5% - סטופ הדוק
      
      reasoning.push('• שורט אגרסיבי: יציאה מהירה ב-0.8%');
      reasoning.push('• פיבונאצ׳י 38.2% למטרה שנייה');
      reasoning.push('• פיבונאצ׳י 61.8% למטרה עיקרית');
      reasoning.push('• ניהול סיכונים הדוק בשורט');
    }
    
    return {
      strategy: 'almog-personal-method',
      targets,
      stopLoss,
      reasoning,
      riskRewardRatio: Math.abs(targets.main - entryPrice) / Math.abs(entryPrice - stopLoss),
      managementRules
    };
  }

  /**
   * חישוב מטרות לשיטת Wyckoff
   */
  static calculateWyckoffTargets(
    symbol: string, 
    action: 'BUY' | 'SELL', 
    entryPrice: number, 
    marketData: MarketData,
    wyckoffPhase?: string
  ): TargetCalculation {
    const reasoning: string[] = [];
    const managementRules: string[] = [];
    
    let targets: any = {};
    let stopLoss: number;
    
    // Wyckoff - מבוסס על שלבי השוק וכמויות
    if (action === 'BUY') {
      // שלב צבירה - מטרות שמרניות יותר
      if (wyckoffPhase === 'accumulation') {
        targets.primary = entryPrice * 1.02;         // 2% - יציאה ראשונה
        targets.secondary = entryPrice * 1.035;      // 3.5% - מטרה שנייה
        targets.main = entryPrice * 1.055;           // 5.5% - מטרה עיקרית
        targets.extended = entryPrice * 1.08;        // 8% - מטרה מורחבת
        
        stopLoss = entryPrice * 0.975;               // 2.5% - סטופ רחב יותר
        
        reasoning.push('• Wyckoff צבירה: מטרות שמרניות');
        reasoning.push('• יציאה מדורגת לפי כמויות המסחר');
        reasoning.push('• הימנעות מאזורי התנגדות חזקים');
        
      } else if (wyckoffPhase === 'markup') {
        // שלב עליה - מטרות אגרסיביות יותר
        targets.primary = entryPrice * 1.025;        // 2.5%
        targets.secondary = entryPrice * 1.05;       // 5%
        targets.main = entryPrice * 1.08;            // 8%
        targets.extended = entryPrice * 1.12;        // 12%
        
        stopLoss = entryPrice * 0.98;                // 2% - סטופ הדוק
        
        reasoning.push('• Wyckoff עליה: מטרות אגרסיביות');
        reasoning.push('• ניצול כוח השוק העולה');
        reasoning.push('• מעקב אחר נפח המסחר לאישור');
      }
      
      managementRules.push('מעקב אחר נפח המסחר בכל רמה');
      managementRules.push('יציאה באזורי התנגדות Wyckoff');
      managementRules.push('התאמת מטרות לפי שלב השוק');
      
    } else { // SELL
      if (wyckoffPhase === 'distribution') {
        targets.primary = entryPrice * 0.975;        // 2.5%
        targets.secondary = entryPrice * 0.95;       // 5%
        targets.main = entryPrice * 0.92;            // 8%
        targets.extended = entryPrice * 0.88;        // 12%
        
        stopLoss = entryPrice * 1.02;                // 2%
        
        reasoning.push('• Wyckoff הפצה: מיקוד בירידה מתואמת');
        reasoning.push('• זיהוי חולשה במבנה השוק');
        reasoning.push('• יציאה באזורי תמיכה מרכזיים');
      }
    }
    
    return {
      strategy: 'wyckoff-method',
      targets,
      stopLoss,
      reasoning,
      riskRewardRatio: Math.abs(targets.main - entryPrice) / Math.abs(entryPrice - stopLoss),
      managementRules
    };
  }

  /**
   * חישוב מטרות לשיטת SMC (Smart Money Concepts)
   */
  static calculateSMCTargets(
    symbol: string, 
    action: 'BUY' | 'SELL', 
    entryPrice: number, 
    marketData: MarketData
  ): TargetCalculation {
    const reasoning: string[] = [];
    const managementRules: string[] = [];
    
    let targets: any = {};
    let stopLoss: number;
    
    // SMC - מבוסס על הכסף החכם ומבני שוק
    if (action === 'BUY') {
      // זיהוי Order Blocks ו-Fair Value Gaps
      targets.primary = entryPrice * 1.018;         // 1.8% - גאפ ראשון
      targets.secondary = entryPrice * 1.032;       // 3.2% - Order Block
      targets.main = entryPrice * 1.048;            // 4.8% - Liquidity Pool
      targets.extended = entryPrice * 1.065;        // 6.5% - External Liquidity
      
      stopLoss = entryPrice * 0.982;                // 1.8% - מתחת ל-Order Block
      
      reasoning.push('• SMC: מיקוד ב-Fair Value Gaps');
      reasoning.push('• יעד ראשון בגאפ הקרוב');
      reasoning.push('• יעד עיקרי ב-Liquidity Pool');
      reasoning.push('• ניהול לפי מבני הכסף החכם');
      
      managementRules.push('יציאה חלקית בכל Fair Value Gap');
      managementRules.push('מעקב אחר הפרה של Order Blocks');
      managementRules.push('התאמת סטופ לפי מבני SMC');
      
    } else { // SELL
      targets.primary = entryPrice * 0.982;         // 1.8%
      targets.secondary = entryPrice * 0.968;       // 3.2%
      targets.main = entryPrice * 0.952;            // 4.8%
      targets.extended = entryPrice * 0.935;        // 6.5%
      
      stopLoss = entryPrice * 1.018;                // 1.8%
      
      reasoning.push('• SMC שורט: מיקוד בחולשת מבנה');
      reasoning.push('• יעד ראשון בגאפ הירידה');
      reasoning.push('• יעד עיקרי בנזילות התחתונה');
    }
    
    return {
      strategy: 'smc-trading',
      targets,
      stopLoss,
      reasoning,
      riskRewardRatio: Math.abs(targets.main - entryPrice) / Math.abs(entryPrice - stopLoss),
      managementRules
    };
  }

  /**
   * חישוב מטרות לניתוח טכני רב-מסגרות זמן
   */
  static calculateMultiTimeframeTargets(
    symbol: string, 
    action: 'BUY' | 'SELL', 
    entryPrice: number, 
    marketData: MarketData
  ): TargetCalculation {
    const reasoning: string[] = [];
    const managementRules: string[] = [];
    
    let targets: any = {};
    let stopLoss: number;
    
    // רב-מסגרות זמן - מבוסס על התאמת מגמות
    if (action === 'BUY') {
      targets.primary = entryPrice * 1.012;         // 1.2% - מסגרת קצרה
      targets.secondary = entryPrice * 1.025;       // 2.5% - מסגרת בינונית
      targets.main = entryPrice * 1.04;             // 4% - מסגרת ארוכה
      targets.extended = entryPrice * 1.058;        // 5.8% - מסגרת יומית
      
      stopLoss = entryPrice * 0.988;                // 1.2%
      
      reasoning.push('• רב-מסגרות: התאמת כל המגמות');
      reasoning.push('• יעד ראשון לפי מסגרת 15M');
      reasoning.push('• יעד עיקרי לפי מסגרת 4H');
      reasoning.push('• יעד מורחב לפי מסגרת יומית');
      
      managementRules.push('מעקב אחר שמירת מגמה בכל מסגרת');
      managementRules.push('יציאה אם התהפכה מגמה עיקרית');
      managementRules.push('התאמת מטרות לפי כוח המגמה');
      
    } else { // SELL
      targets.primary = entryPrice * 0.988;         // 1.2%
      targets.secondary = entryPrice * 0.975;       // 2.5%
      targets.main = entryPrice * 0.96;             // 4%
      targets.extended = entryPrice * 0.942;        // 5.8%
      
      stopLoss = entryPrice * 1.012;                // 1.2%
    }
    
    return {
      strategy: 'multi-timeframe-ai',
      targets,
      stopLoss,
      reasoning,
      riskRewardRatio: Math.abs(targets.main - entryPrice) / Math.abs(entryPrice - stopLoss),
      managementRules
    };
  }

  /**
   * חישוב מטרות כללי לניתוח טכני בסיסי
   */
  static calculateTechnicalAnalysisTargets(
    symbol: string, 
    action: 'BUY' | 'SELL', 
    entryPrice: number, 
    marketData: MarketData
  ): TargetCalculation {
    const reasoning: string[] = [];
    const managementRules: string[] = [];
    
    let targets: any = {};
    let stopLoss: number;
    
    // ניתוח טכני בסיסי - RSI, MACD, EMA
    if (action === 'BUY') {
      targets.primary = entryPrice * 1.02;          // 2%
      targets.secondary = entryPrice * 1.035;       // 3.5%
      targets.main = entryPrice * 1.05;             // 5%
      
      stopLoss = entryPrice * 0.975;                // 2.5%
      
      reasoning.push('• ניתוח טכני: RSI מתחת 30');
      reasoning.push('• MACD מראה התכנסות חיובית');
      reasoning.push('• מחיר מעל EMA 21');
      
      managementRules.push('יציאה אם RSI מעל 70');
      managementRules.push('מעקב אחר MACD לחיזוק מגמה');
      
    } else { // SELL
      targets.primary = entryPrice * 0.98;          // 2%
      targets.secondary = entryPrice * 0.965;       // 3.5%
      targets.main = entryPrice * 0.95;             // 5%
      
      stopLoss = entryPrice * 1.025;                // 2.5%
    }
    
    return {
      strategy: 'technical-analysis',
      targets,
      stopLoss,
      reasoning,
      riskRewardRatio: Math.abs(targets.main - entryPrice) / Math.abs(entryPrice - stopLoss),
      managementRules
    };
  }

  /**
   * חישוב רמות פיבונאצ'י
   */
  private static calculateFibonacciLevels(
    entryPrice: number, 
    action: 'BUY' | 'SELL', 
    marketData: MarketData
  ): FibonacciLevels {
    const baseMove = entryPrice * 0.1; // 10% תנועה בסיסית
    
    if (action === 'BUY') {
      return {
        level236: entryPrice + (baseMove * 0.236),
        level382: entryPrice + (baseMove * 0.382),
        level500: entryPrice + (baseMove * 0.5),
        level618: entryPrice + (baseMove * 0.618),
        level786: entryPrice + (baseMove * 0.786),
        level1000: entryPrice + baseMove,
        level1272: entryPrice + (baseMove * 1.272),
        level1618: entryPrice + (baseMove * 1.618)
      };
    } else {
      return {
        level236: entryPrice - (baseMove * 0.236),
        level382: entryPrice - (baseMove * 0.382),
        level500: entryPrice - (baseMove * 0.5),
        level618: entryPrice - (baseMove * 0.618),
        level786: entryPrice - (baseMove * 0.786),
        level1000: entryPrice - baseMove,
        level1272: entryPrice - (baseMove * 1.272),
        level1618: entryPrice - (baseMove * 1.618)
      };
    }
  }

  /**
   * בחירת אסטרטגיית המטרות הנכונה לפי השיטה
   */
  static calculateTargetsByStrategy(
    strategy: string,
    symbol: string,
    action: 'BUY' | 'SELL',
    entryPrice: number,
    marketData: MarketData,
    additionalParams?: any
  ): TargetCalculation {
    
    switch (strategy) {
      case 'almog-personal-method':
        return this.calculatePersonalMethodTargets(symbol, action, entryPrice, marketData);
        
      case 'wyckoff-method':
      case 'wyckoff-strategy':
        return this.calculateWyckoffTargets(symbol, action, entryPrice, marketData, additionalParams?.wyckoffPhase);
        
      case 'smc-trading':
      case 'smc-strategy':
        return this.calculateSMCTargets(symbol, action, entryPrice, marketData);
        
      case 'multi-timeframe-ai':
        return this.calculateMultiTimeframeTargets(symbol, action, entryPrice, marketData);
        
      case 'technical-analysis':
      default:
        return this.calculateTechnicalAnalysisTargets(symbol, action, entryPrice, marketData);
    }
  }
}

export const strategyTargetCalculator = StrategyTargetCalculator;