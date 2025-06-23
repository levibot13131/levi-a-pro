
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  BarChart3,
  Bot,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';
import Navbar from '@/components/layout/Navbar';

const TradingSignals: React.FC = () => {
  const [engineStatus, setEngineStatus] = useState({
    isRunning: false,
    totalSignals: 0,
    totalRejections: 0,
    lastAnalysis: 0,
    analysisCount: 0,
    lastAnalysisReport: ''
  });

  useEffect(() => {
    updateEngineStatus();
    const interval = setInterval(updateEngineStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateEngineStatus = () => {
    const status = liveSignalEngine.getEngineStatus();
    setEngineStatus(status);
  };

  const handleTestSignal = async () => {
    try {
      await liveSignalEngine.sendTestSignal();
      toast.success('✅ איתות בדיקה נשלח בהצלחה', {
        description: 'בדוק את הטלגרם לאישור משלוח'
      });
    } catch (error) {
      toast.error('❌ איתות הבדיקה נכשל', {
        description: 'בדוק את אבחון המערכת לבעיות'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-blue-500" />
                איתותי מסחר - LeviPro
                <Badge variant={engineStatus.isRunning ? "default" : "secondary"}>
                  {engineStatus.isRunning ? '🔥 פעיל' : '⏸️ מושהה'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleTestSignal}
                  variant="outline"
                  size="sm"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  איתות בדיקה
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${engineStatus.isRunning ? 'text-green-600' : 'text-red-600'}`}>
                  {engineStatus.isRunning ? 'פעיל' : 'כבוי'}
                </div>
                <div className="text-sm text-muted-foreground">סטטוס מנוע</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {engineStatus.totalSignals}
                </div>
                <div className="text-sm text-muted-foreground">איתותים נשלחו</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {engineStatus.totalRejections}
                </div>
                <div className="text-sm text-muted-foreground">איתותים נדחו</div>
              </div>
              
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {engineStatus.analysisCount}
                </div>
                <div className="text-sm text-muted-foreground">ניתוחים</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="live" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="live">איתותים חיים</TabsTrigger>
            <TabsTrigger value="history">היסטוריה</TabsTrigger>
            <TabsTrigger value="rejected">איתותים נדחו</TabsTrigger>
            <TabsTrigger value="settings">הגדרות</TabsTrigger>
          </TabsList>
          
          <TabsContent value="live" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>איתותים בזמן אמת</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4" />
                  <p>איתותים חיים יופיעו כאן</p>
                  <p className="text-sm">המערכת סורקת את השוק כל 30 שניות</p>
                  {engineStatus.isRunning && (
                    <div className="mt-4 p-3 bg-green-50 rounded">
                      <p className="text-green-800 font-semibold">✅ המנוע פעיל - בודק הזדמנויות מסחר</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>היסטוריית איתותים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                  <p>היסטוריית איתותים תופיע כאן</p>
                  <p className="text-sm">לאחר שליחת איתותים ראשונים</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="rejected" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>איתותים שנדחו</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingDown className="h-12 w-12 mx-auto mb-4" />
                  <p>איתותים שנדחו יופיעו כאן</p>
                  <p className="text-sm">עם הסבר מדוע נדחו</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>הגדרות איתותים</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                      <h4 className="font-semibold mb-2">רמת ביטחון מינימלית</h4>
                      <div className="text-2xl font-bold text-blue-600">70%</div>
                    </div>
                    
                    <div className="p-4 border rounded">
                      <h4 className="font-semibold mb-2">יחס סיכון/תשואה</h4>
                      <div className="text-2xl font-bold text-green-600">1:1.2</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Footer */}
        <Card className="border-dashed border-2">
          <CardContent className="py-4">
            <div className="text-center text-sm text-muted-foreground">
              📊 LeviPro AI Engine | 🤖 ניתוח אוטומטי | 📱 משלוח לטלגרם | ⚡ בזמן אמת
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingSignals;
