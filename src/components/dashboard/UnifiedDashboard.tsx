import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayCircle, Square, Activity, TrendingUp, Target, Shield, Brain, BarChart3 } from 'lucide-react';
import { enhancedSignalEngine } from '@/services/trading/enhancedSignalEngine';
import { marketIntelligenceEngine } from '@/services/intelligence/marketIntelligenceEngine';
import { multiTimeframeEngine } from '@/services/analysis/multiTimeframeEngine';
import { autonomousOperationService } from '@/services/autonomous/autonomousOperationService';
import ComprehensiveTradingJournal from '../trading/ComprehensiveTradingJournal';
import TelegramStatusIndicator from '../telegram/TelegramStatusIndicator';
import LiveNewsFeed from '../news/LiveNewsFeed';
import EnhancedTradingChart from '../charts/EnhancedTradingChart';
import ManualTradeEntry, { ManualTradeData } from '../journal/ManualTradeEntry';
import { toast } from 'sonner';

const UnifiedDashboard: React.FC = () => {
  const [signalEngineStatus, setSignalEngineStatus] = useState(enhancedSignalEngine.getEngineStatus());
  const [marketIntelligence, setMarketIntelligence] = useState(marketIntelligenceEngine.getIntelligence());
  const [multiTimeframeSignals, setMultiTimeframeSignals] = useState(multiTimeframeEngine.getRecentSignals());
  const [systemHealth, setSystemHealth] = useState(autonomousOperationService.getSystemHealth());
  const [manualTrades, setManualTrades] = useState<ManualTradeData[]>([]);

  useEffect(() => {
    // Status update interval
    const statusInterval = setInterval(() => {
      setSignalEngineStatus(enhancedSignalEngine.getEngineStatus());
      setMarketIntelligence(marketIntelligenceEngine.getIntelligence());
      setMultiTimeframeSignals(multiTimeframeEngine.getRecentSignals());
      setSystemHealth(autonomousOperationService.getSystemHealth());
    }, 5000);

    // Listen for system events
    const handleIntelligenceUpdate = (event: CustomEvent) => {
      setMarketIntelligence(event.detail);
    };

    const handleHighProbabilitySetup = (event: CustomEvent) => {
      const setup = event.detail;
      toast.success(`🎯 High-Probability Setup: ${setup.symbol} (${setup.confluence}% confluence)`);
      setMultiTimeframeSignals(prev => [setup, ...prev.slice(0, 19)]);
    };

    const handleSystemOperational = (event: CustomEvent) => {
      toast.success('🚀 LeviPro is now fully operational and autonomous');
    };

    const handleAutonomousLearning = (event: CustomEvent) => {
      const { iteration, successRate, improvements } = event.detail;
      toast.info(`🧠 AI Learning Cycle ${iteration} - Success Rate: ${(successRate * 100).toFixed(1)}%`);
    };

    window.addEventListener('market-intelligence-update', handleIntelligenceUpdate as EventListener);
    window.addEventListener('high-probability-setup', handleHighProbabilitySetup as EventListener);
    window.addEventListener('system-operational', handleSystemOperational as EventListener);
    window.addEventListener('autonomous-learning-update', handleAutonomousLearning as EventListener);

    return () => {
      clearInterval(statusInterval);
      window.removeEventListener('market-intelligence-update', handleIntelligenceUpdate as EventListener);
      window.removeEventListener('high-probability-setup', handleHighProbabilitySetup as EventListener);
      window.removeEventListener('system-operational', handleSystemOperational as EventListener);
      window.removeEventListener('autonomous-learning-update', handleAutonomousLearning as EventListener);
    };
  }, []);

  const startAllEngines = async () => {
    await autonomousOperationService.startAutonomousOperation();
    toast.success('🚀 All engines activated - LeviPro is now running autonomously 24/7');
  };

  const stopAllEngines = () => {
    autonomousOperationService.stopAutonomousOperation();
    toast.info('⏹️ Autonomous operation stopped');
  };

  const handleAddManualTrade = (trade: ManualTradeData) => {
    setManualTrades(prev => [trade, ...prev]);
  };

  const isSystemRunning = systemHealth.isOperational;
  const highProbabilitySetups = multiTimeframeSignals.filter(s => s.highProbabilitySetup);

  return (
    <div className="space-y-6">
      {/* Master Control Panel */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-6 w-6 text-blue-500" />
              LeviPro Autonomous Control Center
            </div>
            <TelegramStatusIndicator />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
            {Object.entries(systemHealth.components).map(([component, status]) => (
              <div key={component} className="flex items-center gap-2">
                <Badge variant={status ? "default" : "secondary"}>
                  {component === 'marketIntelligence' && <Brain className="h-3 w-3 mr-1" />}
                  {component === 'multiTimeframe' && <BarChart3 className="h-3 w-3 mr-1" />}
                  {component === 'signalEngine' && <Target className="h-3 w-3 mr-1" />}
                  {component === 'newsAggregation' && <Activity className="h-3 w-3 mr-1" />}
                  {component === 'autonomousLearning' && <Brain className="h-3 w-3 mr-1" />}
                  {component.replace(/([A-Z])/g, ' $1').toLowerCase()}: {status ? 'ON' : 'OFF'}
                </Badge>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 items-center">
            {!isSystemRunning ? (
              <Button onClick={startAllEngines} className="bg-green-600 hover:bg-green-700">
                <PlayCircle className="h-4 w-4 mr-2" />
                Start Autonomous Operation
              </Button>
            ) : (
              <Button onClick={stopAllEngines} variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                Stop Autonomous Operation
              </Button>
            )}
            
            <div className="flex items-center gap-4 text-sm">
              <span>Uptime: {Math.floor(systemHealth.uptime / 60000)}m</span>
              <span>Signals: {systemHealth.performanceMetrics.signalsGenerated}</span>
              <span>Success: {(systemHealth.performanceMetrics.successRate * 100).toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Market Intelligence Overview */}
      {marketIntelligence && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {marketIntelligence.sentiment.overall.toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground">Market Sentiment</div>
              <div className="text-xs text-muted-foreground">
                {marketIntelligence.sentiment.confidence.toFixed(0)}% confidence
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-orange-600">
                {marketIntelligence.newsFlow.highImpact.length}
              </div>
              <div className="text-sm text-muted-foreground">High Impact News</div>
              <div className="text-xs text-muted-foreground">
                Live from {marketIntelligence.newsFlow.recent.length} sources
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {marketIntelligence.whaleActivity.recentMoves.length}
              </div>
              <div className="text-sm text-muted-foreground">Whale Moves</div>
              <div className="text-xs text-muted-foreground">
                {marketIntelligence.whaleActivity.sentiment}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${
                marketIntelligence.riskLevel === 'low' ? 'text-green-600' :
                marketIntelligence.riskLevel === 'medium' ? 'text-yellow-600' :
                marketIntelligence.riskLevel === 'high' ? 'text-orange-600' : 'text-red-600'
              }`}>
                {marketIntelligence.riskLevel.toUpperCase()}
              </div>
              <div className="text-sm text-muted-foreground">Risk Level</div>
              <div className="text-xs text-muted-foreground">
                Updated {new Date(marketIntelligence.lastUpdated).toLocaleTimeString()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* High Probability Setups */}
      {highProbabilitySetups.length > 0 && (
        <Card className="border-2 border-green-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              🎯 Elite High Probability Setups ({highProbabilitySetups.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {highProbabilitySetups.slice(0, 3).map((setup, index) => (
                <div key={index} className="border rounded-lg p-4 bg-green-50 dark:bg-green-900/20">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-lg">{setup.symbol}</span>
                      <Badge variant="default" className="bg-green-600">
                        {setup.confluence.toFixed(0)}% Confluence
                      </Badge>
                      <Badge variant={setup.overallDirection === 'bullish' ? 'default' : 'destructive'}>
                        {setup.overallDirection.toUpperCase()}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      R/R: {setup.riskReward.toFixed(2)}:1
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Entry:</span>
                      <div className="font-medium">${setup.entryPrice.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stop Loss:</span>
                      <div className="font-medium">${setup.stopLoss.toFixed(2)}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Target 1:</span>
                      <div className="font-medium">${setup.targets[0].toFixed(2)}</div>
                    </div>
                  </div>
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    Autonomous AI detected cross-timeframe confluence at {new Date(setup.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full">
          <TabsTrigger value="overview">System Overview</TabsTrigger>
          <TabsTrigger value="charts">Live Charts</TabsTrigger>
          <TabsTrigger value="news">Market Intelligence</TabsTrigger>
          <TabsTrigger value="signals">Active Signals</TabsTrigger>
          <TabsTrigger value="journal">Trading Journal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Autonomous Operation Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>System Status:</span>
                    <Badge variant={systemHealth.isOperational ? "default" : "secondary"}>
                      {systemHealth.isOperational ? '🤖 AUTONOMOUS' : '⏸️ STANDBY'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning Engine:</span>
                    <Badge variant="default">🧠 CONTINUOUS</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Management:</span>
                    <Badge variant="default">🛡️ PROTECTED</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>24/7 Operation:</span>
                    <Badge variant="default">✅ ACTIVE</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Signals Generated:</span>
                    <span className="font-semibold">{systemHealth.performanceMetrics.signalsGenerated}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>High Probability:</span>
                    <span className="font-semibold text-green-600">{highProbabilitySetups.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-semibold">{(systemHealth.performanceMetrics.successRate * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Learning Cycles:</span>
                    <span className="font-semibold">{systemHealth.performanceMetrics.learningIterations}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="charts">
          <EnhancedTradingChart symbol="BTCUSDT" height={600} />
        </TabsContent>
        
        <TabsContent value="news">
          <LiveNewsFeed />
        </TabsContent>
        
        <TabsContent value="signals">
          <Card>
            <CardHeader>
              <CardTitle>Live Signal Feed</CardTitle>
            </CardHeader>
            <CardContent>
              {multiTimeframeSignals.length > 0 ? (
                <div className="space-y-4">
                  {multiTimeframeSignals.slice(0, 5).map((signal, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{signal.symbol}</span>
                          <Badge variant={signal.overallDirection === 'bullish' ? 'default' : 'destructive'}>
                            {signal.overallDirection.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {signal.confluence.toFixed(0)}% confluence
                          </Badge>
                          {signal.highProbabilitySetup && (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              ELITE SETUP
                            </Badge>
                          )}
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(signal.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Entry: ${signal.entryPrice.toFixed(2)} | Stop: ${signal.stopLoss.toFixed(2)} | R/R: {signal.riskReward.toFixed(2)}:1
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  🤖 Autonomous signal detection is active. Elite setups will appear here.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="journal" className="space-y-4">
          <ManualTradeEntry onAddTrade={handleAddManualTrade} />
          <ComprehensiveTradingJournal />
          {manualTrades.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Manual Entries</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {manualTrades.slice(0, 5).map(trade => (
                    <div key={trade.id} className="flex justify-between items-center border rounded p-2">
                      <span>{trade.symbol} - {trade.direction.toUpperCase()}</span>
                      <span>${trade.entryPrice.toFixed(2)}</span>
                      <Badge variant={trade.status === 'open' ? 'secondary' : trade.pnl && trade.pnl > 0 ? 'default' : 'destructive'}>
                        {trade.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnifiedDashboard;
