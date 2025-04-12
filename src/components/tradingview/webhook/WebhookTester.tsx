
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAlertDestinations } from '@/services/tradingView/tradingViewAlertService';
import { simulateWebhookSignal, testWebhookSignalFlow } from '@/services/tradingViewWebhookService';
import WebhookSimulationTab from './WebhookSimulationTab';
import WebhookTestingTab from './WebhookTestingTab';
import WebhookDebugInfo from './WebhookDebugInfo';
import WebhookTestResult from './WebhookTestResult';
import WebhookDestinationBadges from './WebhookDestinationBadges';

const WebhookTester: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<{success: boolean, type: string, time: Date} | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Get current destinations status
  const destinations = getAlertDestinations();
  
  const handleSimulateSignal = async (type: 'buy' | 'sell' | 'info'): Promise<boolean> => {
    setIsTesting(true);
    try {
      const result = await simulateWebhookSignal(type);
      setLastTestResult({
        success: result,
        type,
        time: new Date()
      });
      return result;
    } catch (error) {
      console.error('Error simulating webhook signal:', error);
      return false;
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleTestWebhookFlow = async (type: 'buy' | 'sell' | 'info'): Promise<boolean> => {
    setIsTesting(true);
    try {
      const result = await testWebhookSignalFlow(type);
      setLastTestResult({
        success: result,
        type,
        time: new Date()
      });
      return result;
    } catch (error) {
      console.error('Error testing webhook flow:', error);
      return false;
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="flex items-center gap-2">
            <span>בדיקת Webhook</span>
            <RefreshCw className="h-5 w-5 text-primary" />
          </CardTitle>
          
          <WebhookDestinationBadges destinations={destinations} />
        </div>
        
        <CardDescription>
          בדוק את הווהבוק שלך עם דוגמאות איתותים מסוגים שונים
        </CardDescription>
        
        <WebhookTestResult lastTestResult={lastTestResult} />
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="simulate">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="simulate">סימולציית איתות</TabsTrigger>
            <TabsTrigger value="test">בדיקת webhook</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulate">
            <WebhookSimulationTab 
              handleSimulateSignal={handleSimulateSignal}
              isTesting={isTesting}
            />
          </TabsContent>
          
          <TabsContent value="test">
            <WebhookTestingTab 
              handleTestWebhookFlow={handleTestWebhookFlow}
              isTesting={isTesting}
            />
          </TabsContent>
        </Tabs>
        
        <WebhookDebugInfo 
          showDebugInfo={showDebugInfo}
          setShowDebugInfo={setShowDebugInfo}
          destinations={destinations}
        />
      </CardContent>
    </Card>
  );
};

export default WebhookTester;
