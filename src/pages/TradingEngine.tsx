import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  PlayCircle, 
  Square, 
  TrendingUp, 
  Bot, 
  Activity, 
  TestTube, 
  AlertCircle,
  CheckCircle,
  Stethoscope
} from 'lucide-react';
import { useEngineStatus } from '@/hooks/useEngineStatus';
import { enhancedSignalEngine } from '@/services/trading/enhancedSignalEngine';
import { autonomousOperationService } from '@/services/autonomous/autonomousOperationService';
import SystemHealthMonitor from '@/components/trading-engine/SystemHealthMonitor';
import EliteSignalDashboard from '@/components/signals/EliteSignalDashboard';
import SystemDiagnostic from '@/components/diagnostics/SystemDiagnostic';
import { toast } from 'sonner';

const TradingEngine: React.FC = () => {
  const { status, startEngine, stopEngine } = useEngineStatus();
  const [systemHealth, setSystemHealth] = useState(autonomousOperationService.getSystemHealth());
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!autonomousOperationService.isSystemOperational()) {
      autonomousOperationService.startAutonomousOperation();
    }

    const handleHealthUpdate = (event: CustomEvent) => {
      setSystemHealth(event.detail);
    };

    window.addEventListener('system-health-update', handleHealthUpdate as EventListener);

    const interval = setInterval(() => {
      setSystemHealth(autonomousOperationService.getSystemHealth());
    }, 10000);

    return () => {
      clearInterval(interval);
      window.removeEventListener('system-health-update', handleHealthUpdate as EventListener);
    };
  }, []);

  const handleTestSignal = async () => {
    try {
      const success = await enhancedSignalEngine.sendTestSignal();
      if (success) {
        toast.success('✅ Test signal sent successfully!');
      } else {
        toast.error('❌ Test signal failed - check system health');
      }
    } catch (error) {
      toast.error('❌ Error sending test signal');
    }
  };

  return (
    <div className="space-y-6">
      {/* System Status Header */}
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-blue-500" />
              LeviPro Trading Engine v1.0
              <Badge variant={systemHealth.isOperational ? "default" : "secondary"}>
                {systemHealth.isOperational ? '🔥 LIVE' : '⏸️ OFFLINE'}
              </Badge>
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
              <div className={`text-2xl font-bold ${systemHealth.isOperational ? 'text-green-600' : 'text-red-600'}`}>
                {systemHealth.isOperational ? 'OPERATIONAL' : 'OFFLINE'}
              </div>
              <div className="text-sm text-muted-foreground">System Status</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.floor(systemHealth.uptime / (1000 * 60 * 60))}h {Math.floor((systemHealth.uptime % (1000 * 60 * 60)) / (1000 * 60))}m
              </div>
              <div className="text-sm text-muted-foreground">Uptime</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {systemHealth.performanceMetrics.signalsGenerated}
              </div>
              <div className="text-sm text-muted-foreground">Signals Generated</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {(systemHealth.performanceMetrics.successRate * 100).toFixed(1)}%
              </div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="dashboard">Elite Dashboard</TabsTrigger>
          <TabsTrigger value="diagnostics" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Full Diagnostics
          </TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dashboard" className="space-y-4">
          <EliteSignalDashboard />
        </TabsContent>
        
        <TabsContent value="diagnostics" className="space-y-4">
          <SystemDiagnostic />
        </TabsContent>
        
        <TabsContent value="health" className="space-y-4">
          <SystemHealthMonitor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradingEngine;
