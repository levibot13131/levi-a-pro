
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Settings, TrendingUp, PlayCircle, Square, TestTube, Bug, Zap } from 'lucide-react';
import { enhancedSignalEngine } from '@/services/trading/enhancedSignalEngine';
import { telegramBot } from '@/services/telegram/telegramBot';
import TelegramSetup from '@/components/telegram/TelegramSetup';
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
      const success = await telegramBot.testEliteConnection();
      if (success) {
        toast.success('✅ Telegram Elite connection successful - Check @mytrsdingbot!');
      } else {
        toast.error('❌ Telegram connection failed - Configure bot token first');
      }
    } catch (error) {
      console.error('Telegram test error:', error);
      toast.error('❌ Error testing Telegram connection');
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const handleTestSignal = async () => {
    setIsTestingSignal(true);
    try {
      const success = await enhancedSignalEngine.sendTestSignal();
      if (success) {
        toast.success('🧪 Test signal generated and sent to Telegram!');
      } else {
        toast.error('❌ Test signal failed');
      }
    } catch (error) {
      console.error('Test signal error:', error);
      toast.error('❌ Error generating test signal');
    } finally {
      setIsTestingSignal(false);
    }
  };

  const handleToggleDebug = (enabled: boolean) => {
    setDebugMode(enabled);
    enhancedSignalEngine.setDebugMode(enabled);
    toast.info(`🔧 Debug mode ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      {/* Engine Control Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              LeviPro Enhanced Signal Engine
            </div>
            <Badge variant={engineStatus.isRunning ? "default" : "secondary"}>
              {engineStatus.isRunning ? '🔥 Active' : '⏸️ Stopped'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                {engineStatus.signalQuality}
              </p>
              {engineStatus.isRunning && (
                <p className="text-xs text-muted-foreground">
                  Last analysis: {engineStatus.lastAnalysis}
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              {!engineStatus.isRunning ? (
                <Button onClick={handleStartEngine} className="bg-green-600 hover:bg-green-700">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Elite Engine
                </Button>
              ) : (
                <Button onClick={handleStopEngine} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Engine
                </Button>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 flex-wrap">
            <Button 
              onClick={handleTestTelegram} 
              variant="outline" 
              size="sm"
              disabled={isTestingTelegram}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isTestingTelegram ? 'Testing...' : 'Test Telegram'}
            </Button>
            
            <Button 
              onClick={handleTestSignal} 
              variant="outline" 
              size="sm"
              disabled={isTestingSignal}
            >
              <Zap className="h-4 w-4 mr-2" />
              {isTestingSignal ? 'Generating...' : 'Send Test Signal'}
            </Button>
            
            <div className="flex items-center gap-2 ml-auto">
              <Switch
                id="debug-mode"
                checked={debugMode}
                onCheckedChange={handleToggleDebug}
              />
              <label htmlFor="debug-mode" className="text-sm">
                <Bug className="h-4 w-4 inline mr-1" />
                Debug Mode
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabbed Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="rejection">Rejection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Engine Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {engineStatus.scoringStats?.totalSent || 0}
                </div>
                <div className="text-sm text-muted-foreground">Signals Sent Today</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {engineStatus.scoringStats?.rejectionRate || 0}%
                </div>
                <div className="text-sm text-muted-foreground">Rejection Rate</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {engineStatus.scoringStats?.threshold || 160}
                </div>
                <div className="text-sm text-muted-foreground">Quality Threshold</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {engineStatus.aiLearning?.totalSignalsLearned || 0}
                </div>
                <div className="text-sm text-muted-foreground">Signals Learned</div>
              </CardContent>
            </Card>
          </div>

          {/* AI Learning Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                AI Learning Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Overall Win Rate</p>
                  <p className="text-lg font-semibold text-green-600">
                    {engineStatus.aiLearning?.overallWinRate || 0}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Performer</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {engineStatus.aiLearning?.topPerformer || 'Learning...'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="telegram">
          <TelegramSetup />
        </TabsContent>
        
        <TabsContent value="quality">
          <SignalQualityMonitor />
        </TabsContent>
        
        <TabsContent value="health">
          <SystemHealthMonitor />
        </TabsContent>
        
        <TabsContent value="rejection">
          <SignalRejectionMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingEngineControl;
