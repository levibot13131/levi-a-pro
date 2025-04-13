import { MarketEvent } from '@/types/marketInformation';

const marketEvents: MarketEvent[] = [
  {
    id: '1',
    title: 'פגישת הפד',
    description: 'ישיבת הפד לקביעת ריבית בארה"ב',
    date: '2023-11-15',
    category: 'כלכלי',
    impact: 'high',
    source: 'FederalReserve',
    time: '19:00',
    link: 'https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm',
    reminder: false,
    importance: 'high',
    type: 'economic',
    relatedAssets: ['usd', 'treasury'],
    expectedImpact: 'significant'
  },
  {
    id: '2',
    title: 'התחזית הכלכלית האירופאית',
    description: 'פרסום תחזית כלכלית רבעונית של האיחוד האירופי',
    date: '2023-11-20',
    category: 'כלכלי',
    impact: 'medium',
    source: 'ECB',
    time: '11:00',
    link: 'https://www.ecb.europa.eu/pub/projections/html/index.en.html',
    reminder: false,
    importance: 'medium',
    type: 'economic',
    relatedAssets: ['euro', 'eu-market'],
    expectedImpact: 'moderate'
  },
  {
    id: '3',
    title: 'חצייה של ביטקוין',
    description: 'אירוע חציית התגמול הבא של ביטקוין',
    date: '2024-04-10',
    category: 'קריפטו',
    impact: 'high',
    source: 'Bitcoin',
    time: '12:00',
    link: 'https://www.bitcoinblockhalf.com/',
    reminder: true,
    importance: 'high',
    type: 'crypto',
    relatedAssets: ['bitcoin', 'crypto-market'],
    expectedImpact: 'substantial'
  },
  {
    id: '4',
    title: 'שחרור דוחות רבעון אפל',
    description: 'פרסום דוחות כספיים של אפל לרבעון האחרון',
    date: '2023-12-01',
    category: 'מניות',
    impact: 'medium',
    source: 'Apple',
    time: '22:30',
    link: 'https://investor.apple.com/investor-relations/default.aspx',
    reminder: false,
    importance: 'medium',
    type: 'earnings',
    relatedAssets: ['aapl', 'tech-sector'],
    expectedImpact: 'moderate'
  },
  {
    id: '5',
    title: 'פרסום נתוני אבטלה',
    description: 'נתוני שוק העבודה החודשיים',
    date: '2023-11-10',
    category: 'כלכלי',
    impact: 'medium',
    source: 'BLS',
    time: '15:30',
    link: 'https://www.bls.gov/news.release/empsit.toc.htm',
    reminder: false,
    importance: 'medium',
    type: 'economic',
    relatedAssets: ['usd', 'us-stocks'],
    expectedImpact: 'variable'
  }
];

// קבלת כל אירועי השוק הקרובים
export const getUpcomingMarketEvents = (): MarketEvent[] => {
  return [...marketEvents];
};

// הגדרת תזכורת לאירוע
export const setEventReminder = (id: string, reminder: boolean): boolean => {
  const eventIndex = marketEvents.findIndex(event => event.id === id);
  if (eventIndex === -1) return false;
  
  marketEvents[eventIndex].reminder = reminder;
  return true;
};
