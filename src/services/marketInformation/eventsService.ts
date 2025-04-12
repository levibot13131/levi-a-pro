
import { MarketEvent } from '@/types/marketInformation';

// מערך של אירועי שוק לדוגמה
const marketEvents: MarketEvent[] = [
  {
    id: '1',
    title: 'פגישת הפד',
    description: 'ישיבת הפד לקביעת ריבית בארה"ב',
    date: '2023-11-15',
    time: '19:00',
    category: 'כלכלי',
    impact: 'high',
    source: 'FederalReserve',
    hasReminder: false,
    link: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
    importance: 'high'
  },
  {
    id: '2',
    title: 'התחזית הכלכלית האירופאית',
    description: 'פרסום תחזית כלכלית רבעונית של האיחוד האירופי',
    date: '2023-11-20',
    time: '11:00',
    category: 'כלכלי',
    impact: 'medium',
    source: 'ECB',
    hasReminder: false,
    link: 'https://www.ecb.europa.eu/pub/projections/html/index.en.html',
    importance: 'medium'
  },
  {
    id: '3',
    title: 'חצייה של ביטקוין',
    description: 'אירוע חציית התגמול הבא של ביטקוין',
    date: '2024-04-10',
    time: '12:00',
    category: 'קריפטו',
    impact: 'high',
    source: 'Bitcoin',
    hasReminder: true,
    link: 'https://www.bitcoinblockhalf.com/',
    importance: 'high'
  },
  {
    id: '4',
    title: 'שחרור דוחות רבעון אפל',
    description: 'פרסום דוחות כספיים של אפל לרבעון האחרון',
    date: '2023-12-01',
    time: '22:30',
    category: 'מניות',
    impact: 'medium',
    source: 'Apple',
    hasReminder: false,
    link: 'https://investor.apple.com/investor-relations/default.aspx',
    importance: 'medium'
  },
  {
    id: '5',
    title: 'פרסום נתוני אבטלה',
    description: 'נתוני שוק העבודה החודשיים',
    date: '2023-11-10',
    time: '15:30',
    category: 'כלכלי',
    impact: 'medium',
    source: 'BLS',
    hasReminder: false,
    link: 'https://www.bls.gov/news.release/empsit.toc.htm',
    importance: 'medium'
  }
];

// קבלת כל אירועי השוק הקרובים
export const getUpcomingMarketEvents = (): MarketEvent[] => {
  return [...marketEvents];
};

// קבלת אירועים לפי קטגוריה
export const getUpcomingEvents = (timeRange?: string): MarketEvent[] => {
  if (!timeRange) return [...marketEvents];
  
  // Filter based on time range if needed
  const today = new Date();
  const endDate = new Date();
  endDate.setDate(today.getDate() + parseInt(timeRange));
  
  return marketEvents.filter(event => {
    const eventDate = new Date(event.date);
    return eventDate >= today && eventDate <= endDate;
  });
};

// הגדרת תזכורת לאירוע
export const setEventReminder = (id: string, hasReminder: boolean): boolean => {
  const eventIndex = marketEvents.findIndex(event => event.id === id);
  if (eventIndex === -1) return false;
  
  marketEvents[eventIndex].hasReminder = hasReminder;
  return true;
};
