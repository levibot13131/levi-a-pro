
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { enhancedSignalEngine } from '@/services/trading/enhancedSignalEngine';
import { eliteSignalFilter } from '@/services/trading/eliteSignalFilter';
import { telegramBot } from '@/services/telegram/telegramBot';
import { PlayCircle, Square, TestTube, TrendingUp, Target, Shield } from 'lucide-react';
import { toast } from 'sonner';

const EliteSignalDashboard: React.FC = () => {
  const [engineStatus, setEngineStatus] = useState(enhancedSignalEngine.getEngineStatus());
  const [eliteStats, setEliteStats] = useState(eliteSignalFilter.getEliteStats());
  const [isTestingTelegram, setIsTestingTelegram] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setEngineStatus(enhancedSignalEngine.getEngineStatus());
      setEliteStats(eliteSignalFilter.getEliteStats());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleStartEngine = () => {
    enhancedSignalEngine.startEliteEngine();
    setEngineStatus(enhancedSignalEngine.getEngineStatus());
    toast.success('🔥 Elite Signal Engine activated');
  };

  const handleStopEngine = () => {
    enhancedSignalEngine.stopEngine();
    setEngineStatus(enhancedSignalEngine.getEngineStatus());
    toast.info('Signal Engine stopped');
  };

  const handleTestTelegram = async () => {
    setIsTestingTelegram(true);
    try {
      const success = await telegramBot.testEliteConnection();
      if (success) {
        toast.success('✅ Telegram Elite connection successful');
      } else {
        toast.error('❌ Telegram connection failed');
      }
    } catch (error) {
      toast.error('❌ Error testing Telegram connection');
    } finally {
      setIsTestingTelegram(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Engine Control */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            Elite Signal Engine
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
            </div>
            
            <div className="flex gap-2">
              {!engineStatus.isRunning ? (
                <Button onClick={handleStartEngine} className="bg-green-600 hover:bg-green-700">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  הפעל מנוע אליט
                </Button>
              ) : (
                <Button onClick={handleStopEngine} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  עצור
                </Button>
              )}
              
              <Button 
                onClick={handleTestTelegram} 
                variant="outline"
                disabled={isTestingTelegram}
              >
                <TestTube className="h-4 w-4 mr-2" />
                {isTestingTelegram ? 'בודק...' : 'בדיקת טלגרם'}
              </Button>
            </div>
          </div>

          {engineStatus.isRunning && (
            <div className="text-sm text-muted-foreground">
              ניתוח אחרון: {engineStatus.lastAnalysis || 'N/A'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Elite Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {eliteStats.dailySignals}
            </div>
            <div className="text-sm text-muted-foreground">איתותים היום</div>
            <div className="text-xs text-muted-foreground">
              נותרו: {eliteStats.config.maxSignalsPerDay - eliteStats.dailySignals}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {eliteStats.sessionSignals}
            </div>
            <div className="text-sm text-muted-foreground">סשן נוכחי</div>
            <div className="text-xs text-muted-foreground">
              נותרו: {eliteStats.config.maxSignalsPerSession - eliteStats.sessionSignals}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">≥{eliteStats.config.requiredRiskReward}</div>
            <div className="text-sm text-muted-foreground">יחס R/R מינימום</div>
            <div className="text-xs text-muted-foreground">רק איכות גבוהה</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{(eliteStats.config.requiredConfidence * 100).toFixed(0)}%</div>
            <div className="text-sm text-muted-foreground">Confidence מינימום</div>
            <div className="text-xs text-muted-foreground">פילטר אליט</div>
          </CardContent>
        </Card>
      </div>

      {/* Elite Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            קריטריונים אליט
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">פילטרי איכות:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Confidence מעל {(eliteStats.config.requiredConfidence * 100).toFixed(0)}%</li>
                <li>• יחס R/R מינימום {eliteStats.config.requiredRiskReward}:1</li>
                <li>• פוטנציאל רווח פי 4 על ההון</li>
                <li>• שיטה אישית - עדיפות עליונה</li>
              </ul>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">מגבלות בטיחות:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• מקסימום {eliteStats.config.maxSignalsPerSession} איתותים לסשן</li>
                <li>• מניעת קונפליקטים (5 דקות)</li>
                <li>• לחץ רגשי + מומנטום + פריצה</li>
                <li>• הודעות טלגרם מקצועיות</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EliteSignalDashboard;
