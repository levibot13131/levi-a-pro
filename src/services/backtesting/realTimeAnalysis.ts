
import { AnalysisData } from '@/components/backtesting/analysis/types';

/**
 * Generate a comprehensive analysis for an asset
 */
export const generateComprehensiveAnalysis = (assetId: string, timeframe: string): AnalysisData => {
  return {
    historical: {
      keyEvents: [
        { event: 'השקת ETF', date: '2024-01-10', impact: 'חיובית' },
        { event: 'האלווינג', date: '2024-04-20', impact: 'חיובית' }
      ],
      trends: [
        { period: 'ארוך טווח', direction: 'עולה', strength: 'חזקה' },
        { period: 'בינוני', direction: 'יורד', strength: 'בינונית' }
      ],
      cyclicalPatterns: [
        { name: 'מחזור 4 שנים', description: 'מחזור הביטקוין של 4 שנים המבוסס על האלווינג' }
      ]
    },
    current: {
      marketCondition: 'שוק צידי עם נטייה לעליות',
      sentimentAnalysis: {
        overall: 'חיובית',
        social: 'חיובית מאוד',
        news: 'מעורבת',
        fearGreedIndex: 65
      },
      keyLevels: [
        { price: 52000, type: 'התנגדות', strength: 'חזקה' },
        { price: 48000, type: 'תמיכה', strength: 'בינונית' }
      ],
      technicalIndicators: [
        { name: 'ממוצע נע 200', value: 'מעל', interpretation: 'חיובי' },
        { name: 'RSI', value: 58, interpretation: 'ניטרלי' }
      ]
    },
    future: {
      shortTerm: {
        prediction: 'המשך מגמה עולה',
        confidence: 70,
        keyLevels: [
          { scenario: 'אופטימי', target: 55000, probability: 65 },
          { scenario: 'בסיסי', target: 52000, probability: 25 }
        ],
        significantEvents: [
          { event: 'הודעת ריבית', date: '2025-07-28', potentialImpact: 'גבוהה' }
        ]
      },
      longTerm: {
        trend: 'עולה',
        keyFactors: ['אימוץ מוסדי', 'רגולציה תומכת'],
        scenarios: [
          { description: 'מגמת עליות חזקה', probability: 60, timeframe: '6 חודשים', priceTarget: 65000 },
          { description: 'תיקון שוק', probability: 30, timeframe: '3 חודשים', priceTarget: 45000 }
        ]
      }
    }
  };
};
