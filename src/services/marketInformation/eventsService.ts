
import { MarketEvent } from '@/types/marketInformation';
import { toast } from 'sonner';

// Demo data for market events
const mockEvents: MarketEvent[] = [
  {
    id: '1',
    title: 'דוח מלאי נפט שבועי',
    date: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    importance: 'medium',
    category: 'economic',
    description: 'פרסום דוח מלאי הנפט השבועי על ידי המכון האמריקאי לנפט (API)',
    reminder: false,
    relatedAssets: ['oil', 'usoil'],
    expectedImpact: 'שוק הנפט עשוי להגיב בתנודתיות',
    source: 'API',
    type: 'economic'
  },
  {
    id: '2',
    title: 'החלטת ריבית הפד',
    date: new Date(Date.now() + 86400000 * 7).toISOString(), // 7 days from now
    importance: 'high',
    category: 'economic',
    description: 'הכרזה על החלטת ריבית הפד לחודש הקרוב',
    reminder: false,
    relatedAssets: ['usd', 'gold', 'sp500'],
    expectedImpact: 'השווקים צפויים להגיב בהתאם לציפיות לגבי העלאת/הורדת ריבית',
    source: 'Federal Reserve',
    type: 'economic'
  },
  {
    id: '3',
    title: 'הצגת דוחות רבעוניים של Apple',
    date: new Date(Date.now() + 86400000 * 14).toISOString(), // 14 days from now
    importance: 'high',
    category: 'earnings',
    description: 'Apple תפרסם את הדוחות הרבעוניים שלה לרבעון האחרון',
    reminder: false,
    relatedAssets: ['aapl', 'nasdaq'],
    expectedImpact: 'מניית אפל והמדדים הרלוונטיים צפויים לתנודתיות',
    source: 'Apple Inc.',
    type: 'company'
  },
  {
    id: '4',
    title: 'כנס מפתחים Bitcoin',
    date: new Date(Date.now() + 86400000 * 21).toISOString(), // 21 days from now
    importance: 'medium',
    category: 'crypto',
    description: 'כנס מפתחים עולמי של Bitcoin שבו יוצגו חידושים ועדכונים',
    reminder: false,
    relatedAssets: ['btc', 'crypto'],
    expectedImpact: 'עשוי להשפיע על מחיר ה-Bitcoin ומטבעות קריפטו נוספים',
    source: 'Bitcoin Foundation',
    type: 'conference'
  },
  {
    id: '5',
    title: 'הצהרת נשיא הבנק המרכזי של האיחוד האירופאי',
    date: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days from now
    importance: 'high',
    category: 'economic',
    description: 'נאום של נשיאת הבנק המרכזי האירופאי לגבי מדיניות מוניטרית',
    reminder: false,
    relatedAssets: ['eur', 'eurusd', 'dax'],
    expectedImpact: 'עשוי להשפיע על שער האירו והשווקים האירופאיים',
    source: 'ECB',
    type: 'economic'
  }
];

// Get all upcoming market events
export const getUpcomingMarketEvents = (): MarketEvent[] => {
  return [...mockEvents];
};

// Get upcoming events within a specified number of days
export const getUpcomingEvents = (days: number = 30): MarketEvent[] => {
  const now = new Date();
  const futureDate = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return mockEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate <= futureDate && eventDate >= now;
  });
};

// Set a reminder for an event
export const setEventReminder = (eventId: string, reminderTime: number): boolean => {
  const eventIndex = mockEvents.findIndex(event => event.id === eventId);
  if (eventIndex === -1) return false;
  
  mockEvents[eventIndex].reminder = !mockEvents[eventIndex].reminder;
  
  if (mockEvents[eventIndex].reminder) {
    toast.success('תזכורת הוגדרה בהצלחה');
  } else {
    toast.info('תזכורת בוטלה בהצלחה');
  }
  
  return true;
};

