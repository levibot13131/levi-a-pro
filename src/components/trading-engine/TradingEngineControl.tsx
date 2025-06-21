
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Settings, TrendingUp, PlayCircle, Square, TestTube, Bug, Zap } from 'lucide-react';
import { enhancedSignalEngine } from '@/services/trading/enhancedSignalEngine';
import { telegramBot } from '@/services/telegram/telegramBot';
import SignalQualityMonitor from './SignalQualityMonitor';
import SystemHealthMonitor from './SystemHealthMonitor';
import SignalRejectionMonitor from './SignalRejectionMonitor';
import FundamentalDataMonitor from './FundamentalDataMonitor';
import { toast } from 'sonner';

const TradingEngineControl: React.FC = () => {
  const [engineStatus, setEngineStatus] = useState(enhancedSignalEngine.getEngineStatus());
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);
  const [isTestingSignal, setIsTestingSignal] = useState(false);
  const [debugMode, setDebugMode] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEngineStatus(enhancedSignalEngine.getEngineStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartEngine = () => {
    console.log('🚀 Starting LeviPro Signal Engine with Enhanced Quality Scoring...');
    enhancedSignalEngine.startEliteEngine();
    setEngineStatus(enhancedSignalEngine.getEngineStatus());
    toast.success('🔥 LeviPro Enhanced Signal Engine activated!');
  };

  const handleStopEngine = () => {
    console.log('⏹️ Stopping LeviPro Signal Engine...');
    enhancedSignalEngine.stopEngine();
    setEngineStatus(enhancedSignalEngine.getEngineStatus());
    toast.info('Signal Engine stopped');
  };

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    try {
      console.log('🧪 Testing Telegram connection...');
      const testMessage = `🧪 <b>LeviPro Quality Signal Test</b>

📊 BTCUSDT
🟢 BUY @ $103,500
🎯 Target: $107,000 
🛑 Stop: $101,500
⚡ Confidence: 92%
📈 R/R: 1:2.75
🏆 Quality Score: 218/160

#LeviPro #QualityFilter #Test`;

      const success = await telegramBot.sendMessage(testMessage);
      if (success) {
        toast.success('✅ Test message sent successfully!');
      } else {
        toast.error('❌ Failed to send test message');
      }
    } catch (error) {
      console.error('❌ Error testing Telegram:', error);
      toast.error('❌ Error testing Telegram connection');
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const handleTestSignal = async () => {
    setIsTestingSignal(true);
    try {
      console.log('🧪 Generating test signal through scoring engine...');
      const success = await enhancedSignalEngine.sendTestSignal();
      if (success) {
        toast.success('✅ Test signal processed and sent!');
      } else {
        toast.error('❌ Failed to process test signal');
      }
    } catch (error) {
      console.error('❌ Error sending test signal:', error);
      toast.error('❌ Error generating test signal');
    } finally {
      setIsTestingSignal(false);
    }
  };

  const handleDebugModeToggle = (enabled: boolean) => {
    setDebugMode(enabled);
    enhancedSignalEngine.setDebugMode(enabled);
    toast.info(`🔧 Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold flex items-center justify-end gap-2">
          <Activity className="h-8 w-8" />
          מנוע המסחר LeviPro Enhanced
        </h1>
        <p className="text-muted-foreground">
          בקרה וניהול מנוע איתותים חכם עם ניקוד איכות משופר
        </p>
      </div>

      {/* Engine Control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            בקרת מנוע איתותים משופר
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={engineStatus.isRunning ? "default" : "secondary"}>
                {engineStatus.isRunning ? '🔥 פעיל' : '⏸️ מושבת'}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {engineStatus.signalQuality}
              </span>
              {engineStatus.scoringStats && (
                <Badge className="bg-purple-100 text-purple-800">
                  ניקוד: {engineStatus.scoringStats.threshold}+ נדרש
                </Badge>
              )}
              {engineStatus.debugMode && (
                <Badge className="bg-orange-100 text-orange-800">
                  🔧 Debug
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2">
              {!engineStatus.isRunning ? (
                <Button onClick={handleStartEngine} className="bg-green-600 hover:bg-green-700">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  הפעל מנוע
                </Button>
              ) : (
                <Button onClick={handleStopEngine} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  עצור מנוע
                </Button>
              )}
              
              <Button 
                onClick={handleTestTelegram} 
                variant="outline"
                disabled={isTestingTelegram}
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTestingTelegram ? 'שולח...' : 'בדיקת טלגרם'}
              </Button>

              <Button 
                onClick={handleTestSignal} 
                variant="outline"
                disabled={isTestingSignal}
                className="bg-blue-50 hover:bg-blue-100"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isTestingSignal ? 'יוצר...' : 'איתות בדיקה'}
              </Button>
            </div>
          </div>

          {/* Debug Mode Toggle */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <Switch
                checked={debugMode}
                onCheckedChange={handleDebugModeToggle}
              />
              <Bug className="h-4 w-4" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">מצב פיתוח</p>
              <p className="text-xs text-muted-foreground">
                הצגת פרטי ניקוד ודחייה בקונסול
              </p>
            </div>
          </div>

          {engineStatus.isRunning && (
            <div className="text-sm text-muted-foreground">
              ניתוח אחרון: {engineStatus.lastAnalysis}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Monitoring Dashboard */}
      <Tabs defaultValue="quality" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="quality">ניקוד איכות</TabsTrigger>
          <TabsTrigger value="rejections">איתותים שנדחו</TabsTrigger>
          <TabsTrigger value="health">בריאות מערכת</TabsTrigger>
          <TabsTrigger value="fundamental">נתוני יסוד</TabsTrigger>
          <TabsTrigger value="stats">סטטיסטיקות</TabsTrigger>
        </TabsList>

        <TabsContent value="quality" className="space-y-4">
          <SignalQualityMonitor />
        </TabsContent>

        <TabsContent value="rejections" className="space-y-4">
          <SignalRejectionMonitor />
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <SystemHealthMonitor />
        </TabsContent>

        <TabsContent value="fundamental" className="space-y-4">
          <FundamentalDataMonitor />
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          {/* Engine Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  הגדרות איכות משופרות
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span className="font-semibold">160+ נקודות</span>
                    <span>סף איכות מינימלי</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">1.8:1+</span>
                    <span>יחס R/R מינימום</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">75%+</span>
                    <span>Confidence מינימום</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">+25 נקודות</span>
                    <span>בונוס שיטה אישית</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">15 שניות</span>
                    <span>תדירות ניתוח</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  ביצועים יומיים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <span className="font-bold text-blue-600">{engineStatus.scoringStats?.totalAnalyzed || 0}</span>
                    <span>נותחו היום</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-green-600">{engineStatus.scoringStats?.totalPassed || 0}</span>
                    <span>עברו ניקוד איכות</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-purple-600">{engineStatus.scoringStats?.totalSent || 0}</span>
                    <span>נשלחו לטלגרם</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold">{engineStatus.scoringStats?.rejectionRate || 0}%</span>
                    <span>שיעור דחייה</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  מצב מערכת משופר
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-right">
                  <div className="flex justify-between">
                    <Badge className="bg-green-100 text-green-800">✅ מחובר</Badge>
                    <span>Telegram</span>
                  </div>
                  <div className="flex justify-between">
                    <Badge className="bg-green-100 text-green-800">✅ פעיל</Badge>
                    <span>ניקוד איכות</span>
                  </div>
                  <div className="flex justify-between">
                    <Badge className="bg-green-100 text-green-800">✅ חי</Badge>
                    <span>נתוני לווייתנים</span>
                  </div>
                  <div className="flex justify-between">
                    <Badge className="bg-green-100 text-green-800">✅ חי</Badge>
                    <span>מדד פחד ותאוות בצע</span>
                  </div>
                  <div className="flex justify-between">
                    <Badge className="bg-blue-100 text-blue-800">🔄 רצה</Badge>
                    <span>מנוע ניתוח</span>
                  </div>
                  <div className="flex justify-between">
                    <Badge className="bg-green-100 text-green-800">✅ חי</Badge>
                    <span>נתוני מחירים</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Live Activity */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
              <span className="text-blue-600 font-medium">
                {engineStatus.isRunning ? 'סורק שווקים עם ניקוד איכות משופר...' : 'מנוע במצב המתנה'}
              </span>
            </div>
            <div className="text-right">
              <p className="font-semibold">LeviPro Enhanced Engine + Advanced Quality Scoring</p>
              <p className="text-sm text-muted-foreground">
                {engineStatus.isRunning ? 'רק איתותים באיכות עליונה יישלחו' : 'לחץ הפעל כדי להתחיל'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingEngineControl;
