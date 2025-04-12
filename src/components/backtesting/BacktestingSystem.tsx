
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Container } from '@/components/ui/container';
import { toast } from 'sonner';
import { History, BellRing, BarChart, BarChart4, Smartphone } from 'lucide-react';
import BacktestingForm from './BacktestingForm';
import BacktestResults from './BacktestResults';
import RealTimeAlerts from './RealTimeAlerts';
import ComprehensiveAnalysis from './ComprehensiveAnalysis';
import { BacktestSettings, BacktestResult } from '@/services/backtesting/types';
import { runBacktest } from '@/services/backtesting';
import WhatsappIntegrationPanel from '../whatsapp/WhatsappIntegrationPanel';

const BacktestingSystem: React.FC = () => {
  const [activeTab, setActiveTab] = useState('backtest');
  const [results, setResults] = useState<BacktestResult | null>(null);
  const [settings, setSettings] = useState<BacktestSettings | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<string>('bitcoin');
  const [isRunning, setIsRunning] = useState(false);

  const handleRunBacktest = async (settings: BacktestSettings) => {
    setIsRunning(true);
    setSettings(settings);
    setSelectedAsset(settings.assetIds?.[0] || 'bitcoin');
    
    try {
      const results = await runBacktest(settings);
      setResults(results);
      toast.success('בדיקת Levi Bot הסתיימה בהצלחה');
      // מעבר ללשונית תוצאות
      setActiveTab('results');
    } catch (error) {
      toast.error('שגיאה בהרצת בדיקת Levi Bot', {
        description: 'אירעה שגיאה בעת הרצת בדיקת העבר. נא לנסות שוב.'
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Container className="py-8">
      <h1 className="text-3xl font-bold mb-8 text-right">
        Levi Bot - מערכת בדיקות עבר וניתוח בזמן אמת
      </h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="backtest" className="text-xs md:text-sm">
            <History className="h-4 w-4 mr-1 hidden md:inline" />
            בדיקת עבר
          </TabsTrigger>
          <TabsTrigger value="results" className="text-xs md:text-sm" disabled={!results}>
            <BarChart className="h-4 w-4 mr-1 hidden md:inline" />
            תוצאות
          </TabsTrigger>
          <TabsTrigger value="realtime" className="text-xs md:text-sm">
            <BellRing className="h-4 w-4 mr-1 hidden md:inline" />
            התראות בזמן אמת
          </TabsTrigger>
          <TabsTrigger value="analysis" className="text-xs md:text-sm">
            <BarChart4 className="h-4 w-4 mr-1 hidden md:inline" />
            ניתוח מעמיק
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="text-xs md:text-sm">
            <Smartphone className="h-4 w-4 mr-1 hidden md:inline" />
            חיבור וואטסאפ
          </TabsTrigger>
        </TabsList>

        <TabsContent value="backtest">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">הגדרת בדיקת עבר - Levi Bot</CardTitle>
            </CardHeader>
            <CardContent>
              <BacktestingForm 
                onRunBacktest={handleRunBacktest}
                isLoading={isRunning}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results">
          {results && (
            <BacktestResults 
              results={results}
            />
          )}
        </TabsContent>

        <TabsContent value="realtime">
          <div className="grid grid-cols-1 gap-6">
            <RealTimeAlerts
              assetIds={settings?.assetIds || [selectedAsset]}
              settings={settings || { 
                strategy: 'Levi Bot', 
                riskPerTrade: 1, 
                initialCapital: 10000, 
                assetIds: [], 
                timeframe: '1d', 
                startDate: new Date(), 
                endDate: new Date(), 
                entryType: 'market', 
                stopLossType: 'fixed', 
                takeProfitType: 'fixed', 
                riskRewardRatio: 2, 
                trailingStop: false, 
                maxOpenTrades: 1 
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="analysis">
          <div className="grid grid-cols-1 gap-6">
            <ComprehensiveAnalysis
              assetId={selectedAsset}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="whatsapp">
          <div className="grid grid-cols-1 gap-6">
            <WhatsappIntegrationPanel />
          </div>
        </TabsContent>
      </Tabs>
    </Container>
  );
};

export default BacktestingSystem;
