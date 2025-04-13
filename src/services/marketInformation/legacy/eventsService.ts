
import { LegacyMarketEvent } from './types';

// Market Events
export const getMarketEvents = (): LegacyMarketEvent[] => {
  return [
    {
      id: 'event1',
      title: 'ישיבת הפד',
      date: '2024-05-01',
      category: 'מאקרו',
      impact: 'high',
      description: 'החלטת ריבית של הבנק המרכזי האמריקאי (פד)',
      expectedVolatility: 'high',
      assetImpact: {
        stocks: 'high',
        crypto: 'medium',
        bonds: 'high'
      }
    },
    {
      id: 'event2',
      title: 'הנפקת ETF ביטקוין',
      date: '2024-04-15',
      category: 'קריפטו',
      impact: 'high',
      description: 'אישור והנפקת קרנות סל (ETF) לביטקוין',
      expectedVolatility: 'high',
      assetImpact: {
        stocks: 'low',
        crypto: 'very high',
        bonds: 'low'
      }
    },
    {
      id: 'event3',
      title: 'פרסום נתוני אינפלציה',
      date: '2024-04-10',
      category: 'מאקרו',
      impact: 'medium',
      description: 'פרסום מדד המחירים לצרכן בארה״ב',
      expectedVolatility: 'medium',
      assetImpact: {
        stocks: 'medium',
        crypto: 'medium',
        bonds: 'high'
      }
    },
    {
      id: 'event4',
      title: 'עדכון רשת אתריום',
      date: '2024-06-01',
      category: 'קריפטו',
      impact: 'medium',
      description: 'שדרוג משמעותי לרשת האתריום',
      expectedVolatility: 'medium',
      assetImpact: {
        stocks: 'low',
        crypto: 'high',
        bonds: 'low'
      }
    }
  ];
};
