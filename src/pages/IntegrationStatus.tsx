
import React from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Check, 
  X, 
  AlertTriangle, 
  Info, 
  Shield, 
  Server, 
  Link, 
  Clock,
  Database
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { isBinanceConnected } from '@/services/binance/binanceService';
import { isCoinMarketCapConnected } from '@/services/coinMarketCap/coinMarketCapService';
import { isTwitterConnected } from '@/services/twitter/twitterService';
import { testConnection as testCoinGeckoConnection } from '@/services/crypto/coinGeckoService';

// Integration interface for tracking status
interface IntegrationStatus {
  name: string;
  status: 'connected' | 'error' | 'not-connected' | 'partial';
  requiresApiKey: boolean;
  apiKeyConfigured: boolean;
  features: string[];
  implemented: string[];
  limitations: string[];
  nextSteps: string[];
  documentationUrl: string;
}

const IntegrationStatus = () => {
  const [statuses, setStatuses] = React.useState<IntegrationStatus[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [coinGeckoConnected, setCoinGeckoConnected] = React.useState(false);
  
  React.useEffect(() => {
    const checkIntegrations = async () => {
      setLoading(true);
      
      // Check CoinGecko connection
      const isCoinGeckoConnected = await testCoinGeckoConnection();
      setCoinGeckoConnected(isCoinGeckoConnected);
      
      // Get connection status for other services
      const binanceStatus = isBinanceConnected();
      const coinMarketCapStatus = isCoinMarketCapConnected();
      const twitterStatus = isTwitterConnected();
      
      // Build integration statuses
      const integrationStatuses: IntegrationStatus[] = [
        {
          name: 'CoinGecko',
          status: isCoinGeckoConnected ? 'connected' : 'error',
          requiresApiKey: false,
          apiKeyConfigured: true,
          features: [
            'מחירי קריפטו בזמן אמת',
            'נתוני מטבעות מפורטים',
            'גרפים היסטוריים',
            'מגמות שוק'
          ],
          implemented: [
            'שליפת מחירים בזמן אמת',
            'נתוני שוק כלליים',
            'רשימת מטבעות מובילים'
          ],
          limitations: [
            'הגבלת API ל-10/30 בקשות בדקה',
            'מידע מוגבל על מטבעות חדשים'
          ],
          nextSteps: [
            'שיפור מטמון לעמידה במגבלות API',
            'הוספת גרפים היסטוריים'
          ],
          documentationUrl: 'https://www.coingecko.com/api/documentation'
        },
        {
          name: 'Binance',
          status: binanceStatus ? 'connected' : 'not-connected',
          requiresApiKey: true,
          apiKeyConfigured: binanceStatus,
          features: [
            'מחירים בזמן אמת',
            'נתוני מסחר',
            'ביצוע פעולות מסחר',
            'נתוני חשבון'
          ],
          implemented: [
            'חיבור לחשבון',
            'הצגת מצב חיבור'
          ],
          limitations: [
            'נדרש חשבון Binance פעיל',
            'הגבלות API'
          ],
          nextSteps: [
            'אימות חיבור',
            'שליפת נתוני חשבון',
            'שילוב עם מערכת מסחר'
          ],
          documentationUrl: 'https://binance-docs.github.io/apidocs/'
        },
        {
          name: 'CoinMarketCap',
          status: coinMarketCapStatus ? 'connected' : 'not-connected',
          requiresApiKey: true,
          apiKeyConfigured: coinMarketCapStatus,
          features: [
            'נתוני שוק',
            'דירוגי מטבעות',
            'מידע על מטבעות'
          ],
          implemented: [
            'חיבור בסיסי'
          ],
          limitations: [
            'הגבלות API בחשבון חינמי',
            'ללא נתונים בזמן אמת בחשבון בסיסי'
          ],
          nextSteps: [
            'שליפת נתוני מטבעות',
            'שילוב עם מערכת המעקב'
          ],
          documentationUrl: 'https://coinmarketcap.com/api/documentation/v1/'
        },
        {
          name: 'Twitter',
          status: twitterStatus ? 'connected' : 'not-connected',
          requiresApiKey: true,
          apiKeyConfigured: twitterStatus,
          features: [
            'ציוצים בזמן אמת',
            'מעקב אחר משפיענים',
            'ניתוח סנטימנט'
          ],
          implemented: [
            'חיבור בסיסי'
          ],
          limitations: [
            'מגבלות API',
            'עלויות גבוהות לחבילות מסחריות'
          ],
          nextSteps: [
            'שליפת ציוצים ממשפיענים',
            'ניתוח סנטימנט'
          ],
          documentationUrl: 'https://developer.twitter.com/en/docs'
        }
      ];
      
      setStatuses(integrationStatuses);
      setLoading(false);
    };
    
    checkIntegrations();
  }, []);
  
  const calculateCompletionPercentage = () => {
    let totalFeatures = 0;
    let implementedFeatures = 0;
    
    statuses.forEach(status => {
      totalFeatures += status.features.length;
      implementedFeatures += status.implemented.length;
    });
    
    return totalFeatures > 0 ? Math.round((implementedFeatures / totalFeatures) * 100) : 0;
  };
  
  const requiredApiKeys = statuses.filter(s => s.requiresApiKey && !s.apiKeyConfigured).length;
  const connectedServices = statuses.filter(s => s.status === 'connected').length;
  
  return (
    <Container className="py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-right">סטטוס חיבורים לשירותים חיצוניים</h1>
        <p className="text-muted-foreground text-right">מעקב אחר חיבורים לשירותים ו-API שונים, סטטוס היישום והשלבים הבאים</p>
      </div>
      
      {loading ? (
        <Card className="mb-6">
          <CardContent className="flex justify-center items-center h-64">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              <p className="mt-4">בודק סטטוס חיבורים...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-right text-lg">סטטוס כללי</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-muted-foreground">התקדמות כללית</span>
                      <span className="font-semibold">{calculateCompletionPercentage()}%</span>
                    </div>
                    <Progress value={calculateCompletionPercentage()} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 bg-muted rounded-md text-center">
                      <p className="text-2xl font-bold">{connectedServices}/{statuses.length}</p>
                      <p className="text-sm text-muted-foreground">שירותים מחוברים</p>
                    </div>
                    <div className="p-3 bg-muted rounded-md text-center">
                      <p className="text-2xl font-bold">{requiredApiKeys}</p>
                      <p className="text-sm text-muted-foreground">מפתחות API חסרים</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader className="pb-2">
                <CardTitle className="text-right text-lg">חיבורים פעילים</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] text-right">פלטפורמה</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">דורש API Key</TableHead>
                      <TableHead className="text-right">מפתח מוגדר</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {statuses.map((status) => (
                      <TableRow key={status.name}>
                        <TableCell className="font-medium">{status.name}</TableCell>
                        <TableCell>
                          {status.status === 'connected' && (
                            <Badge className="bg-green-100 text-green-800 flex items-center w-fit gap-1">
                              <Check className="h-3 w-3" />
                              מחובר
                            </Badge>
                          )}
                          {status.status === 'error' && (
                            <Badge className="bg-amber-100 text-amber-800 flex items-center w-fit gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              בעיה בחיבור
                            </Badge>
                          )}
                          {status.status === 'not-connected' && (
                            <Badge className="bg-slate-100 text-slate-800 flex items-center w-fit gap-1">
                              <X className="h-3 w-3" />
                              לא מחובר
                            </Badge>
                          )}
                          {status.status === 'partial' && (
                            <Badge className="bg-blue-100 text-blue-800 flex items-center w-fit gap-1">
                              <Info className="h-3 w-3" />
                              חיבור חלקי
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {status.requiresApiKey ? (
                            <span className="text-amber-600 flex items-center gap-1">
                              <Check className="h-4 w-4" />
                              כן
                            </span>
                          ) : (
                            <span className="text-green-600 flex items-center gap-1">
                              <X className="h-4 w-4" />
                              לא
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {status.apiKeyConfigured ? (
                            <span className="text-green-600 flex items-center gap-1">
                              <Check className="h-4 w-4" />
                              כן
                            </span>
                          ) : (
                            <span className="text-amber-600 flex items-center gap-1">
                              <X className="h-4 w-4" />
                              לא
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="coingecko" className="mb-6">
            <TabsList className="w-full">
              {statuses.map((status) => (
                <TabsTrigger key={status.name} value={status.name.toLowerCase()}>
                  {status.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {statuses.map((status) => (
              <TabsContent key={status.name} value={status.name.toLowerCase()}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">
                      אינטגרציית {status.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <Alert className={status.status === 'connected' ? 'bg-green-50' : 'bg-amber-50'}>
                        <AlertTitle className="text-right">
                          סטטוס: {status.status === 'connected' ? 'מחובר ופעיל' : 'לא מחובר'}
                        </AlertTitle>
                        <AlertDescription className="text-right">
                          {status.status === 'connected' 
                            ? `החיבור ל-${status.name} פעיל ומוכן לשימוש.`
                            : `נדרש להגדיר ולחבר את ${status.name} כדי להשתמש בכל התכונות.`}
                        </AlertDescription>
                      </Alert>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-right font-semibold mb-2">תכונות</h3>
                          <ul className="space-y-1 text-right">
                            {status.features.map((feature, index) => (
                              <li key={index} className="flex items-center justify-end gap-2">
                                <span>{feature}</span>
                                <span className={`h-2 w-2 rounded-full ${
                                  status.implemented.some(impl => impl.includes(feature.substring(0, 10))) 
                                    ? 'bg-green-500' 
                                    : 'bg-amber-500'
                                }`}></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div>
                          <h3 className="text-right font-semibold mb-2">מגבלות</h3>
                          <ul className="space-y-1 list-disc list-inside text-right">
                            {status.limitations.map((limitation, index) => (
                              <li key={index}>{limitation}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-right font-semibold mb-2">שלבים הבאים</h3>
                        <ol className="space-y-1 list-decimal list-inside text-right">
                          {status.nextSteps.map((step, index) => (
                            <li key={index}>{step}</li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="mt-4">
                        <h3 className="text-right font-semibold mb-2">סטטוס יישום</h3>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">
                            {status.implemented.length}/{status.features.length} תכונות
                          </span>
                          <span className="text-sm font-medium">
                            {Math.round((status.implemented.length / status.features.length) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={Math.round((status.implemented.length / status.features.length) * 100)} 
                          className="h-2" 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-right">מידע חשוב על החיבורים</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-right">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      אבטחת מפתחות API
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-right">
                    <p>כרגע, מפתחות ה-API נשמרים ב-localStorage במכשיר המשתמש. זוהי שיטה זמנית בלבד.</p>
                    <p className="mt-2 text-amber-600">
                      בגרסת הייצור, מומלץ לשמור את מפתחות ה-API בצד השרת עם הצפנה מתאימה או להשתמש בשרת proxy.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-right">
                    <div className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      מעבר לשרת ביניים (Proxy)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-right">
                    <p>
                      בשלב הבא של הפיתוח, יש להעביר את כל קריאות ה-API דרך שרת ביניים. 
                      זה יעזור ב:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>הסתרת מפתחות API מצד הלקוח</li>
                      <li>ניהול הגבלות API (rate limiting)</li>
                      <li>מטמון (caching) יעיל יותר</li>
                      <li>שילוב מידע ממקורות שונים</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-right">
                    <div className="flex items-center gap-2">
                      <Link className="h-5 w-5" />
                      חיבורים נוספים מומלצים
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-right">
                    <p>שקול להוסיף את החיבורים הבאים בעתיד:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>CryptoCompare - לנתוני מחירים היסטוריים</li>
                      <li>Messari - לנתוני פונדמנטלס ומחקרים</li>
                      <li>Alpha Vantage - לנתוני מניות ופורקס</li>
                      <li>The Graph - לנתוני בלוקצ'יין</li>
                      <li>Glassnode - לניתוחי On-chain</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-right">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      רענון נתונים בזמן אמת
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-right">
                    <p>אסטרטגיית רענון הנתונים הנוכחית:</p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>CoinGecko: רענון כל 30 שניות (בגלל מגבלות API)</li>
                      <li>נתוני שוק כלליים: רענון כל 5 דקות</li>
                      <li>ניתן לבצע רענון ידני בכל עת</li>
                    </ul>
                    <p className="mt-2">
                      בשרת הביניים, ניתן יהיה ליישם אסטרטגיית מטמון אפקטיבית יותר שתקטין את העומס על ממשקי ה-API.
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="item-5">
                  <AccordionTrigger className="text-right">
                    <div className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      שמירת נתונים היסטוריים
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-right">
                    <p>
                      כרגע, הנתונים לא נשמרים לטווח ארוך. בגרסאות עתידיות, כדאי לשקול:
                    </p>
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>שמירת נתונים היסטוריים בבסיס נתונים</li>
                      <li>יצירת גרפים היסטוריים מהנתונים שנשמרו</li>
                      <li>ניתוח מגמות לאורך זמן</li>
                      <li>השוואת ביצועים של נכסים שונים</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default IntegrationStatus;
