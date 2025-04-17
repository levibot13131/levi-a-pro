
import React, { useState, useEffect } from 'react';
import { Container } from '@/components/ui/container';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, LineChart, TrendingUp, Twitter } from 'lucide-react';
import TwitterSentimentChart from '@/components/twitter/TwitterSentimentChart';
import { fetchTwitterSentiment } from '@/services/twitter/twitterService';
import RequireAuth from '@/components/auth/RequireAuth';

const CryptoSentiment: React.FC = () => {
  const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('7');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    const loadSentimentData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchTwitterSentiment(selectedCrypto, parseInt(selectedPeriod));
        setSentimentData(data);
      } catch (error) {
        console.error('Error loading sentiment data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSentimentData();
  }, [selectedCrypto, selectedPeriod]);
  
  return (
    <RequireAuth>
      <Container className="py-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">ניתוח סנטימנט</h1>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="w-full md:w-1/2">
            <Select 
              value={selectedCrypto} 
              onValueChange={setSelectedCrypto}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="בחר מטבע" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bitcoin">Bitcoin (BTC)</SelectItem>
                <SelectItem value="ethereum">Ethereum (ETH)</SelectItem>
                <SelectItem value="solana">Solana (SOL)</SelectItem>
                <SelectItem value="dogecoin">Dogecoin (DOGE)</SelectItem>
                <SelectItem value="cardano">Cardano (ADA)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="w-full md:w-1/2">
            <Select 
              value={selectedPeriod} 
              onValueChange={setSelectedPeriod}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="בחר תקופה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">יום אחד</SelectItem>
                <SelectItem value="7">שבוע</SelectItem>
                <SelectItem value="30">חודש</SelectItem>
                <SelectItem value="90">שלושה חודשים</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="twitter">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="twitter" className="flex items-center gap-1">
              <Twitter className="h-4 w-4" />
              טוויטר
            </TabsTrigger>
            <TabsTrigger value="news" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              חדשות
            </TabsTrigger>
            <TabsTrigger value="overall" className="flex items-center gap-1">
              <LineChart className="h-4 w-4" />
              סנטימנט כללי
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="twitter">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-right">סנטימנט טוויטר - {selectedCrypto.toUpperCase()}</CardTitle>
                <CardDescription className="text-right">
                  ניתוח סנטימנט על בסיס פוסטים בטוויטר
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[300px] flex items-center justify-center">
                    <p>טוען נתונים...</p>
                  </div>
                ) : (
                  <TwitterSentimentChart data={sentimentData} />
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="news">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">סנטימנט חדשות</CardTitle>
                <CardDescription className="text-right">
                  ניתוח סנטימנט על בסיס מאמרי חדשות ופרסומים
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10">נתוני סנטימנט חדשות בפיתוח</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overall">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">סנטימנט כללי</CardTitle>
                <CardDescription className="text-right">
                  ניתוח סנטימנט כולל משילוב מקורות מידע
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-10">נתוני סנטימנט כללי בפיתוח</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Container>
    </RequireAuth>
  );
};

export default CryptoSentiment;
