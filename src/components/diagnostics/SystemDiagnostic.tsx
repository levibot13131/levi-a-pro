
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  RefreshCw,
  Database,
  Wifi,
  Bot,
  TrendingUp,
  MessageSquare,
  Zap
} from 'lucide-react';
import { liveMarketDataService } from '@/services/trading/liveMarketDataService';
import { newsAggregationService } from '@/services/news/newsAggregationService';
import { toast } from 'sonner';

const SystemDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState({
    marketData: { status: 'checking', message: 'Initializing...', lastCheck: null },
    newsService: { status: 'checking', message: 'Initializing...', lastCheck: null },
    telegramBot: { status: 'checking', message: 'Initializing...', lastCheck: null },
    database: { status: 'checking', message: 'Initializing...', lastCheck: null },
    signalEngine: { status: 'checking', message: 'Initializing...', lastCheck: null }
  });
  
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    runDiagnostics();
    const interval = setInterval(runDiagnostics, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const runDiagnostics = async () => {
    setIsRunning(true);
    const results = { ...diagnostics };

    try {
      // Test Market Data Service
      console.log('🔍 Testing market data service...');
      try {
        const healthCheck = await liveMarketDataService.performHealthCheck();
        results.marketData = {
          status: healthCheck.overall ? 'success' : 'error',
          message: healthCheck.overall ? 
            `Connected to CoinGecko API - ${healthCheck.coinGecko ? 'Active' : 'Inactive'}` :
            'Market data API connection failed',
          lastCheck: new Date().toLocaleTimeString()
        };
      } catch (error) {
        results.marketData = {
          status: 'error',
          message: `Market data error: ${error.message}`,
          lastCheck: new Date().toLocaleTimeString()
        };
      }

      // Test News Service
      console.log('📰 Testing news aggregation service...');
      try {
        if (!newsAggregationService.isServiceRunning()) {
          await newsAggregationService.start();
        }
        
        const latestNews = await newsAggregationService.getLatestNews(3);
        results.newsService = {
          status: latestNews.length > 0 ? 'success' : 'warning',
          message: latestNews.length > 0 ? 
            `News service active - ${latestNews.length} recent articles` :
            'News service running but no recent articles',
          lastCheck: new Date().toLocaleTimeString()
        };
      } catch (error) {
        results.newsService = {
          status: 'error',
          message: `News service error: ${error.message}`,
          lastCheck: new Date().toLocaleTimeString()
        };
      }

      // Test Telegram Bot
      console.log('📱 Testing Telegram bot...');
      try {
        const response = await fetch('https://api.telegram.org/bot7607389220:AAHSUnDPTR_9iQEmMjZkSy5i0kepBotAUbA/getMe');
        const botData = await response.json();
        
        results.telegramBot = {
          status: botData.ok ? 'success' : 'error',
          message: botData.ok ? 
            `Bot active: ${botData.result.first_name} (@${botData.result.username})` :
            'Telegram bot connection failed',
          lastCheck: new Date().toLocaleTimeString()
        };
      } catch (error) {
        results.telegramBot = {
          status: 'error',
          message: `Telegram bot error: ${error.message}`,
          lastCheck: new Date().toLocaleTimeString()
        };
      }

      // Test Database Connection
      console.log('🗄️ Testing database connection...');
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase.from('api_status').select('count').limit(1);
        
        results.database = {
          status: !error ? 'success' : 'error',
          message: !error ? 
            'Supabase database connected' :
            `Database error: ${error.message}`,
          lastCheck: new Date().toLocaleTimeString()
        };
      } catch (error) {
        results.database = {
          status: 'error',
          message: `Database connection error: ${error.message}`,
          lastCheck: new Date().toLocaleTimeString()
        };
      }

      // Test Signal Engine
      console.log('🎯 Testing signal engine...');
      try {
        const { liveSignalEngine } = await import('@/services/trading/liveSignalEngine');
        const engineStatus = liveSignalEngine.getEngineStatus();
        
        results.signalEngine = {
          status: engineStatus.isRunning ? 'success' : 'warning',
          message: engineStatus.isRunning ? 
            `Engine active - ${engineStatus.totalSignals} signals generated` :
            'Signal engine stopped',
          lastCheck: new Date().toLocaleTimeString()
        };
      } catch (error) {
        results.signalEngine = {
          status: 'error',
          message: `Signal engine error: ${error.message}`,
          lastCheck: new Date().toLocaleTimeString()
        };
      }

    } catch (error) {
      console.error('❌ Diagnostic error:', error);
      toast.error('Diagnostic check failed');
    }

    setDiagnostics(results);
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500 animate-spin" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const diagnosticItems = [
    {
      key: 'marketData',
      title: 'Market Data Service',
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Live price feeds and market data'
    },
    {
      key: 'newsService',
      title: 'News Aggregation',
      icon: <Wifi className="h-5 w-5" />,
      description: 'Real-time crypto news and sentiment'
    },
    {
      key: 'telegramBot',
      title: 'Telegram Bot',
      icon: <MessageSquare className="h-5 w-5" />,
      description: 'Signal delivery and notifications'
    },
    {
      key: 'database',
      title: 'Database Connection',
      icon: <Database className="h-5 w-5" />,
      description: 'Supabase backend and data storage'
    },
    {
      key: 'signalEngine',
      title: 'Signal Engine',
      icon: <Zap className="h-5 w-5" />,
      description: 'AI trading signal generation'
    }
  ];

  const overallHealth = Object.values(diagnostics).every(d => d.status === 'success') ? 'success' :
                       Object.values(diagnostics).some(d => d.status === 'error') ? 'error' : 'warning';

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon(overallHealth)}
            System Diagnostics
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(overallHealth)}>
              {overallHealth === 'success' ? 'All Systems Operational' :
               overallHealth === 'warning' ? 'Some Issues Detected' : 'System Errors'}
            </Badge>
            <Button
              onClick={runDiagnostics}
              disabled={isRunning}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
              {isRunning ? 'Checking...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {diagnosticItems.map((item) => {
            const diagnostic = diagnostics[item.key];
            return (
              <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  {item.icon}
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(diagnostic.status)}
                    <Badge className={getStatusColor(diagnostic.status)}>
                      {diagnostic.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {diagnostic.lastCheck ? `Last check: ${diagnostic.lastCheck}` : 'Never checked'}
                  </p>
                  <p className="text-sm font-medium">{diagnostic.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemDiagnostic;
