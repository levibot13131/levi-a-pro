
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
} from '@/services/marketInformationService';

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
  
  // Mock financial data sources
  const financialDataSources: FinancialDataSource[] = [
    {
      id: 'source1',
      name: 'Glassnode',
      url: 'https://glassnode.com',
      category: 'on-chain',
      dataPoints: ['פעילות רשת', 'התפלגות ארנקים', 'אוהולד רווח/הפסד'],
      description: 'מספק מידע מקיף על-פי ניתוח שרשרת הבלוקים של ביטקוין ואתריום',
      reliabilityRating: 95
    },
    {
      id: 'source2',
      name: 'CoinMetrics',
      url: 'https://coinmetrics.io',
      category: 'on-chain',
      dataPoints: ['זרימת כספים', 'פעילות מוסדית', 'מדדי בריאות רשת'],
      description: 'מתמחה בניתוח זרימת כספים בין בורסות וארנקים מוסדיים',
      reliabilityRating: 92
    },
    {
      id: 'source3',
      name: 'The Block',
      url: 'https://www.theblockcrypto.com',
      category: 'news',
      dataPoints: ['חדשות שוק', 'רגולציה', 'דוחות מחקר'],
      description: 'אתר חדשות ומחקר מוביל בתחום הקריפטו עם דגש על דיוק ואמינות',
      reliabilityRating: 90
    },
    {
      id: 'source4',
      name: 'Bank of America',
      url: 'https://www.bankofamerica.com',
      category: 'financial',
      dataPoints: ['דוחות מאקרו', 'תחזיות כלכליות', 'ניתוחי שווקים'],
      description: 'דוחות אנליסטים מהבנק עם דגש על השפעת הקריפטו על שווקים מסורתיים',
      reliabilityRating: 88
    },
    {
      id: 'source5',
      name: 'ארקייה ריסרץ׳',
      url: 'https://www.arkresearch.io',
      category: 'research',
      dataPoints: ['דוחות עומק', 'תחזיות טכנולוגיות', 'הערכות שווי'],
      description: 'מחקרים מקיפים לגבי פוטנציאל הטכנולוגי והעסקי של פרויקטים בתחום',
      reliabilityRating: 93
    }
  ];
  
  // Mock market events
  const marketEvents: MarketEvent[] = [
    {
      id: 'event1',
      title: 'החלטת ריבית של הפד',
      date: '2024-04-30',
      category: 'economic',
      impact: 'high',
      description: 'החלטת ריבית של הבנק הפדרלי האמריקאי. צפי להשארת הריבית ללא שינוי על 5.5%.',
      expectedVolatility: 'medium',
      assetImpact: {
        bitcoin: 'medium',
        ethereum: 'medium',
        stocks: 'high'
      }
    },
    {
      id: 'event2',
      title: 'הנפקת ETF ביטקוין בגרמניה',
      date: '2024-04-22',
      category: 'crypto',
      impact: 'medium',
      description: 'השקת קרנות ETF מבוססות ביטקוין בבורסה הגרמנית. צפויה להגדיל את החשיפה המוסדית באירופה.',
      expectedVolatility: 'medium',
      assetImpact: {
        bitcoin: 'high',
        ethereum: 'low',
        stocks: 'low'
      }
    },
    {
      id: 'event3',
      title: 'דוחות רבעוניים אפל',
      date: '2024-05-02',
      category: 'financial',
      impact: 'high',
      description: 'פרסום דוחות הרבעון השני של אפל לשנת 2024. צפי: הכנסות של $96.5 מיליארד.',
      expectedVolatility: 'high',
      assetImpact: {
        bitcoin: 'low',
        ethereum: 'low',
        stocks: 'high'
      }
    },
    {
      id: 'event4',
      title: 'עדכון רשת אתריום',
      date: '2024-06-12',
      category: 'crypto',
      impact: 'high',
      description: 'עדכון רשת משמעותי לאתריום שיפחית עמלות וישפר את ביצועי הרשת.',
      expectedVolatility: 'high',
      assetImpact: {
        bitcoin: 'medium',
        ethereum: 'very high',
        stocks: 'low'
      }
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
      case 'on-chain':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">On-Chain</Badge>;
      case 'news':
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">חדשות</Badge>;
      case 'financial':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">פיננסי</Badge>;
      case 'research':
        return <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300">מחקר</Badge>;
      case 'economic':
        return <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300">כלכלי</Badge>;
      case 'crypto':
        return <Badge className="bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-300">קריפטו</Badge>;
      case 'technology':
        return <Badge className="bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300">טכנולוגי</Badge>;
      case 'market':
        return <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300">שוק</Badge>;
      default:
        return <Badge variant="outline">{category}</Badge>;
    }
  };
  
  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">השפעה גבוהה</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">השפעה בינונית</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">השפעה נמוכה</Badge>;
      default:
        return <Badge variant="outline">{impact}</Badge>;
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
                <SelectItem value="on-chain">מידע On-Chain</SelectItem>
                <SelectItem value="news">חדשות</SelectItem>
                <SelectItem value="financial">פיננסי</SelectItem>
                <SelectItem value="research">מחקר</SelectItem>
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
                      <h4 className="font-medium text-right mb-1">סוגי מידע:</h4>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {source.dataPoints.map((point, idx) => (
                          <Badge key={idx} variant="outline">{point}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <div className="flex gap-1 items-center">
                        <div className={`h-2 w-2 rounded-full ${
                          source.reliabilityRating > 90 ? 'bg-green-500' : 
                          source.reliabilityRating > 80 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}></div>
                        <span className="text-sm">{source.reliabilityRating}/100</span>
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
                      {getImpactBadge(event.impact)}
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
                        <h4 className="font-medium text-right mb-1">תנודתיות צפויה:</h4>
                        <div className="text-right">
                          <Badge className={`
                            ${event.expectedVolatility === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                              event.expectedVolatility === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                              'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}
                          `}>
                            {event.expectedVolatility === 'high' ? 'גבוהה' : 
                             event.expectedVolatility === 'medium' ? 'בינונית' : 'נמוכה'}
                          </Badge>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-right mb-1">השפעה על נכסים:</h4>
                        <div className="space-y-1 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <Badge className={`
                              ${event.assetImpact.bitcoin === 'high' || event.assetImpact.bitcoin === 'very high' ? 
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                                event.assetImpact.bitcoin === 'medium' ? 
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}
                            `}>
                              {event.assetImpact.bitcoin === 'very high' ? 'גבוהה מאוד' :
                               event.assetImpact.bitcoin === 'high' ? 'גבוהה' : 
                               event.assetImpact.bitcoin === 'medium' ? 'בינונית' : 'נמוכה'}
                            </Badge>
                            <span>ביטקוין:</span>
                          </div>
                          
                          <div className="flex justify-end items-center gap-2">
                            <Badge className={`
                              ${event.assetImpact.ethereum === 'high' || event.assetImpact.ethereum === 'very high' ? 
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                                event.assetImpact.ethereum === 'medium' ? 
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}
                            `}>
                              {event.assetImpact.ethereum === 'very high' ? 'גבוהה מאוד' :
                               event.assetImpact.ethereum === 'high' ? 'גבוהה' : 
                               event.assetImpact.ethereum === 'medium' ? 'בינונית' : 'נמוכה'}
                            </Badge>
                            <span>אתריום:</span>
                          </div>
                          
                          <div className="flex justify-end items-center gap-2">
                            <Badge className={`
                              ${event.assetImpact.stocks === 'high' || event.assetImpact.stocks === 'very high' ? 
                                'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' : 
                                event.assetImpact.stocks === 'medium' ? 
                                'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' : 
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'}
                            `}>
                              {event.assetImpact.stocks === 'very high' ? 'גבוהה מאוד' :
                               event.assetImpact.stocks === 'high' ? 'גבוהה' : 
                               event.assetImpact.stocks === 'medium' ? 'בינונית' : 'נמוכה'}
                            </Badge>
                            <span>מניות:</span>
                          </div>
                        </div>
                      </div>
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
