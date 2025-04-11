
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Info, RefreshCw } from 'lucide-react';
import { simulateWebhookSignal, testWebhookSignalFlow } from '@/services/tradingViewWebhookService';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WebhookTester: React.FC = () => {
  const [isTesting, setIsTesting] = React.useState(false);
  
  const handleSimulateSignal = async (type: 'buy' | 'sell' | 'info') => {
    setIsTesting(true);
    try {
      await simulateWebhookSignal(type);
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleTestWebhookFlow = async (type: 'buy' | 'sell' | 'info') => {
    setIsTesting(true);
    try {
      await testWebhookSignalFlow(type);
    } finally {
      setIsTesting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex justify-between items-center">
          <span>בדיקת Webhook</span>
          <RefreshCw className="h-5 w-5 text-primary" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="simulate">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="simulate">סימולציית איתות</TabsTrigger>
            <TabsTrigger value="test">בדיקת webhook</TabsTrigger>
          </TabsList>
          
          <TabsContent value="simulate">
            <Alert className="mb-4">
              <AlertTitle>סימולציית איתותים</AlertTitle>
              <AlertDescription>
                צור איתותים לדוגמה כדי לבדוק את תצוגת האיתותים והפורמט שלהם בממשק.
                האיתותים יוצגו במערכת אך לא ישלחו לטלגרם או וואטסאפ.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="outline" 
                className="w-full border-green-500 text-green-600"
                onClick={() => handleSimulateSignal('buy')}
                disabled={isTesting}
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                איתות קנייה
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-red-500 text-red-600"
                onClick={() => handleSimulateSignal('sell')}
                disabled={isTesting}
              >
                <ArrowDown className="h-4 w-4 mr-2" />
                איתות מכירה
              </Button>
              
              <Button 
                variant="outline"
                className="w-full border-blue-500 text-blue-600"
                onClick={() => handleSimulateSignal('info')}
                disabled={isTesting}
              >
                <Info className="h-4 w-4 mr-2" />
                איתות מידע
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="test">
            <Alert className="mb-4">
              <AlertTitle>בדיקת זרימת Webhook מלאה</AlertTitle>
              <AlertDescription>
                בדוק את הזרימה המלאה של Webhook, כולל פירוק הנתונים, עיבוד ושליחה לכל יעדי ההתראות המוגדרים.
                התראות יישלחו בפועל לטלגרם ולוואטסאפ אם הם מוגדרים.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-3 gap-2">
              <Button 
                variant="default" 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => handleTestWebhookFlow('buy')}
                disabled={isTesting}
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                בדוק איתות קנייה
              </Button>
              
              <Button 
                variant="default"
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => handleTestWebhookFlow('sell')}
                disabled={isTesting}
              >
                <ArrowDown className="h-4 w-4 mr-2" />
                בדוק איתות מכירה
              </Button>
              
              <Button 
                variant="default"
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => handleTestWebhookFlow('info')}
                disabled={isTesting}
              >
                <Info className="h-4 w-4 mr-2" />
                בדוק איתות מידע
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WebhookTester;
