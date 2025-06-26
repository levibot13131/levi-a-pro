import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlayCircle, 
  Square, 
  Bot, 
  TestTube, 
  Stethoscope,
  Eye,
  BarChart3,
  BookOpen,
  Zap,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';
import { backgroundSignalService } from '@/services/trading/backgroundSignalService';
import EnhancedSystemDiagnostic from '@/components/diagnostics/EnhancedSystemDiagnostic';
import ImprovedLiveCandlestickChart from '@/components/charts/ImprovedLiveCandlestickChart';
import TradingJournalDashboard from '@/components/journal/TradingJournalDashboard';
import WhyNoSignalBanner from '@/components/trading-engine/WhyNoSignalBanner';
import { SignalEngineDebugPanel } from '@/components/diagnostics/SignalEngineDebugPanel';
import AIIntelligenceDashboard from '@/components/ai/AIIntelligenceDashboard';

const TradingEngine: React.FC = () => {
  const [engineStatus, setEngineStatus] = useState({
    isRunning: false,
    totalSignals: 0,
    totalRejections: 0,
    lastAnalysis: 0,
    analysisCount: 0,
    lastAnalysisReport: ''
  });
  const [backgroundStatus, setBackgroundStatus] = useState({
    isRunning: false,
    lastHeartbeat: '',
    uptime: 0
  });
  const [activeTab, setActiveTab] = useState('control');

  useEffect(() => {
    updateEngineStatus();
    const interval = setInterval(updateEngineStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateEngineStatus = () => {
    const status = liveSignalEngine.getEngineStatus();
    const bgStatus = backgroundSignalService.getStatus();
    setEngineStatus(status);
    setBackgroundStatus(bgStatus);
  };

  const handleStartEngine = () => {
    liveSignalEngine.start();
    backgroundSignalService.startBackgroundProcessing();
    
    toast.success('🚀 LeviPro Engine Activated - Full Production Mode', {
      description: 'Real-time analysis + background processing now active'
    });
    updateEngineStatus();
  };

  const handleStopEngine = () => {
    liveSignalEngine.stop();
    backgroundSignalService.stopBackgroundProcessing();
    
    toast.info('🛑 LeviPro Engine Stopped', {
      description: 'Real-time analysis paused'
    });
    updateEngineStatus();
  };

  const handleTestSignal = async () => {
    try {
      await liveSignalEngine.sendTestSignal();
      toast.success('✅ Test Signal Sent Successfully', {
        description: 'Check Telegram for delivery confirmation'
      });
    } catch (error) {
      toast.error('❌ Test Signal Failed', {
        description: 'Check system diagnostics for issues'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Why No Signal Banner */}
      <WhyNoSignalBanner />

      {/* Enhanced Debug Panel - NEW */}
      <SignalEngineDebugPanel />

      {/* AI Intelligence Dashboard - NEW */}
      <AIIntelligenceDashboard />

      {/* Engine Control Header */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-500" />
              LeviPro v1.0 - Production Trading Engine
              <Badge variant={engineStatus.isRunning ? "default" : "secondary"}>
                {engineStatus.isRunning ? '🔥 LIVE' : '⏸️ PAUSED'}
              </Badge>
              {backgroundStatus.isRunning && (
                <Badge variant="outline" className="text-green-600">
                  <Activity className="h-3 w-3 mr-1" />
                  24/7 ACTIVE
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleTestSignal}
                variant="outline"
                size="sm"
              >
                <TestTube className="h-4 w-4 mr-2" />
                Test Signal
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className={`text-2xl font-bold ${engineStatus.isRunning ? 'text-green-600' : 'text-red-600'}`}>
                {engineStatus.isRunning ? 'OPERATIONAL' : 'OFFLINE'}
              </div>
              <div className="text-sm text-muted-foreground">Engine Status</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {engineStatus.totalSignals}
              </div>
              <div className="text-sm text-muted-foreground">Signals Sent</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {engineStatus.totalRejections}
              </div>
              <div className="text-sm text-muted-foreground">Signals Rejected</div>
            </div>
            
            <div className="text-center">
              <div className="flex gap-2 justify-center">
                {!engineStatus.isRunning ? (
                  <Button onClick={handleStartEngine} className="bg-green-600 hover:bg-green-700">
                    <PlayCircle className="h-4 w-4 mr-2" />
                    START ENGINE
                  </Button>
                ) : (
                  <Button onClick={handleStopEngine} variant="destructive">
                    <Square className="h-4 w-4 mr-2" />
                    STOP ENGINE
                  </Button>
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Control</div>
            </div>
          </div>

          {/* Background Service Status */}
          {backgroundStatus.isRunning && (
            <div className="mt-4 p-3 bg-green-50 rounded border">
              <h4 className="font-semibold text-sm mb-2 text-green-800">🌐 24/7 Background Processing Active</h4>
              <div className="text-xs text-green-700">
                • Signals continue even when browser is closed
                • Last heartbeat: {new Date(backgroundStatus.lastHeartbeat).toLocaleTimeString()}
                • Automatic market analysis every 60 seconds
                • Telegram delivery guaranteed
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="control">Engine Control</TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            AI Intelligence
          </TabsTrigger>
          <TabsTrigger value="debug" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Signal Debug
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Live Charts
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Trading Journal
          </TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Full Diagnostics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="control" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🎯 Real-Time Signal Generation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Engine Mode:</span>
                    <Badge variant={engineStatus.isRunning ? "default" : "secondary"}>
                      {engineStatus.isRunning ? 'Live Analysis' : 'Stopped'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Real-time Scanning:</span>
                    <span className={engineStatus.isRunning ? 'text-green-500' : 'text-red-500'}>
                      {engineStatus.isRunning ? '✅ Active (30s intervals)' : '❌ Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Background Processing:</span>
                    <span className={backgroundStatus.isRunning ? 'text-green-500' : 'text-red-500'}>
                      {backgroundStatus.isRunning ? '✅ 24/7 Active' : '❌ Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Multi-timeframe Analysis:</span>
                    <span className={engineStatus.isRunning ? 'text-green-500' : 'text-red-500'}>
                      {engineStatus.isRunning ? '✅ 15m-4h confluence' : '❌ Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sentiment Integration:</span>
                    <span className={engineStatus.isRunning ? 'text-green-500' : 'text-red-500'}>
                      {engineStatus.isRunning ? '✅ Active + Volume' : '❌ Inactive'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Telegram Delivery:</span>
                    <span className="text-green-500">✅ Secured (ID: 809305569)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>📊 Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Filter Success Rate:</span>
                    <span className="text-green-500 font-bold">
                      {engineStatus.totalSignals > 0 ? Math.round((engineStatus.totalSignals / (engineStatus.totalSignals + engineStatus.totalRejections)) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Signals Sent:</span>
                    <span className="font-bold text-green-600">
                      {engineStatus.totalSignals}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Signals Rejected:</span>
                    <span className="font-bold text-red-600">
                      {engineStatus.totalRejections}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum Confidence:</span>
                    <span className="text-orange-600 font-bold">70%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Minimum R/R:</span>
                    <span className="text-orange-600 font-bold">1.2:1</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Analysis:</span>
                    <span className="text-sm text-muted-foreground">
                      {engineStatus.lastAnalysis ? new Date(engineStatus.lastAnalysis).toLocaleTimeString() : 'Never'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>🔍 Recent Activity & "Why No Signal" Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="h-12 w-12 mx-auto mb-4" />
                <p>Signal analysis logs will appear here</p>
                <p className="text-sm">Start the engine to see real-time decision reasoning</p>
                {engineStatus.isRunning && (
                  <div className="mt-4 p-3 bg-blue-50 rounded">
                    <p className="text-blue-800 font-semibold">✅ Engine Running - Check console for live rejection logs</p>
                    <p className="text-xs text-blue-600">Rejections logged with: confidence %, R/R ratio, sentiment score, volume analysis</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="ai" className="space-y-4">
          <AIIntelligenceDashboard />
        </TabsContent>
        
        <TabsContent value="debug" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>🔍 Why No Signals? - Enhanced Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <h4 className="font-semibold text-yellow-800 mb-2">Current Status</h4>
                    <p className="text-sm text-yellow-700">
                      The system has been temporarily configured with relaxed filters to identify why no signals are being generated:
                    </p>
                    <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                      <li>• Confidence threshold: 70% (was 80%)</li>
                      <li>• Risk/Reward ratio: 1.2 (was 1.5)</li>
                      <li>• Price movement: 1.5% (was 2.5%)</li>
                      <li>• Volume spike: Optional (was required)</li>
                      <li>• Sentiment confirmation: Optional (was required)</li>
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded">
                      <h5 className="font-semibold mb-2">Analysis Frequency</h5>
                      <p className="text-sm text-muted-foreground">
                        ✅ Every 30 seconds<br/>
                        ✅ 6 symbols monitored<br/>
                        ✅ Real-time CoinGecko data<br/>
                        ✅ Live sentiment analysis
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded">
                      <h5 className="font-semibold mb-2">Signal Pipeline</h5>
                      <p className="text-sm text-muted-foreground">
                        ✅ Market data collection<br/>
                        ✅ Technical analysis<br/>
                        ✅ Risk/reward calculation<br/>
                        ✅ Telegram delivery ready
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="charts" className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            <ImprovedLiveCandlestickChart symbol="BTCUSDT" height={500} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImprovedLiveCandlestickChart symbol="ETHUSDT" height={400} />
              <ImprovedLiveCandlestickChart symbol="SOLUSDT" height={400} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="journal" className="space-y-4">
          <TradingJournalDashboard />
        </TabsContent>
        
        <TabsContent value="diagnostics" className="space-y-4">
          <EnhancedSystemDiagnostic />
        </TabsContent>
      </Tabs>

      {/* Coming Soon Section */}
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="text-center">🚀 Coming Soon in LeviPro v1.1</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Strategy Backtesting</h3>
              <p className="text-sm text-muted-foreground">Historical performance analysis</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Behavioral AI Filters</h3>
              <p className="text-sm text-muted-foreground">Anti-manipulation detection</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Custom AI Personas</h3>
              <p className="text-sm text-muted-foreground">Personalized trading styles</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-semibold">Signal Performance Reports</h3>
              <p className="text-sm text-muted-foreground">Weekly AI insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingEngine;
