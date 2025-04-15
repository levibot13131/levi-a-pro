
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TwitterSentimentChart } from '@/components/twitter/TwitterSentimentChart';
import TwitterMentionsTable from '@/components/twitter/TwitterMentionsTable';
import { useAppSettings } from '@/hooks/use-app-settings';

// Mock data for sentiment over time
const sentimentData = [
  { date: '2025-03-01', positive: 45, negative: 20, neutral: 35, volume: 1200 },
  { date: '2025-03-02', positive: 50, negative: 15, neutral: 35, volume: 1300 },
  { date: '2025-03-03', positive: 55, negative: 15, neutral: 30, volume: 1400 },
  { date: '2025-03-04', positive: 48, negative: 22, neutral: 30, volume: 1500 },
  { date: '2025-03-05', positive: 52, negative: 18, neutral: 30, volume: 1600 },
  { date: '2025-03-06', positive: 60, negative: 10, neutral: 30, volume: 1700 },
  { date: '2025-03-07', positive: 65, negative: 10, neutral: 25, volume: 1800 },
  { date: '2025-03-08', positive: 60, negative: 15, neutral: 25, volume: 1700 },
  { date: '2025-03-09', positive: 55, negative: 20, neutral: 25, volume: 1600 },
  { date: '2025-03-10', positive: 50, negative: 25, neutral: 25, volume: 1500 },
  { date: '2025-03-11', positive: 60, negative: 15, neutral: 25, volume: 1700 },
  { date: '2025-03-12', positive: 65, negative: 10, neutral: 25, volume: 1900 },
  { date: '2025-03-13', positive: 70, negative: 10, neutral: 20, volume: 2000 },
  { date: '2025-03-14', positive: 75, negative: 10, neutral: 15, volume: 2200 },
];

// Mock tweets data
const mockTweets = [
  {
    id: '1',
    username: 'cryptoExpert',
    text: 'ביטקוין מתרומם מעל $60K! זה הזמן להיכנס לעמדת לונג #BTC #Bullish',
    createdAt: '2025-04-10T10:23:00Z',
    likes: 245,
    retweets: 56,
    sentiment: 'positive' as const,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    id: '2',
    username: 'tradingMaster',
    text: 'מגמת הירידה של אית׳ריום נמשכת. חוששני שאנחנו עומדים לראות המשך ירידות בשבועות הקרובים. $ETH',
    createdAt: '2025-04-10T09:15:00Z',
    likes: 78,
    retweets: 12,
    sentiment: 'negative' as const,
    profileImageUrl: 'https://randomuser.me/api/portraits/women/2.jpg',
  },
  {
    id: '3',
    username: 'blockchain_news',
    text: 'הרגולציה החדשה בתחום הקריפטו תיכנס לתוקף בחודש הבא. מעניין לראות איך זה ישפיע על השוק.',
    createdAt: '2025-04-10T08:45:00Z',
    likes: 134,
    retweets: 29,
    sentiment: 'neutral' as const,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/3.jpg',
  },
  {
    id: '4',
    username: 'hodlgang',
    text: 'לא מוכרים! הביטקוין הולך למיליון דולר, רק סבלנות צריך. זמן מצוין להגדיל פוזיציות! 🚀🌕 #HODL',
    createdAt: '2025-04-10T07:30:00Z',
    likes: 522,
    retweets: 103,
    sentiment: 'positive' as const,
    profileImageUrl: 'https://randomuser.me/api/portraits/women/4.jpg',
  },
  {
    id: '5',
    username: 'bearmarket',
    text: 'כל האינדיקטורים הטכניים מצביעים על המשך ירידות. אני מעריך שנראה את הביטקוין מתחת ל-$40K בקרוב מאוד.',
    createdAt: '2025-04-10T06:20:00Z',
    likes: 67,
    retweets: 14,
    sentiment: 'negative' as const,
    profileImageUrl: 'https://randomuser.me/api/portraits/men/5.jpg',
  },
];

const influencers = [
  { name: 'Elon Musk', handle: '@elonmusk', followers: '151.2M', sentiment: 'positive' },
  { name: 'Vitalik Buterin', handle: '@VitalikButerin', followers: '4.7M', sentiment: 'neutral' },
  { name: 'CZ Binance', handle: '@cz_binance', followers: '8.3M', sentiment: 'positive' },
  { name: 'Crypto Whale', handle: '@CryptoWhale', followers: '1.8M', sentiment: 'negative' },
  { name: 'PlanB', handle: '@100trillionUSD', followers: '1.5M', sentiment: 'positive' },
];

// Define supported assets
const assets = [
  { value: 'BTC', label: 'Bitcoin' },
  { value: 'ETH', label: 'Ethereum' },
  { value: 'BNB', label: 'Binance Coin' },
  { value: 'SOL', label: 'Solana' },
  { value: 'ADA', label: 'Cardano' },
];

const CryptoSentiment = () => {
  const [selectedAsset, setSelectedAsset] = useState('BTC');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [activeTab, setActiveTab] = useState('overview');
  const { demoMode } = useAppSettings();

  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">ניתוח סנטימנט קריפטו</h1>
          <p className="text-muted-foreground">
            מעקב אחר האווירה בשוק והסנטימנט ברשתות החברתיות למטבעות קריפטו
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="w-full sm:w-48">
            <Label htmlFor="asset-select" className="sr-only">בחר נכס</Label>
            <Select value={selectedAsset} onValueChange={setSelectedAsset}>
              <SelectTrigger id="asset-select">
                <SelectValue placeholder="בחר נכס" />
              </SelectTrigger>
              <SelectContent>
                {assets.map((asset) => (
                  <SelectItem key={asset.value} value={asset.value}>
                    {asset.label} ({asset.value})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full sm:w-40">
            <Label htmlFor="timeframe-select" className="sr-only">טווח זמן</Label>
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger id="timeframe-select">
                <SelectValue placeholder="טווח זמן" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 שעות</SelectItem>
                <SelectItem value="7d">7 ימים</SelectItem>
                <SelectItem value="30d">30 ימים</SelectItem>
                <SelectItem value="90d">90 ימים</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button>חפש</Button>
        </div>
      </div>

      {demoMode && (
        <div className="bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md mb-6 text-right">
          <p className="font-medium text-yellow-800 dark:text-yellow-200">מצב דמו פעיל</p>
          <p className="text-sm text-yellow-700 dark:text-yellow-300">
            הנתונים המוצגים הם לצורכי הדגמה בלבד ואינם משקפים נתוני זמן אמת.
          </p>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full justify-start bg-muted border">
          <TabsTrigger value="overview">סקירה כללית</TabsTrigger>
          <TabsTrigger value="twitter">טוויטר</TabsTrigger>
          <TabsTrigger value="news">חדשות</TabsTrigger>
          <TabsTrigger value="reddit">רדיט</TabsTrigger>
          <TabsTrigger value="influencers">משפיענים</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-right">סנטימנט לאורך זמן</CardTitle>
              </CardHeader>
              <CardContent>
                <TwitterSentimentChart data={sentimentData} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right">סיכום סנטימנט נוכחי</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      <div className="text-xl font-bold text-green-500 text-right">65%</div>
                      <div className="text-sm text-muted-foreground text-right">חיובי</div>
                      <div className="w-full mt-1 bg-muted rounded-full h-2.5">
                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      <div className="text-xl font-bold text-red-500 text-right">15%</div>
                      <div className="text-sm text-muted-foreground text-right">שלילי</div>
                      <div className="w-full mt-1 bg-muted rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-full">
                      <div className="text-xl font-bold text-gray-500 text-right">20%</div>
                      <div className="text-sm text-muted-foreground text-right">ניטרלי</div>
                      <div className="w-full mt-1 bg-muted rounded-full h-2.5">
                        <div className="bg-gray-500 h-2.5 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="text-right text-sm text-muted-foreground mb-1">מסקנה:</div>
                    <div className="text-right font-medium">
                      הסנטימנט ל-{selectedAsset} הוא <span className="text-green-500 font-bold">חיובי מאוד</span> בתקופה זו, עם מגמת שיפור קבועה ב-{selectedTimeframe} האחרונים.
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-right">אזכורים אחרונים</CardTitle>
              </CardHeader>
              <CardContent>
                <TwitterMentionsTable tweets={mockTweets} />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-right">משפיענים מובילים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {influencers.map((influencer, index) => (
                    <div key={index} className="p-3 bg-muted/50 rounded-md">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-xs px-2 py-1 rounded-full 
                                      bg-opacity-20
                                      ${influencer.sentiment === 'positive' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 
                                        influencer.sentiment === 'negative' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' :
                                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'}">
                          {influencer.sentiment === 'positive' ? 'חיובי' : 
                           influencer.sentiment === 'negative' ? 'שלילי' : 'ניטרלי'}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{influencer.name}</div>
                          <div className="text-sm text-muted-foreground">{influencer.handle}</div>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground text-left mt-1">
                        {influencer.followers} עוקבים
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="twitter" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">סנטימנט טוויטר</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sentimentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#555" opacity={0.2} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="positive" 
                      name="חיובי" 
                      stroke="#22c55e" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="negative" 
                      name="שלילי" 
                      stroke="#ef4444"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="volume" 
                      name="נפח שיחה" 
                      stroke="#3b82f6" 
                      yAxisId={1}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-right">אזכורים אחרונים</CardTitle>
            </CardHeader>
            <CardContent>
              <TwitterMentionsTable tweets={mockTweets} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="news">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ניתוח חדשות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-12 text-center text-muted-foreground">
                <p>ניתוח חדשות יהיה זמין בקרוב</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reddit">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ניתוח רדיט</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-12 text-center text-muted-foreground">
                <p>ניתוח רדיט יהיה זמין בקרוב</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="influencers">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">משפיענים מובילים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {influencers.map((influencer, index) => (
                  <div key={index} className="border rounded-md p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className={`text-xs px-2 py-1 rounded-full 
                                    ${influencer.sentiment === 'positive' ? 'bg-green-100 text-green-800' : 
                                      influencer.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                                      'bg-gray-100 text-gray-800'}`}>
                        {influencer.sentiment === 'positive' ? 'חיובי' : 
                         influencer.sentiment === 'negative' ? 'שלילי' : 'ניטרלי'}
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-lg">{influencer.name}</div>
                        <div className="text-sm text-muted-foreground">{influencer.handle}</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <div className="flex justify-between text-muted-foreground mb-1">
                        <span>{influencer.followers}</span>
                        <span>עוקבים</span>
                      </div>
                      <div className="flex justify-between">
                        <span>12</span>
                        <span>אזכורים של {selectedAsset}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-3">צפה בציוצים</Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CryptoSentiment;
