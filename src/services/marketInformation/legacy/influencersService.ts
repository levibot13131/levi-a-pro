
import { LegacyMarketInfluencer } from './types';

// Market Influencers
export const getMarketInfluencers = (): LegacyMarketInfluencer[] => {
  return [
    {
      id: 'influencer1',
      name: 'ג׳רום פאוול',
      position: 'יו״ר',
      company: 'הפדרל ריזרב',
      influence: 95,
      recentStatements: [
        'לא צפוי שינוי בריבית בקרוב',
        'האינפלציה עדיין גבוהה מהיעד',
        'שוק העבודה עדיין חזק'
      ],
      sentiment: 'neutral'
    },
    {
      id: 'influencer2',
      name: 'גארי גנסלר',
      position: 'יו״ר',
      company: 'רשות ניירות ערך האמריקאית (SEC)',
      influence: 85,
      recentStatements: [
        'הרגולציה על מטבעות קריפטוגרפיים תתהדק',
        'מטבעות קריפטוגרפיים רבים הם ניירות ערך',
        'יש צורך בהגנה על משקיעים בשוק הקריפטו'
      ],
      sentiment: 'bearish'
    },
    {
      id: 'influencer3',
      name: 'קתי ווד',
      position: 'מנכ״לית',
      company: 'ARK Invest',
      influence: 80,
      recentStatements: [
        'ביטקוין יגיע ל-$1.5 מיליון תוך עשור',
        'האינפלציה תיחלש בקרוב',
        'חברות חדשנות יובילו את השוק'
      ],
      sentiment: 'bullish'
    },
    {
      id: 'influencer4',
      name: 'מייקל סיילור',
      position: 'יו״ר',
      company: 'MicroStrategy',
      influence: 75,
      recentStatements: [
        'ביטקוין הוא נכס הבסיס של המאה ה-21',
        'החברה תמשיך לרכוש ביטקוין',
        'האסטרטגיה ארוכת טווח לא השתנתה'
      ],
      sentiment: 'bullish'
    }
  ];
};
