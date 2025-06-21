
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FearGreedIndex from '@/components/fear-greed-index/FearGreedIndex';
import SentimentAnalysis from '@/components/technical-analysis/SentimentAnalysis';
import { getMarketSentiment, getSocialMentions, getInfluentialMentions } from '@/services/crypto/cryptoSentimentService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Twitter, MessageSquare, Globe, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

const MarketSentiment: React.FC = () => {
  const [marketSentiment, setMarketSentiment] = useState<any>(null);
  const [socialMentions, setSocialMentions] = useState<any[]>([]);
  const [influentialMentions, setInfluentialMentions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAllSentimentData();
  }, []);

  const loadAllSentimentData = async () => {
    setIsLoading(true);
    try {
      const [sentiment, social, influential] = await Promise.all([
        getMarketSentiment(),
        getSocialMentions(),
        getInfluentialMentions()
      ]);

      setMarketSentiment(sentiment);
      setSocialMentions(social);
      setInfluentialMentions(influential);
      
      toast.success('נתוני סנטימנט השוק עודכנו');
    } catch (error) {
      console.error('Error loading sentiment data:', error);
      toast.error('שגיאה בטעינת נתוני סנטימנט');
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentColor = (value: number) => {
    if (value > 50) return 'text-green-600 bg-green-100';
    if (value < -50) return 'text-red-600 bg-red-100';
    return 'text-yellow-600 bg-yellow-100';
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'twitter': return <Twitter className="h-4 w-4" />;
      case 'reddit': return <MessageSquare className="h-4 w-4" />;
      case 'telegram': return <MessageSquare className="h-4 w-4" />;
      case 'news': return <Globe className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={loadAllSentimentData}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          רענן נתונים
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-right">סנטימנט השוק</h1>
          <p className="text-muted-foreground text-right">
            ניתוח רגשות השוק והמשקיעים בזמן אמת
          </p>
        </div>
      </div>

      <Tabs defaultValue="fear-greed" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fear-greed">מדד פחד/חמדנות</TabsTrigger>
          <TabsTrigger value="social">רשתות חברתיות</TabsTrigger>
          <TabsTrigger value="market">סנטימנט שוק</TabsTrigger>
          <TabsTrigger value="analysis">ניתוח מעמיק</TabsTrigger>
        </TabsList>

        <TabsContent value="fear-greed" className="space-y-6">
          <FearGreedIndex />
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Influential Mentions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  אזכורים משפיעים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {influentialMentions.map((mention, index) => (
                    <div key={index} className="border-b pb-3 last:border-b-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(mention.source)}
                          <Badge variant="outline" className="text-xs">
                            {mention.source}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {mention.assetSymbol}
                          </Badge>
                        </div>
                        <Badge className={getSentimentColor(mention.sentimentScore)}>
                          {mention.sentimentScore > 0 ? '+' : ''}{mention.sentimentScore}
                        </Badge>
                      </div>
                      <p className="text-sm text-right mb-1">{mention.content}</p>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{mention.engagement} אינטרקציות</span>
                        <span>{new Date(mention.timestamp).toLocaleString('he-IL')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Social Mentions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right">אזכורים אחרונים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {socialMentions.slice(0, 8).map((mention, index) => (
                    <div key={index} className="border-b pb-2 last:border-b-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {getSourceIcon(mention.source)}
                          <Badge variant="outline" className="text-xs">
                            {mention.assetSymbol}
                          </Badge>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getSentimentColor(mention.sentimentScore)}
                        >
                          {mention.sentimentScore > 0 ? '+' : ''}{mention.sentimentScore}
                        </Badge>
                      </div>
                      <p className="text-sm text-right">{mention.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          {marketSentiment && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">סנטימנט כללי</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{marketSentiment.overall}</div>
                    <Badge className={getSentimentColor(marketSentiment.overall)}>
                      {marketSentiment.overall > 50 ? 'חיובי' : marketSentiment.overall < -50 ? 'שלילי' : 'ניטרלי'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">ביטקוין</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{marketSentiment.bitcoin}</div>
                    <Badge className={getSentimentColor(marketSentiment.bitcoin)}>
                      {marketSentiment.bitcoin > 50 ? 'חיובי' : marketSentiment.bitcoin < -50 ? 'שלילי' : 'ניטרלי'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">אלטקוינים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{marketSentiment.altcoins}</div>
                    <Badge className={getSentimentColor(marketSentiment.altcoins)}>
                      {marketSentiment.altcoins > 50 ? 'חיובי' : marketSentiment.altcoins < -50 ? 'שלילי' : 'ניטרלי'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">DeFi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{marketSentiment.defi}</div>
                    <Badge className={getSentimentColor(marketSentiment.defi)}>
                      {marketSentiment.defi > 50 ? 'חיובי' : marketSentiment.defi < -50 ? 'שלילי' : 'ניטרלי'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">Ethereum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{marketSentiment.ethereum}</div>
                    <Badge className={getSentimentColor(marketSentiment.ethereum)}>
                      {marketSentiment.ethereum > 50 ? 'חיובי' : marketSentiment.ethereum < -50 ? 'שלילי' : 'ניטרלי'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">NFTs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">{marketSentiment.nfts}</div>
                    <Badge className={getSentimentColor(marketSentiment.nfts)}>
                      {marketSentiment.nfts > 50 ? 'חיובי' : marketSentiment.nfts < -50 ? 'שלילי' : 'ניטרלי'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <SentimentAnalysis assetId="BTC" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketSentiment;
