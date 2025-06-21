
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, Settings, TrendingUp, PlayCircle, Square, TestTube } from 'lucide-react';
import { enhancedSignalEngine } from '@/services/trading/enhancedSignalEngine';
import { telegramBot } from '@/services/telegram/telegramBot';
import SignalQualityMonitor from './SignalQualityMonitor';
import { toast } from 'sonner';

const TradingEngineControl: React.FC = () => {
  const [engineStatus, setEngineStatus] = useState(enhancedSignalEngine.getEngineStatus());
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEngineStatus(enhancedSignalEngine.getEngineStatus());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartEngine = () => {
    console.log('🚀 Starting LeviPro Signal Engine with Quality Scoring...');
    enhancedSignalEngine.startEliteEngine();
    setEngineStatus(enhancedSignalEngine.getEngineStatus());
    toast.success('🔥 LeviPro Signal Engine with Quality Scoring activated!');
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
🟢 BUY @ $43,250
🎯 Target: $44,500 
🛑 Stop: $42,800
⚡ Confidence: 95%
📈 R/R: 1:1.7
🏆 Quality Score: 187/160

#LeviPro #QualityFilter #Test`;

      const success = await telegramBot.sendMessage(testMessage);
      if (success) {
        toast.success('✅ Test signal with quality score sent successfully!');
      } else {
        toast.error('❌ Failed to send test signal');
      }
    } catch (error) {
      console.error('❌ Error testing Telegram:', error);
      toast.error('❌ Error testing Telegram connection');
    } finally {
      setIsTestingTelegram(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold flex items-center justify-end gap-2">
          <Activity className="h-8 w-8" />
          מנוע המסחר LeviPro
        </h1>
        <p className="text-muted-foreground">
          בקרה וניהול מנוע איתותים חכם עם ניקוד איכות
        </p>
      </div>

      {/* Engine Control */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Activity className="h-5 w-5 text-blue-500" />
            בקרת מנוע איתותים
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
                {isTestingTelegram ? 'שולח...' : 'איתות בדיקה'}
              </Button>
            </div>
          </div>

          {engineStatus.isRunning && (
            <div className="text-sm text-muted-foreground">
              ניתוח אחרון: {engineStatus.lastAnalysis}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Signal Quality Monitor */}
      <SignalQualityMonitor />

      {/* Engine Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Settings className="h-5 w-5" />
              הגדרות איכות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-right">
              <div className="flex justify-between">
                <span className="font-semibold">160+ נקודות</span>
                <span>סף איכות מינימלי</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">2:1+</span>
                <span>יחס R/R מינימום</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">80%+</span>
                <span>Confidence מינימום</span>
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
                <span className="font-bold text-blue-600">{engineStatus.eliteStats?.dailySignalCount || 0}</span>
                <span>איתותים היום</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-green-600">{engineStatus.scoringStats?.totalPassed || 0}</span>
                <span>עברו ניקוד איכות</span>
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
              מצב מערכת
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
                <Badge className="bg-blue-100 text-blue-800">🔄 רצה</Badge>
                <span>מנוע ניתוח</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity */}
      <Card className="bg-gradient-to-r from-blue-50 to-green-50">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500 animate-pulse" />
              <span className="text-blue-600 font-medium">
                {engineStatus.isRunning ? 'סורק שווקים עם ניקוד איכות...' : 'מנוע במצב המתנה'}
              </span>
            </div>
            <div className="text-right">
              <p className="font-semibold">LeviPro Elite Engine + Quality Scoring</p>
              <p className="text-sm text-muted-foreground">
                {engineStatus.isRunning ? 'רק איתותים באיכות גבוהה יישלחו' : 'לחץ הפעל כדי להתחיל'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingEngineControl;
