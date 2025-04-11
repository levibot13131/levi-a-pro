
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MessageSquare, Twitter, Users, Trending, AlertTriangle } from 'lucide-react';
import { getAssets } from '@/services/mockDataService';

const SocialMonitoring = () => {
  const [selectedAssetId, setSelectedAssetId] = useState<string>('bitcoin');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('24h');
  
  const { data: assets } = useQuery({
    queryKey: ['assets'],
    queryFn: getAssets,
  });
  
  // Mock data for social posts
  const socialPosts = [
    {
      id: 'post1',
      platform: 'twitter',
      author: {
        name: 'CryptoAnalyst',
        handle: '@crypto_analyst',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
      },
      content: 'ביטקוין נראה מבטיח מאוד אחרי פריצת רמת ההתנגדות ב-$45K. נפח מסחר גבוה מחזק את הפריצה. יעד הבא: $52K 🚀',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      likes: 245,
      reposts: 56,
      sentiment: 'bullish',
      influence: 'high'
    },
    {
      id: 'post2',
      platform: 'forum',
      author: {
        name: 'TechTrader',
        handle: 'tech_trader',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka'
      },
      content: 'הדוחות הכספיים של אפל מראים האטה בצמיחה, אבל החברה עדיין מייצרת מזומנים בכמויות מרשימות. מחזיק בעמדה ארוכת טווח ⏳',
      timestamp: new Date(Date.now() - 12600000).toISOString(),
      likes: 87,
      reposts: 12,
      sentiment: 'neutral',
      influence: 'medium'
    },
    {
      id: 'post3',
      platform: 'telegram',
      author: {
        name: 'WhaleAlert',
        handle: 'whale_alert',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dusty'
      },
      content: 'התראה: העברה של 12,500 BTC מארנק לא ידוע לבינאנס. ייתכן לחץ מכירה בטווח הקרוב 🐋',
      timestamp: new Date(Date.now() - 5400000).toISOString(),
      likes: 412,
      reposts: 109,
      sentiment: 'bearish',
      influence: 'high'
    },
    {
      id: 'post4',
      platform: 'twitter',
      author: {
        name: 'MarketGuru',
        handle: '@market_guru',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bailey'
      },
      content: 'אמזון מתכננת השקת מוצר חדש בתחום ה-AI. מקורות בחברה מדווחים על התקדמות משמעותית. עקבו אחרי העדכונים 👁️',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      likes: 189,
      reposts: 45,
      sentiment: 'bullish',
      influence: 'medium'
    },
    {
      id: 'post5',
      platform: 'discord',
      author: {
        name: 'CryptoWhale',
        handle: 'crypto_whale',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie'
      },
      content: 'אנחנו בשלבים הראשונים של מחזור שור חדש. האקומולציה המוסדית נמשכת בשקט מתחת לרדאר. זה הזמן לבנות פוזיציות 🏗️',
      timestamp: new Date(Date.now() - 259200000).toISOString(),
      likes: 567,
      reposts: 213,
      sentiment: 'bullish',
      influence: 'high'
    }
  ];
  
  // Mock data for influential figures
  const influencers = [
    {
      id: 'inf1',
      name: 'אילון מאסק',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elon',
      role: 'CEO של טסלה וX',
      sentiment: 'bullish',
      recentActivity: 'צייץ על תמיכה בביטקוין לפני 3 שעות',
      influence: 95
    },
    {
      id: 'inf2',
      name: 'קתי ווד',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Cathy',
      role: 'מנכ"לית ARK Invest',
      sentiment: 'bullish',
      recentActivity: 'קנתה מניות טסלה בשווי $3.2 מיליון לפני 2 ימים',
      influence: 88
    },
    {
      id: 'inf3',
      name: 'וורן באפט',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Warren',
      role: 'מנכ"ל ברקשייר האת\'וויי',
      sentiment: 'neutral',
      recentActivity: 'מכר 50% מאחזקות אפל לפני שבוע',
      influence: 92
    },
    {
      id: 'inf4',
      name: 'ויטליק בוטרין',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vitalik',
      role: 'מייסד אתריום',
      sentiment: 'bullish',
      recentActivity: 'דיבר על התקדמות ETH 2.0 בכנס לפני 4 ימים',
      influence: 90
    }
  ];
  
  // Mock data for forums and groups
  const forums = [
    {
      id: 'forum1',
      name: 'r/Bitcoin',
      platform: 'Reddit',
      members: 4200000,
      activity: 'high',
      sentiment: 'bullish',
      recentTopics: ['התאוששות שוק', 'אסטרטגיות צבירה', 'רגולציה חדשה']
    },
    {
      id: 'forum2',
      name: 'קבוצת השקעות ישראלית',
      platform: 'טלגרם',
      members: 15000,
      activity: 'medium',
      sentiment: 'neutral',
      recentTopics: ['הנפקות חדשות', 'מניות דיבידנד', 'השקעות נדל"ן']
    },
    {
      id: 'forum3',
      name: 'WallStreetBets',
      platform: 'Reddit',
      members: 12700000,
      activity: 'very high',
      sentiment: 'mixed',
      recentTopics: ['אמזון', 'מיקרוסופט', 'מימים חדשים']
    },
    {
      id: 'forum4',
      name: 'Crypto Technical Analysis',
      platform: 'דיסקורד',
      members: 45000,
      activity: 'high',
      sentiment: 'bullish',
      recentTopics: ['ניתוח וויקוף', 'תבניות מחיר', 'הגדרת סטופים']
    }
  ];
  
  // Helper function for sentiment styling
  const getSentimentStyle = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'bearish':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'neutral':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'mixed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };
  
  // Helper function for platform icons
  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'telegram':
      case 'discord':
        return <MessageSquare className="h-4 w-4" />;
      case 'forum':
      case 'Reddit':
        return <Users className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };
  
  // Format date helper
  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString('he-IL') + ' ' + date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6 text-right">רשתות חברתיות ופורומים</h1>
      
      <div className="flex justify-end gap-4 mb-6">
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="טווח זמן" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="24h">24 שעות</SelectItem>
            <SelectItem value="7d">שבוע</SelectItem>
            <SelectItem value="30d">חודש</SelectItem>
          </SelectContent>
        </Select>
        
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
      
      <Tabs defaultValue="posts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="posts" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            פוסטים ואזכורים
          </TabsTrigger>
          <TabsTrigger value="influencers" className="flex items-center gap-1">
            <Trending className="h-4 w-4" />
            אושיות משפיעות
          </TabsTrigger>
          <TabsTrigger value="forums" className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            פורומים וקבוצות
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="posts">
          <div className="space-y-4">
            {socialPosts.map(post => (
              <Card key={post.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar>
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getSentimentStyle(post.sentiment)}>
                            {post.sentiment === 'bullish' ? 'חיובי' : post.sentiment === 'bearish' ? 'שלילי' : 'ניטרלי'}
                          </Badge>
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getPlatformIcon(post.platform)}
                            {post.platform === 'twitter' ? 'טוויטר' : 
                             post.platform === 'telegram' ? 'טלגרם' : 
                             post.platform === 'discord' ? 'דיסקורד' : 'פורום'}
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(post.timestamp)}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{post.author.name}</div>
                        <div className="text-sm text-muted-foreground">@{post.author.handle}</div>
                      </div>
                      <p className="text-md">{post.content}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div>{post.likes} לייקים</div>
                        <div>{post.reposts} שיתופים</div>
                        <div>השפעה: {post.influence === 'high' ? 'גבוהה' : post.influence === 'medium' ? 'בינונית' : 'נמוכה'}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="influencers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {influencers.map(influencer => (
              <Card key={influencer.id}>
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={influencer.avatar} />
                    <AvatarFallback>{influencer.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{influencer.name}</CardTitle>
                    <CardDescription>{influencer.role}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Badge className={getSentimentStyle(influencer.sentiment)}>
                        {influencer.sentiment === 'bullish' ? 'חיובי' : influencer.sentiment === 'bearish' ? 'שלילי' : 'ניטרלי'}
                      </Badge>
                      <div className="text-sm font-medium">
                        דירוג השפעה: {influencer.influence}/100
                      </div>
                    </div>
                    <div className="text-sm">
                      <p><strong>פעילות אחרונה:</strong> {influencer.recentActivity}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="forums">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {forums.map(forum => (
              <Card key={forum.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <Badge className={getSentimentStyle(forum.sentiment)}>
                      {forum.sentiment === 'bullish' ? 'חיובי' : 
                       forum.sentiment === 'bearish' ? 'שלילי' : 
                       forum.sentiment === 'mixed' ? 'מעורב' : 'ניטרלי'}
                    </Badge>
                    <CardTitle>{forum.name}</CardTitle>
                  </div>
                  <CardDescription>
                    <div className="flex justify-end items-center gap-2">
                      <span>{forum.platform}</span>
                      {getPlatformIcon(forum.platform)}
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <div>פעילות: {forum.activity === 'high' ? 'גבוהה' : 
                                     forum.activity === 'very high' ? 'גבוהה מאוד' : 
                                     forum.activity === 'medium' ? 'בינונית' : 'נמוכה'}</div>
                      <div>{forum.members.toLocaleString()} חברים</div>
                    </div>
                    
                    <div className="pt-2">
                      <div className="text-sm font-medium text-right mb-1">נושאים חמים:</div>
                      <div className="flex flex-wrap gap-2 justify-end">
                        {forum.recentTopics.map((topic, idx) => (
                          <Badge key={idx} variant="secondary">{topic}</Badge>
                        ))}
                      </div>
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

export default SocialMonitoring;
