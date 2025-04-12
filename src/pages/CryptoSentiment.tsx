
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMarketSentiment, getSocialMentions, getInfluentialMentions, refreshSentimentData } from '@/services/crypto/cryptoSentimentService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { ThumbsUp, ThumbsDown, RefreshCw, Twitter, MessageCircle, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const CryptoSentiment = () => {
  const { 
    data: sentiment,
    isLoading: sentimentLoading,
    refetch: refetchSentiment
  } = useQuery({
    queryKey: ['marketSentiment'],
    queryFn: getMarketSentiment,
    refetchInterval: 5 * 60 * 1000 // 5 minutes
  });
  
  const { 
    data: socialMentions = [],
    isLoading: mentionsLoading,
    refetch: refetchMentions
  } = useQuery({
    queryKey: ['socialMentions'],
    queryFn: () => getSocialMentions(undefined, 20),
    refetchInterval: 3 * 60 * 1000 // 3 minutes
  });
  
  const { 
    data: influentialMentions = [],
    isLoading: influentialLoading,
    refetch: refetchInfluential
  } = useQuery({
    queryKey: ['influentialMentions'],
    queryFn: () => getInfluentialMentions(),
    refetchInterval: 2 * 60 * 1000 // 2 minutes
  });
  
  const handleRefresh = async () => {
    await refreshSentimentData();
    refetchSentiment();
    refetchMentions();
    refetchInfluential();
  };
  
  // פונקציית עזר להצגת הסנטימנט
  const renderSentimentBar = (value: number, label: string) => {
    // המרה מסקאלה של -100 עד 100 לסקאלה של 0 עד 100
    const normalizedValue = Math.max(0, Math.min(100, (value + 100) / 2));
    
    let textClass = 'text-yellow-500';
    if (value > 30) textClass = 'text-green-500';
    if (value < -30) textClass = 'text-red-500';
    
    return (
      <div className="space-y-1 mb-4">
        <div className="flex justify-between items-center">
          <div className={textClass + ' font-medium'}>
            {value > 0 ? '+' : ''}{value}
          </div>
          <div className="text-right font-medium">{label}</div>
        </div>
        <Progress value={normalizedValue} className="h-3" />
      </div>
    );
  };
  
  // פונקציית עזר לפורמט תאריך
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `לפני ${diffMins} דקות`;
    } else if (diffMins < 24 * 60) {
      const hours = Math.floor(diffMins / 60);
      return `לפני ${hours} שעות`;
    } else {
      return date.toLocaleDateString('he-IL');
    }
  };
  
  // פונקציית עזר להצגת סנטימנט
  const renderSentimentBadge = (score: number) => {
    if (score > 30) {
      return <Badge className="bg-green-500">חיובי</Badge>;
    } else if (score < -30) {
      return <Badge className="bg-red-500">שלילי</Badge>;
    } else {
      return <Badge variant="outline">נייטרלי</Badge>;
    }
  };
  
  // פונקציית עזר להצגת אייקון המקור
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'reddit':
        return <AlertTriangle className="h-4 w-4" />;
      case 'telegram':
      case 'discord':
      case 'news':
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="container py-6">
      <div className="flex flex-col gap-2 md:flex-row md:justify-between md:items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">סנטימנט שוק הקריפטו</h1>
        
        <Button 
          variant="outline" 
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          רענן נתונים
        </Button>
      </div>
      
      {/* כרטיס סנטימנט שוק כללי */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-right">סנטימנט שוק כללי</CardTitle>
          <CardDescription className="text-right">
            ניתוח תחושת השוק בקטגוריות השונות
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sentimentLoading ? (
            <div className="space-y-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-[60px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                </div>
              ))}
            </div>
          ) : sentiment ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-center items-center mb-6">
                  <div className="relative w-32 h-32">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-4xl font-bold ${
                        sentiment.overall > 30 ? 'text-green-500' : 
                        sentiment.overall < -30 ? 'text-red-500' : 
                        'text-yellow-500'
                      }`}>
                        {sentiment.overall > 0 ? '+' : ''}{sentiment.overall}
                      </span>
                    </div>
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke="#e2e8f0" 
                        strokeWidth="10"
                      />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        fill="none" 
                        stroke={
                          sentiment.overall > 30 ? '#10b981' : 
                          sentiment.overall < -30 ? '#ef4444' : 
                          '#eab308'
                        }
                        strokeWidth="10"
                        strokeDasharray="282.7"
                        strokeDashoffset={282.7 - ((sentiment.overall + 100) / 200) * 282.7}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex justify-center items-center gap-4">
                  <div className="flex items-center">
                    <ThumbsUp className="h-5 w-5 text-green-500 mr-1" />
                    <span className="text-sm text-muted-foreground">חיובי</span>
                  </div>
                  <div className="flex items-center">
                    <ThumbsDown className="h-5 w-5 text-red-500 mr-1" />
                    <span className="text-sm text-muted-foreground">שלילי</span>
                  </div>
                </div>
                <div className="text-center mt-2 text-sm text-muted-foreground">
                  עדכון אחרון: {formatDate(sentiment.lastUpdated)}
                </div>
              </div>
              
              <div>
                {renderSentimentBar(sentiment.bitcoin, 'Bitcoin')}
                {renderSentimentBar(sentiment.ethereum, 'Ethereum')}
                {renderSentimentBar(sentiment.altcoins, 'Altcoins')}
                {renderSentimentBar(sentiment.defi, 'DeFi')}
                {renderSentimentBar(sentiment.nfts, 'NFTs')}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              לא ניתן לטעון נתוני סנטימנט
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* כרטיס אזכורים ברשתות חברתיות */}
      <Tabs defaultValue="influential">
        <TabsList className="w-full md:w-[400px]">
          <TabsTrigger value="influential">אזכורים משפיעים</TabsTrigger>
          <TabsTrigger value="all">כל האזכורים</TabsTrigger>
        </TabsList>
        
        <TabsContent value="influential">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">אזכורים משפיעים</CardTitle>
              <CardDescription className="text-right">
                אזכורים מאנשי מפתח ומשפיענים בתחום הקריפטו
              </CardDescription>
            </CardHeader>
            <CardContent>
              {influentialLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border p-4 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-6 w-[80px]" />
                        <Skeleton className="h-6 w-[120px]" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  ))}
                </div>
              ) : influentialMentions.length > 0 ? (
                <div className="space-y-4">
                  {influentialMentions.map((mention, index) => (
                    <div key={index} className="border p-4 rounded-md">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1">
                          {renderSentimentBadge(mention.sentimentScore)}
                          <Badge variant="outline">{mention.assetSymbol}</Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getSourceIcon(mention.source)}
                            {mention.source}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(mention.timestamp)}
                          </span>
                        </div>
                      </div>
                      <p className="text-right my-2">{mention.content}</p>
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>{mention.engagement.toLocaleString()} אינטראקציות</span>
                        {mention.url && (
                          <a 
                            href={mention.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            צפה במקור
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  לא נמצאו אזכורים משפיעים
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">כל האזכורים החברתיים</CardTitle>
              <CardDescription className="text-right">
                אזכורים מרשתות חברתיות ופלטפורמות שונות
              </CardDescription>
            </CardHeader>
            <CardContent>
              {mentionsLoading ? (
                <div className="space-y-3">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="border p-3 rounded-md space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-5 w-[70px]" />
                        <Skeleton className="h-5 w-[100px]" />
                      </div>
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-4/5" />
                    </div>
                  ))}
                </div>
              ) : socialMentions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {socialMentions.map((mention, index) => (
                    <div key={index} className={`border p-3 rounded-md ${
                      mention.influential ? 'border-blue-200 bg-blue-50 dark:bg-blue-950/20' : ''
                    }`}>
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-1">
                          {renderSentimentBadge(mention.sentimentScore)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getSourceIcon(mention.source)}
                            {mention.source}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <p className="text-right">{mention.content}</p>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{mention.engagement} אינטראקציות</span>
                          <span className="flex items-center gap-1">
                            <Badge variant="outline">{mention.assetSymbol}</Badge>
                            {formatDate(mention.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  לא נמצאו אזכורים ברשתות חברתיות
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CryptoSentiment;
