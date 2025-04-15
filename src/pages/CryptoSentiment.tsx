
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Twitter, TrendingUp, Zap, Users, Bell, Link2, Filter, RefreshCw } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TwitterConnectForm from '@/components/twitter/TwitterConnectForm';
import { isTwitterConnected } from '@/services/twitter/twitterService';
import { useAppSettings } from '@/hooks/use-app-settings';
import TwitterMentionsTable from '@/components/twitter/TwitterMentionsTable';
import TwitterSentimentChart from '@/components/twitter/TwitterSentimentChart';
import { toast } from 'sonner';

const cryptoAssets = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC" },
  { id: "ethereum", name: "Ethereum", symbol: "ETH" },
  { id: "binancecoin", name: "Binance Coin", symbol: "BNB" },
  { id: "solana", name: "Solana", symbol: "SOL" },
  { id: "cardano", name: "Cardano", symbol: "ADA" },
  { id: "xrp", name: "XRP", symbol: "XRP" },
  { id: "polkadot", name: "Polkadot", symbol: "DOT" },
  { id: "dogecoin", name: "Dogecoin", symbol: "DOGE" }
];

// נתוני דמו לניתוח סנטימנט
const sentimentDemoData = [
  { date: "01/04", positive: 65, negative: 35, neutral: 45, volume: 1200 },
  { date: "02/04", positive: 70, negative: 30, neutral: 50, volume: 1300 },
  { date: "03/04", positive: 60, negative: 40, neutral: 55, volume: 1100 },
  { date: "04/04", positive: 75, negative: 25, neutral: 50, volume: 1500 },
  { date: "05/04", positive: 80, negative: 20, neutral: 45, volume: 1800 },
  { date: "06/04", positive: 85, negative: 15, neutral: 40, volume: 2000 },
  { date: "07/04", positive: 75, negative: 25, neutral: 50, volume: 1600 },
];

// נתוני דמו לציוצים
const tweetsDemoData = [
  {
    id: '1',
    username: 'crypto_analyst',
    text: 'Bitcoin מראה סימנים חזקים של התאוששות. אני צופה מחיר של $50,000 בקרוב. #BTC #Crypto',
    createdAt: '2025-04-15T12:30:00Z',
    likes: 120,
    retweets: 45,
    sentiment: 'positive',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    username: 'eth_trader',
    text: 'אתריום מתחת ל-$3000 היא הזדמנות קנייה מעולה כרגע. אל תפספסו את העליה הבאה! #ETH',
    createdAt: '2025-04-15T11:20:00Z',
    likes: 78,
    retweets: 23,
    sentiment: 'positive',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    username: 'crypto_skeptic',
    text: 'הסתכלו על העקומות ההיסטוריות, אנחנו בדרך למטה עם BTC. גל מימושים צפוי בקרוב.',
    createdAt: '2025-04-15T10:45:00Z',
    likes: 45,
    retweets: 12,
    sentiment: 'negative',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    username: 'blockchain_dev',
    text: 'ה-USDT ו-USDC ממשיכים להיות יציבים למרות התנודות בשוק. אלו סטייבלקוינס אמינים.',
    createdAt: '2025-04-15T09:30:00Z',
    likes: 32,
    retweets: 8,
    sentiment: 'neutral',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    username: 'sol_investor',
    text: 'סולנה (SOL) עם ביצועים מרשימים לאחרונה! הטכנולוגיה הזו תשנה את העולם. #SOL #Solana',
    createdAt: '2025-04-15T08:15:00Z',
    likes: 156,
    retweets: 67,
    sentiment: 'positive',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
];

const CryptoSentiment: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('sentiment');
  const [selectedAsset, setSelectedAsset] = useState('bitcoin');
  const [isAutoRefresh, setIsAutoRefresh] = useState(false);
  const [timeRange, setTimeRange] = useState('7');
  const { demoMode } = useAppSettings();
  
  useEffect(() => {
    // בדיקת מצב חיבור לטוויטר
    const checkTwitterConnection = () => {
      const connected = isTwitterConnected();
      setIsConnected(connected);
    };
    
    checkTwitterConnection();
    
    // הוספת האזנה לשינויים בחיבור
    window.addEventListener('twitter-connection-changed', checkTwitterConnection);
    
    return () => {
      window.removeEventListener('twitter-connection-changed', checkTwitterConnection);
    };
  }, []);
  
  const handleRefresh = () => {
    toast.info('מרענן נתונים...');
    // בפרויקט אמיתי, כאן היינו מבצעים בקשת נתונים חדשה
    setTimeout(() => {
      toast.success('הנתונים התעדכנו בהצלחה');
    }, 1000);
  };
  
  const handleToggleAutoRefresh = () => {
    setIsAutoRefresh(!isAutoRefresh);
    if (!isAutoRefresh) {
      toast.info('רענון אוטומטי הופעל', {
        description: 'הנתונים יתעדכנו כל 5 דקות'
      });
    } else {
      toast.info('רענון אוטומטי הושבת');
    }
  };
  
  useEffect(() => {
    let refreshInterval: number | undefined;
    
    if (isAutoRefresh && isConnected) {
      refreshInterval = window.setInterval(() => {
        handleRefresh();
      }, 300000); // כל 5 דקות
    }
    
    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isAutoRefresh, isConnected]);
  
  return (
    <Container className="py-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">סנטימנט קריפטו</h1>
          <p className="text-muted-foreground">ניתוח מגמות ונתונים מרשתות חברתיות</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={!isConnected}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            רענן נתונים
          </Button>
        </div>
      </div>
      
      {!isConnected ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-right">התחבר לטוויטר/X</CardTitle>
            <CardDescription className="text-right">
              חבר את המערכת לטוויטר כדי לקבל ניתוח סנטימנט בזמן אמת
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TwitterConnectForm 
              onConnect={() => setIsConnected(true)} 
              isConnected={isConnected}
              onDisconnect={() => setIsConnected(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Card className="flex-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-right text-lg">סינון נתונים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="w-full md:w-1/3">
                    <Label htmlFor="asset-select" className="block text-right mb-2">מטבע</Label>
                    <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                      <SelectTrigger id="asset-select">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {cryptoAssets.map(asset => (
                          <SelectItem key={asset.id} value={asset.id}>
                            <div className="flex items-center gap-2">
                              <span>{asset.name}</span>
                              <Badge variant="outline" className="ml-auto">{asset.symbol}</Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-1/3">
                    <Label htmlFor="time-range" className="block text-right mb-2">טווח זמן</Label>
                    <Select value={timeRange} onValueChange={setTimeRange}>
                      <SelectTrigger id="time-range">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">יום אחד</SelectItem>
                        <SelectItem value="7">שבוע</SelectItem>
                        <SelectItem value="30">חודש</SelectItem>
                        <SelectItem value="90">שלושה חודשים</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="w-full md:w-1/3 flex items-end">
                    <div className="flex items-center justify-end w-full space-x-2">
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="auto-refresh" 
                            checked={isAutoRefresh} 
                            onCheckedChange={handleToggleAutoRefresh}
                          />
                          <Label htmlFor="auto-refresh" className="text-right">רענון אוטומטי</Label>
                        </div>
                        <span className="text-xs text-muted-foreground text-right">כל 5 דקות</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="sentiment" className="flex gap-2 items-center">
                <TrendingUp className="h-4 w-4" />
                ניתוח סנטימנט
              </TabsTrigger>
              <TabsTrigger value="mentions" className="flex gap-2 items-center">
                <Twitter className="h-4 w-4" />
                אזכורים ברשתות
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex gap-2 items-center">
                <Bell className="h-4 w-4" />
                התראות סנטימנט
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="sentiment">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-right">ניתוח סנטימנט {cryptoAssets.find(a => a.id === selectedAsset)?.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TwitterSentimentChart data={sentimentDemoData} />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-right">סיכום נתונים</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-green-100 text-green-800">חיובי</Badge>
                        <div className="font-semibold text-lg">75%</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-red-100 text-red-800">שלילי</Badge>
                        <div className="font-semibold text-lg">15%</div>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">ניטרלי</Badge>
                        <div className="font-semibold text-lg">10%</div>
                      </div>
                      <div className="border-t pt-3 mt-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">ציוצים שנותחו</span>
                          <span className="font-medium">2,487</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-muted-foreground">משתמשים ייחודיים</span>
                          <span className="font-medium">1,243</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-muted-foreground">השפעה כוללת</span>
                          <div className="flex items-center">
                            <span className="font-medium">3.8M</span>
                            <Zap className="h-3 w-3 text-yellow-500 ml-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-right flex justify-between">
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-2" />
                      סנן תוצאות
                    </Button>
                    <span>ציוצים מובילים</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TwitterMentionsTable tweets={tweetsDemoData} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="mentions">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">אזכורים ברשתות חברתיות</CardTitle>
                  <CardDescription className="text-right">
                    ניתוח תוכן והשפעה של אזכורים ברשתות עבור {cryptoAssets.find(a => a.id === selectedAsset)?.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card className="bg-muted/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-right">סך הכל אזכורים</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-between items-center">
                        <Twitter className="h-8 w-8 text-primary" />
                        <div className="text-3xl font-bold">12,354</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-right">משתמשים משפיעים</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-between items-center">
                        <Users className="h-8 w-8 text-primary" />
                        <div className="text-3xl font-bold">243</div>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-muted/40">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg text-right">השפעה פוטנציאלית</CardTitle>
                      </CardHeader>
                      <CardContent className="flex justify-between items-center">
                        <Zap className="h-8 w-8 text-primary" />
                        <div className="text-3xl font-bold">26.7M</div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="border-t pt-4 mt-2">
                    <div className="flex justify-between items-center mb-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        סנן תוצאות
                      </Button>
                      <h3 className="text-lg font-medium text-right">משתמשים משפיעים</h3>
                    </div>
                    
                    <div className="space-y-4 mt-4">
                      {/* רשימת משתמשים משפיעים - דמו */}
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <Button variant="ghost" size="sm">
                          <Link2 className="h-4 w-4 mr-2" />
                          עקוב
                        </Button>
                        <div className="flex items-center">
                          <div className="text-right mr-3">
                            <div className="font-medium">@crypto_analyst</div>
                            <div className="text-sm text-muted-foreground">247K עוקבים</div>
                          </div>
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="Profile" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <Button variant="ghost" size="sm">
                          <Link2 className="h-4 w-4 mr-2" />
                          עקוב
                        </Button>
                        <div className="flex items-center">
                          <div className="text-right mr-3">
                            <div className="font-medium">@eth_trader</div>
                            <div className="text-sm text-muted-foreground">135K עוקבים</div>
                          </div>
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img src="https://randomuser.me/api/portraits/women/2.jpg" alt="Profile" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <Button variant="ghost" size="sm">
                          <Link2 className="h-4 w-4 mr-2" />
                          עקוב
                        </Button>
                        <div className="flex items-center">
                          <div className="text-right mr-3">
                            <div className="font-medium">@sol_investor</div>
                            <div className="text-sm text-muted-foreground">98K עוקבים</div>
                          </div>
                          <div className="h-10 w-10 rounded-full overflow-hidden">
                            <img src="https://randomuser.me/api/portraits/men/5.jpg" alt="Profile" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="alerts">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">התראות סנטימנט</CardTitle>
                  <CardDescription className="text-right">
                    הגדר התראות מותאמות אישית עבור שינויים בסנטימנט השוק
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-right text-lg">התראות פעילות</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div className="flex items-center">
                              <Switch id="alert-1" defaultChecked />
                            </div>
                            <div className="text-right">
                              <div className="font-medium">שינוי חד בסנטימנט Bitcoin</div>
                              <div className="text-sm text-muted-foreground">מעל 15% בשעה</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div className="flex items-center">
                              <Switch id="alert-2" defaultChecked />
                            </div>
                            <div className="text-right">
                              <div className="font-medium">אזכורים גבוהים Ethereum</div>
                              <div className="text-sm text-muted-foreground">מעל 5,000 ציוצים בשעה</div>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center p-3 border rounded-md">
                            <div className="flex items-center">
                              <Switch id="alert-3" />
                            </div>
                            <div className="text-right">
                              <div className="font-medium">סנטימנט שלילי חריג</div>
                              <div className="text-sm text-muted-foreground">מעל 70% שלילי עבור כל מטבע</div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-right text-lg">הוסף התראה חדשה</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="alert-name" className="block text-right mb-2">שם ההתראה</Label>
                            <Input id="alert-name" placeholder="הזן שם להתראה" className="text-right" />
                          </div>
                          
                          <div>
                            <Label htmlFor="alert-asset" className="block text-right mb-2">מטבע</Label>
                            <Select defaultValue="bitcoin">
                              <SelectTrigger id="alert-asset">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {cryptoAssets.map(asset => (
                                  <SelectItem key={asset.id} value={asset.id}>
                                    {asset.name} ({asset.symbol})
                                  </SelectItem>
                                ))}
                                <SelectItem value="all">כל המטבעות</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="alert-type" className="block text-right mb-2">סוג התראה</Label>
                            <Select defaultValue="sentiment-change">
                              <SelectTrigger id="alert-type">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sentiment-change">שינוי בסנטימנט</SelectItem>
                                <SelectItem value="mentions-volume">כמות אזכורים</SelectItem>
                                <SelectItem value="influencer-mention">אזכור ע"י משפיענים</SelectItem>
                                <SelectItem value="price-sentiment">קורלציה מחיר-סנטימנט</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="alert-threshold" className="block text-right mb-2">סף התראה (%)</Label>
                            <Input id="alert-threshold" type="number" defaultValue="15" className="text-right" />
                          </div>
                          
                          <div>
                            <Label htmlFor="alert-message" className="block text-right mb-2">הודעת התראה (אופציונלי)</Label>
                            <Textarea id="alert-message" placeholder="הזן הודעה מותאמת אישית..." className="text-right" />
                          </div>
                          
                          <Button className="w-full">הוסף התראה</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </Container>
  );
};

export default CryptoSentiment;
