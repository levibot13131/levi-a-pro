
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import useMarketNews from '@/hooks/use-market-news';
import { formatTimeAgo } from '@/lib/utils';
import NewsGrid from '@/components/market-news/NewsGrid';
import SocialTab from '@/components/market-news/SocialTab';

type SentimentType = 'all' | 'positive' | 'negative' | 'neutral';

const MarketNews = () => {
  const { 
    selectedTab, setSelectedTab,
    news, socialPosts,
    currentNewsPage, totalNewsPages,
    currentSocialPage, totalSocialPages,
    selectedAsset, setSelectedAsset,
    selectedSentiment, setSelectedSentiment,
    nextNewsPage, prevNewsPage,
    nextSocialPage, prevSocialPage
  } = useMarketNews();

  // Type-safe handler for sentiment change
  const handleSentimentChange = (value: string) => {
    setSelectedSentiment(value as SentimentType);
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-right">חדשות ועדכונים מהשוק</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 ml-2" />
              רענן
            </Button>
            
            <div className="flex gap-4">
              <Select value={selectedSentiment} onValueChange={handleSentimentChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="סנטימנט" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסנטימנטים</SelectItem>
                  <SelectItem value="positive">חיובי</SelectItem>
                  <SelectItem value="negative">שלילי</SelectItem>
                  <SelectItem value="neutral">ניטרלי</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="נכס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הנכסים</SelectItem>
                  <SelectItem value="bitcoin">ביטקוין</SelectItem>
                  <SelectItem value="ethereum">אתריום</SelectItem>
                  <SelectItem value="solana">סולנה</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Tabs defaultValue={selectedTab} onValueChange={(value) => setSelectedTab(value as 'news' | 'social')}>
            <TabsList className="grid grid-cols-2 w-full mb-8">
              <TabsTrigger value="news">חדשות</TabsTrigger>
              <TabsTrigger value="social">רשתות חברתיות</TabsTrigger>
            </TabsList>
            
            <TabsContent value="news">
              <NewsGrid 
                news={news} 
                isLoading={false}
              />
              
              {totalNewsPages > 1 && (
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={prevNewsPage}
                    disabled={currentNewsPage === 1}
                  >
                    <ArrowRight className="h-4 w-4 ml-2" />
                    הקודם
                  </Button>
                  
                  <span className="flex items-center">
                    עמוד {currentNewsPage} מתוך {totalNewsPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={nextNewsPage}
                    disabled={currentNewsPage === totalNewsPages}
                  >
                    הבא
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="social">
              <SocialTab
                socialPosts={socialPosts}
                isLoading={false}
              />
              
              {totalSocialPages > 1 && (
                <div className="flex justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={prevSocialPage}
                    disabled={currentSocialPage === 1}
                  >
                    <ArrowRight className="h-4 w-4 ml-2" />
                    הקודם
                  </Button>
                  
                  <span className="flex items-center">
                    עמוד {currentSocialPage} מתוך {totalSocialPages}
                  </span>
                  
                  <Button
                    variant="outline"
                    onClick={nextSocialPage}
                    disabled={currentSocialPage === totalSocialPages}
                  >
                    הבא
                    <ArrowLeft className="h-4 w-4 mr-2" />
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketNews;
