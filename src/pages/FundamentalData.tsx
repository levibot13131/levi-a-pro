import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Newspaper, TrendingUp, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getAssets } from '@/services/mockDataService';
import { 
  FinancialDataSource, 
  MarketInfluencer, 
  MarketEvent 
} from '@/types/marketInformation';

const FundamentalData = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('bitcoin');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  const selectedAsset = assets?.find(asset => asset.id === selectedAssetId);
  
  // Mock fundamental data
  const fundamentalData = {
    marketCap: '$860.5B',
    tradingVolume24h: '$42.8B',
    circulatingSupply: '19,425,000 BTC',
    maxSupply: '21,000,000 BTC',
    currentHashrate: '512 EH/s',
    activeAddresses: '1,045,000',
    transactions24h: '284,500',
    averageFee: '$3.42',
    networkDifficulty: '67.9T',
    miningReward: '6.25 BTC',
    nextHalving: '2024-04-15'
  };
  
  // Mock financial data sources that match the correct type
  const financialDataSources: FinancialDataSource[] = [
    {
      id: 'source1',
      name: 'Glassnode',
      description: 'מספק מידע מקיף על-פי ניתוח שרשרת הבלוקים של ביטקוין ואתריום',
      url: 'https://glassnode.com',
      type: 'analytics',
      category: 'data',
      rating: 95,
      platform: 'web',
      reliability: 95,
      accessType: 'premium',
      languages: ['English', 'Hebrew'],
      updateFrequency: 'Daily',
      focused: true
    },
    {
      id: 'source2',
      name: 'CoinMetrics',
      description: 'מתמחה בניתוח זרימת כספים בין בורסות וארנקים מוסדיים',
      url: 'https://coinmetrics.io',
      type: 'data',
      category: 'data',
      rating: 92,
      platform: 'web',
      reliability: 92,
      accessType: 'freemium',
      languages: ['English'],
      updateFrequency: 'Real-time',
      focused: false
    },
    {
      id: 'source3',
      name: 'The Block',
      description: 'אתר חדשות ומחקר מוביל בתחום הקריפטו עם דגש על דיוק ואמינות',
      url: 'https://www.theblockcrypto.com',
      type: 'news',
      category: 'news',
      rating: 90,
      platform: 'web',
      reliability: 90,
      accessType: 'freemium',
      languages: ['English'],
      updateFrequency: 'Hourly',
      focused: true
    },
    {
      id: 'source4',
      name: 'Bank of America',
      description: 'דוחות אנליסטים מהבנק עם דגש על השפעת הקריפטו על שווקים מסורתיים',
      url: 'https://www.bankofamerica.com',
      type: 'financial-institution',
      category: 'analysis',
      rating: 88,
      platform: 'institutional',
      reliability: 88,
      accessType: 'premium',
      languages: ['English', 'Spanish'],
      updateFrequency: 'Weekly',
      focused: false
    },
    {
      id: 'source5',
      name: 'ארקייה ריסרץ׳',
      description: 'מחקרים מקיפים לגבי פוטנציאל הטכנולוגי והעסקי של פרויקטים בתחום',
      url: 'https://www.arkresearch.io',
      type: 'research',
      category: 'analysis',
      rating: 93,
      platform: 'web',
      reliability: 93,
      accessType: 'premium',
      languages: ['English', 'Hebrew'],
      updateFrequency: 'Monthly',
      focused: true
    }
  ];
  
  // Mock market events that match the correct type
  const marketEvents: MarketEvent[] = [
    {
      id: 'event1',
      title: 'החלטת ריבית של הפד',
      description: 'החלטת ריבית של הבנק הפדרלי האמריקאי. צפי להשארת הריבית ללא שינוי על 5.5%.',
      date: '2024-04-30',
      category: 'economic',
      importance: 'high',
      relatedAssets: ['bitcoin', 'ethereum', 'stocks'],
      expectedImpact: 'variable',
      source: 'Federal Reserve',
      reminder: false,
      type: 'economic'
    },
    {
      id: 'event2',
      title: 'הנפקת ETF ביטקוין בגרמניה',
      description: 'השקת קרנות ETF מבוססות ביטקוין בבורסה הגרמנית. צפויה להגדיל את החשיפה המוסדית באירופה.',
      date: '2024-04-22',
      category: 'regulatory',
      importance: 'medium',
      relatedAssets: ['bitcoin'],
      expectedImpact: 'positive',
      source: 'German Stock Exchange',
      reminder: true,
      type: 'regulatory'
    },
    {
      id: 'event3',
      title: 'דוחות רבעוניים אפל',
      description: 'פרסום דוחות הרבעון השני של אפל לשנת 2024. צפי: הכנסות של $96.5 מיליארד.',
      date: '2024-05-02',
      category: 'earnings',
      importance: 'high',
      relatedAssets: ['stocks'],
      expectedImpact: 'variable',
      source: 'Apple Inc.',
      reminder: false,
      type: 'earnings'
    },
    {
      id: 'event4',
      title: 'עדכון רשת אתריום',
      description: 'עדכון רשת משמעותי לאתריום שיפחית עמלות וישפר את ביצועי הרשת.',
      date: '2024-06-12',
      category: 'other',
      importance: 'high',
      relatedAssets: ['ethereum'],
      expectedImpact: 'positive',
      source: 'Ethereum Foundation',
      reminder: true,
      type: 'network-update'
    }
  ];
  
  // Mock reports
  const reports = [
    {
      id: 'report1',
      title: 'תחזית שוק הקריפטו ל-2024',
      author: 'מורגן סטנלי',
      date: '2024-04-01',
      category: 'market',
      summary: 'ניתוח מקיף של מגמות השוק הצפויות לשנת 2024, כולל התייחסות להשפעות המאקרו על נכסים דיגיטליים.',
      pageCount: 42,
      keyPoints: [
        'ביקוש מוסדי צפוי לגדול ב-150% במהלך 2024',
        'רגולציה בריאה צפויה בשווקים המובילים',
        'אימוץ מטבעות דיגיטליים צפוי להתרחב למדינות נוספות'
      ]
    },
    {
      id: 'report2',
      title: 'ניתוח פונדמנטלי - רשת הלייטנינג',
      author: 'ARK Invest',
      date: '2024-03-15',
      category: 'technology',
      summary: 'סקירה של התפתחות רשת הלייטנינג והשפעתה על יכולת השימוש בביטקוין כאמצעי תשלום יומיומי.',
      pageCount: 28,
      keyPoints: [
        'גידול של 215% בנפח העסקאות ברשת הלייטנינג',
        'אימוץ על ידי עסקים קטנים בגלל עמלות נמוכות',
        'פתרונות חדשים לשיפור חווית המשתמש בתשלומים'
      ]
    },
    {
      id: 'report3',
      title: 'השפעת הריביות הגבוהות על שוק הקריפטו',
      author: 'Goldman Sachs',
      date: '2024-02-28',
      category: 'economic',
      summary: 'ניתוח הקורלציה בין מדיניות הריבית של הבנקים המרכזיים ותנועות המחיר בשוק הקריפטו.',
      pageCount: 36,
      keyPoints: [
        'קורלציה שלילית בין העלאות ריבית לביצועי ביטקוין',
        'הפחתות ריבית צפויות במחצית השנייה של 2024',
        'תרחישים אפשריים לאור שינויי מדיניות מוניטרית'
      ]
    }
  ];
  
  // Helper functions for styling
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'data':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">נתונים</Badge>;
      case 'news':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">חדשות</Badge>;
      case 'analysis':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">אנליזה</Badge>;
      case 'social':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">חברתי</Badge>;
      case 'economic':
        return <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300">כלכלי</Badge>;
      case 'regulatory':
        return <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300">רגולציה</Badge>;
      case 'technology':
        return <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300">טכנולוגי</Badge>;
      case 'market':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">שוק</Badge>;
      case 'earnings':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">דוחות</Badge>;
      case 'other':
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300">אחר</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };
  
  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
      case 'critical':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">השפעה גבוהה</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">השפעה בינונית</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">השפעה נמוכה</Badge>;
      default:
        return <Badge variant="outline">{importance}</Badge>;
    }
  };
  
  // Filter the data sources based on the selected category
  const filteredDataSources = selectedCategory === 'all' 
    ? financialDataSources 
    : financialDataSources.filter(source => source.category === selectedCategory);
    
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">מידע פונדמנטלי</h1>
      
      <div className="flex justify-end gap-4 mb-6">
        <Select value={selectedAssetId} onValueChange={setSelectedAssetId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="בחר נכס" />
          </SelectTrigger>
          <SelectContent>
            {assets?.map(asset => (
              <SelectItem key={asset.id} value={asset.id}>
                {asset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" />
            סקירה כללית
          </TabsTrigger>
          <TabsTrigger value="data-sources" className="flex items-center gap-1">
            <Newspaper className="h-4 w-4" />
            מקורות מידע
          </TabsTrigger>
          <TabsTrigger value="economic-calendar" className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            לוח אירועים כלכלי
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            דוחות וניתוחים
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          {selectedAsset ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">{selectedAsset.name} - נתונים פונדמנטליים</CardTitle>
                  <CardDescription className="text-right">נתונים עדכניים נכון להיום</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">שווי שוק:</div>
                      <div className="text-right">{fundamentalData.marketCap}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">נפח מסחר (24 שעות):</div>
                      <div className="text-right">{fundamentalData.tradingVolume24h}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">כמות במחזור:</div>
                      <div className="text-right">{fundamentalData.circulatingSupply}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">כמות מקסימלית:</div>
                      <div className="text-right">{fundamentalData.maxSupply}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">כריה (Hashrate):</div>
                      <div className="text-right">{fundamentalData.currentHashrate}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">כתובות פעילות:</div>
                      <div className="text-right">{fundamentalData.activeAddresses}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">עסקאות (24 שעות):</div>
                      <div className="text-right">{fundamentalData.transactions24h}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">עמלה ממוצעת:</div>
                      <div className="text-right">{fundamentalData.averageFee}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">דרגת קושי הרשת:</div>
                      <div className="text-right">{fundamentalData.networkDifficulty}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">תגמול כרייה:</div>
                      <div className="text-right">{fundamentalData.miningReward}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-right font-medium">הפחתה הבאה (Halving):</div>
                      <div className="text-right">{fundamentalData.nextHalving}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">ניתוח פונדמנטלי</CardTitle>
                  <CardDescription className="text-right">הערכת מצב בהתבסס על מידע פונדמנטלי</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-md text-right">
                    <h3 className="font-bold text-lg mb-2">הערכה קצרת טווח</h3>
                    <p>שווי השוק של ביטקוין ממשיך לצמוח באופן יציב, עם גידול משמעותי בכמות הכתובות הפעילות ברשת. 
                    אינדיקטורים On-Chain מראים שארנקים גדולים ממשיכים לצבור ביטקוין, מה שמעיד על אמון ארוך טווח בנכס.</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-md text-right">
                    <h3 className="font-bold text-lg mb-2">הערכה ארוכת טווח</h3>
                    <p>ההתקרבות לאירוע ה-Halving הבא צפויה להשפיע משמעותית על הדינמיקה של ההיצע והביקוש. 
                    בהתבסס על מחזורים היסטוריים, תקופה זו נוטה להקדים תקופות של עליות מחיר משמעותיות.</p>
                  </div>
                  
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-md text-right">
                    <h3 className="font-bold text-lg mb-2">גורמי סיכון</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>אי-ודאות רגולטורית בשווקים מרכזיים</li>
                      <li>שינויים במדיניות הריבית של הבנק הפדרלי</li>
                      <li>תחרות מצד מטבעות דיגיטליים אחרים</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md text-right">
                    <h3 className="font-bold text-lg mb-2">מדד מוסדי</h3>
                    <div className="flex justify-between items-center">
                      <Badge>78/100</Badge>
                      <div className="text-right font-medium">רמת אימוץ מוסדי:</div>
                    </div>
                    <p className="mt-2">רמת האימוץ המוסדי גבוהה, עם מגוון קרנות ותאגידים המחזיקים בביטקוין כחלק מאסטרטגיית הגנה מפני אינפלציה.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center">
                <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
                <p className="text-lg font-medium">אנא בחר נכס כדי לצפות בנתונים הפונדמנטליים</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="data-sources">
          <div className="mb-4 flex justify-end">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="סנן לפי קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל הקטגוריות</SelectItem>
                <SelectItem value="data">נתונים</SelectItem>
                <SelectItem value="news">חדשות</SelectItem>
                <SelectItem value="analysis">אנליזה</SelectItem>
                <SelectItem value="social">רשתות חברתיות</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredDataSources.map(source => (
              <Card key={source.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    {getCategoryBadge(source.category)}
                    <CardTitle className="text-right">{source.name}</CardTitle>
                  </div>
                  <CardDescription className="text-right">
                    <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{source.url}</a>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-right">{source.description}</p>
                    <div>
                      <h4 className="font-medium text-right mb-1">שפות זמינות:</h4>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {source.languages.map((language, idx) => (
                          <Badge key={idx} variant="outline">{language}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-1 items-center">
                        <div className={`h-2 w-2 rounded-full ${
                          source.reliability > 90 ? 'bg-green-500' : 
                          source.reliability > 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm">{source.reliability}/100</span>
                      </div>
                      <div className="text-sm font-medium text-right">דירוג אמינות:</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="economic-calendar">
          <div className="space-y-4">
            {marketEvents.map(event => (
              <Card key={event.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      {getCategoryBadge(event.category)}
                      {getImportanceBadge(event.importance)}
                    </div>
                    <CardTitle className="text-right">{event.title}</CardTitle>
                  </div>
                  <CardDescription className="text-right flex justify-end items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {event.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-right">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-right mb-1">השפעה צפויה:</h4>
                        <div className="text-right">
                          <Badge className={`
                            ${event.expectedImpact === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                              event.expectedImpact === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                              'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'}
                          `}>
                            {event.expectedImpact === 'positive' ? 'חיובית' : 
                             event.expectedImpact === 'negative' ? 'שלילית' : 
                             event.expectedImpact === 'neutral' ? 'נייטרלית' : 'משתנה'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-right mb-1">נכסים קשורים:</h4>
                        <div className="space-y-1 text-right">
                          {event.relatedAssets?.map((asset, index) => (
                            <Badge key={index} variant="outline" className="mr-1">
                              {asset}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-2">
                      <Badge variant={event.reminder ? "default" : "outline"}>
                        {event.reminder ? 'תזכורת מוגדרת' : 'אין תזכורת'}
                      </Badge>
                      <div className="text-sm font-medium text-right">מקור: {event.source}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="reports">
          <div className="space-y-4">
            {reports.map(report => (
              <Card key={report.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    {getCategoryBadge(report.category)}
                    <CardTitle className="text-right">{report.title}</CardTitle>
                  </div>
                  <CardDescription className="text-right flex justify-end items-center gap-1">
                    <div className="flex justify-end gap-4">
                      <div>{report.pageCount} עמודים</div>
                      <div>{report.date}</div>
                      <div>{report.author}</div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-right font-medium">תקציר:</p>
                    <p className="text-right">{report.summary}</p>
                    
                    <div>
                      <p className="text-right font-medium mb-1">נקודות מפתח:</p>
                      <ul className="list-disc list-inside space-y-1 text-right">
                        {report.keyPoints.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FundamentalData;
