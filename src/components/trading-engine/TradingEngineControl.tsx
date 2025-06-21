
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Activity, Settings, TrendingUp, PlayCircle, Square, TestTube, Bug, Zap, Brain } from 'lucide-react';
import { enhancedSignalEngine } from '@/services/trading/enhancedSignalEngine';
import { telegramBot } from '@/services/telegram/telegramBot';
import TelegramSetup from '@/components/telegram/TelegramSetup';
import IntelligenceDashboard from '@/components/intelligence/IntelligenceDashboard';
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
    console.log('🧪 Starting Telegram connection test...');
    
    try {
      // First check connection status
      const status = telegramBot.getConnectionStatus();
      console.log('📊 Current connection status:', status);
      
      if (!status.connected) {
        toast.error('❌ Telegram not configured - Please set bot token first');
        return;
      }
      
      const success = await telegramBot.testEliteConnection();
      if (success) {
        toast.success('✅ Test message sent successfully! Check @mytrsdingbot', {
          description: `Message sent to chat ${status.chatId}`,
          duration: 5000
        });
      } else {
        toast.error('❌ Test message failed - Check console for detailed logs', {
          description: 'Verify bot token and chat ID are correct',
          duration: 10000
        });
      }
    } catch (error) {
      console.error('Telegram test error:', error);
      toast.error('❌ Error testing Telegram connection', {
        description: error.message || 'Unknown error occurred'
      });
    } finally {
      setIsTestingTelegram(false);
    }
  };

  const handleTestSignal = async () => {
    setIsTestingSignal(true);
    console.log('🎯 Generating test signal...');
    
    try {
      // Check Telegram connection first
      const status = telegramBot.getConnectionStatus();
      if (!status.connected) {
        toast.error('❌ Configure Telegram first before sending test signals');
        return;
      }
      
      const success = await enhancedSignalEngine.sendTestSignal();
      if (success) {
        toast.success('🧪 Test signal generated and sent to Telegram!', {
          description: 'Check @mytrsdingbot for the signal',
          duration: 5000
        });
      } else {
        toast.error('❌ Test signal failed - Check console logs');
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
              LeviPro Intelligence-Enhanced Signal Engine
            </div>
            <Badge variant={engineStatus.isRunning ? "default" : "secondary"}>
              {engineStatus.isRunning ? '🧠 Intelligence Active' : '⏸️ Stopped'}
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
                  Intelligence layer: Whale + Sentiment + Fear/Greed + Risk Analysis
                </p>
              )}
            </div>
            
            <div className="flex gap-2">
              {!engineStatus.isRunning ? (
                <Button onClick={handleStartEngine} className="bg-green-600 hover:bg-green-700">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Start Intelligence Engine
                </Button>
              ) : (
                <Button onClick={handleStopEngine} variant="destructive">
                  <Square className="h-4 w-4 mr-2" />
                  Stop Engine
                </Button>
              )}
            </div>
          </div>

          {/* Intelligence Features Badge */}
          {engineStatus.isRunning && (
            <div className="mb-4 p-3 bg-blue-50 rounded border">
              <h4 className="font-semibold text-sm mb-2 text-blue-800">🧠 Intelligence Features Active</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Badge variant="outline" className="text-xs">🐋 Whale Monitor</Badge>
                <Badge variant="outline" className="text-xs">📱 Sentiment</Badge>
                <Badge variant="outline" className="text-xs">😰 Fear/Greed</Badge>
                <Badge variant="outline" className="text-xs">🚨 Risk Scoring</Badge>
              </div>
            </div>
          )}

          {/* Debug info for Telegram */}
          {debugMode && (
            <div className="mb-4 p-3 bg-slate-100 rounded border">
              <h4 className="font-semibold text-sm mb-2">🔧 Debug Info</h4>
              <div className="text-xs space-y-1">
                <div>Intelligence Enhanced: {engineStatus.scoringStats?.intelligenceEnhanced || 0} signals</div>
                <div>Telegram Status: {telegramBot.getConnectionStatus().status}</div>
                <div>Bot Token Length: {telegramBot.getConnectionStatus().tokenLength}</div>
                <div>Chat ID: {telegramBot.getConnectionStatus().chatId}</div>
                <div>Has Credentials: {telegramBot.getConnectionStatus().hasCredentials ? '✅' : '❌'}</div>
              </div>
            </div>
          )}

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
              {isTestingSignal ? 'Generating...' : 'Send Intelligence Test'}
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="telegram">Telegram</TabsTrigger>
          <TabsTrigger value="intelligence">Intelligence</TabsTrigger>
          <TabsTrigger value="quality">Quality</TabsTrigger>
          <TabsTrigger value="health">Health</TabsTrigger>
          <TabsTrigger value="rejection">Rejection</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Enhanced Engine Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
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
                <div className="text-2xl font-bold text-purple-600">
                  {engineStatus.scoringStats?.intelligenceEnhanced || 0}
                </div>
                <div className="text-sm text-muted-foreground">Intelligence Enhanced</div>
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
                <div className="text-2xl font-bold text-orange-600">
                  160
                </div>
                <div className="text-sm text-muted-foreground">Quality Threshold</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">
                  🧠
                </div>
                <div className="text-sm text-muted-foreground">AI + Intelligence</div>
              </CardContent>
            </Card>
          </div>

          {/* Intelligence Layer Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-500" />
                Real-Time Intelligence Layer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Whale Activity Monitoring</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {engineStatus.intelligenceLayer?.whaleMonitoring ? '🐋 Active' : '❌ Offline'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sentiment Analysis</p>
                  <p className="text-lg font-semibold text-green-600">
                    {engineStatus.intelligenceLayer?.sentimentAnalysis ? '📱 Live' : '❌ Offline'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fear & Greed Index</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {engineStatus.intelligenceLayer?.fearGreedIntegration ? '😰 Tracking' : '❌ Offline'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Fundamental Risk Scoring</p>
                  <p className="text-lg font-semibold text-red-600">
                    {engineStatus.intelligenceLayer?.fundamentalRiskScoring ? '🚨 Active' : '❌ Offline'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="telegram">
          <TelegramSetup />
        </TabsContent>
        
        <TabsContent value="intelligence">
          <IntelligenceDashboard />
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
