
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Info, RefreshCw, AlertTriangle, CheckCircle2, Terminal } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { getAlertDestinations } from '@/services/tradingView/tradingViewAlertService';
import { simulateWebhookSignal, testWebhookSignalFlow } from '@/services/tradingViewWebhookService';

const WebhookTester: React.FC = () => {
  const [isTesting, setIsTesting] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<{success: boolean, type: string, time: Date} | null>(null);
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  // Get current destinations status
  const destinations = getAlertDestinations();
  const hasTelegram = destinations.some(d => d.type === 'telegram' && d.active);
  const hasWhatsApp = destinations.some(d => d.type === 'whatsapp' && d.active);
  
  const handleSimulateSignal = async (type: 'buy' | 'sell' | 'info') => {
    setIsTesting(true);
    try {
      const result = await simulateWebhookSignal(type);
      setLastTestResult({
        success: result,
        type,
        time: new Date()
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  const handleTestWebhookFlow = async (type: 'buy' | 'sell' | 'info') => {
    setIsTesting(true);
    try {
      const result = await testWebhookSignalFlow(type);
      setLastTestResult({
        success: result,
        type,
        time: new Date()
      });
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
          
          <div className="flex gap-2">
            <Badge 
              variant={hasTelegram ? "default" : "destructive"}
              className={`${hasTelegram ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
            >
              {hasTelegram ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
              Telegram
            </Badge>
            
            <Badge 
              variant={hasWhatsApp ? "default" : "destructive"}
              className={`${hasWhatsApp ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'}`}
            >
              {hasWhatsApp ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
              WhatsApp
            </Badge>
          </div>
        </div>
        
        <CardDescription>
          בדוק את הווהבוק שלך עם דוגמאות איתותים מסוגים שונים
        </CardDescription>
        
        {lastTestResult && (
          <Alert className={lastTestResult.success ? 
            "mt-2 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-900/50" : 
            "mt-2 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-900/50"
          }>
            <AlertTitle className="flex items-center gap-2">
              {lastTestResult.success ? 
                <CheckCircle2 className="h-4 w-4 text-green-500" /> : 
                <AlertTriangle className="h-4 w-4 text-red-500" />
              }
              {lastTestResult.success ? 'הבדיקה הצליחה' : 'הבדיקה נכשלה'}
            </AlertTitle>
            <AlertDescription>
              איתות {lastTestResult.type === 'buy' ? 'קנייה' : 
                   lastTestResult.type === 'sell' ? 'מכירה' : 'מידע'} נבדק ב-{lastTestResult.time.toLocaleTimeString()}
            </AlertDescription>
          </Alert>
        )}
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
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            className="gap-1"
          >
            <Terminal className="h-3 w-3" />
            {showDebugInfo ? 'הסתר מידע טכני' : 'הצג מידע טכני'}
          </Button>
        </div>
        
        {showDebugInfo && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-900 rounded-md border text-xs font-mono">
            <h4 className="font-medium mb-1">מידע טכני:</h4>
            <div>
              <p>יעדים פעילים: {destinations.filter(d => d.active).length}</p>
              <p>טלגרם: {hasTelegram ? 'מוגדר ✓' : 'לא מוגדר ✗'}</p>
              <p>וואטסאפ: {hasWhatsApp ? 'מוגדר ✓' : 'לא מוגדר ✗'}</p>
              <p>סך יעדים: {destinations.length}</p>
              <p>פתח את קונסול הדפדפן (F12) לצפייה בלוגים מפורטים</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebhookTester;
