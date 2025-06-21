
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Eye, History } from 'lucide-react';
import { toast } from 'sonner';

interface AuditLog {
  id: string;
  timestamp: Date;
  signalId: string;
  symbol: string;
  strategy: string;
  action: 'buy' | 'sell';
  price: number;
  targetPrice: number;
  stopLoss: number;
  confidence: number;
  fundamentalRisk: 'Low' | 'Medium' | 'High';
  intelligenceData: {
    whaleActivity: string;
    sentiment: string;
    fearGreed: string;
    newsImpact: string;
  };
  outcome: 'pending' | 'tp' | 'sl' | 'manual_exit';
  profitLoss?: number;
  profitPercent?: number;
  exitReason?: string;
  riskData: {
    positionSize: number;
    riskAmount: number;
    exposurePercent: number;
  };
}

export const AuditLogs: React.FC = () => {
  const [logs] = useState<AuditLog[]>([
    {
      id: 'SIG_001',
      timestamp: new Date('2024-06-21T10:30:00'),
      signalId: 'elite-20240621-001',
      symbol: 'BTCUSDT',
      strategy: 'Almog Personal Method',
      action: 'buy',
      price: 67850.50,
      targetPrice: 69200.00,
      stopLoss: 66500.00,
      confidence: 0.92,
      fundamentalRisk: 'Low',
      intelligenceData: {
        whaleActivity: 'Bullish Accumulation',
        sentiment: 'Positive',
        fearGreed: 'Neutral (52)',
        newsImpact: 'ETF Inflows Positive'
      },
      outcome: 'tp',
      profitLoss: 950.00,
      profitPercent: 2.1,
      exitReason: 'Target reached',
      riskData: {
        positionSize: 2.3,
        riskAmount: 150.00,
        exposurePercent: 1.5
      }
    },
    {
      id: 'SIG_002',
      timestamp: new Date('2024-06-21T14:15:00'),
      signalId: 'elite-20240621-002',
      symbol: 'ETHUSDT',
      strategy: 'Wyckoff Analysis',
      action: 'sell',
      price: 3520.75,
      targetPrice: 3420.00,
      stopLoss: 3580.00,
      confidence: 0.78,
      fundamentalRisk: 'Medium',
      intelligenceData: {
        whaleActivity: 'Distribution Phase',
        sentiment: 'Bearish',
        fearGreed: 'Fear (28)',
        newsImpact: 'Regulatory Concerns'
      },
      outcome: 'sl',
      profitLoss: -85.00,
      profitPercent: -1.7,
      exitReason: 'Stop loss hit',
      riskData: {
        positionSize: 1.8,
        riskAmount: 120.00,
        exposurePercent: 1.2
      }
    }
  ]);

  const [filters, setFilters] = useState({
    search: '',
    symbol: 'all',
    strategy: 'all',
    outcome: 'all',
    risk: 'all'
  });

  const filteredLogs = logs.filter(log => {
    return (
      (filters.search === '' || 
       log.symbol.toLowerCase().includes(filters.search.toLowerCase()) ||
       log.signalId.toLowerCase().includes(filters.search.toLowerCase()) ||
       log.strategy.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.symbol === 'all' || log.symbol === filters.symbol) &&
      (filters.strategy === 'all' || log.strategy === filters.strategy) &&
      (filters.outcome === 'all' || log.outcome === filters.outcome) &&
      (filters.risk === 'all' || log.fundamentalRisk === filters.risk)
    );
  });

  const exportLogs = () => {
    const dataStr = JSON.stringify(filteredLogs, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'levipro_audit_logs.json';
    link.click();
    toast.success('Audit logs exported successfully');
  };

  const getOutcomeBadge = (outcome: string, profitPercent?: number) => {
    switch (outcome) {
      case 'tp':
        return <Badge className="bg-green-100 text-green-800">TP Hit (+{profitPercent?.toFixed(1)}%)</Badge>;
      case 'sl':
        return <Badge className="bg-red-100 text-red-800">SL Hit ({profitPercent?.toFixed(1)}%)</Badge>;
      case 'manual_exit':
        return <Badge className="bg-blue-100 text-blue-800">Manual Exit</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };
    return <Badge className={colors[risk as keyof typeof colors]}>{risk} Risk</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Signal Audit Logs & History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by symbol, signal ID, or strategy..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filters.symbol} onValueChange={(value) => setFilters({...filters, symbol: value})}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Symbol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Symbols</SelectItem>
                <SelectItem value="BTCUSDT">BTCUSDT</SelectItem>
                <SelectItem value="ETHUSDT">ETHUSDT</SelectItem>
                <SelectItem value="SOLUSDT">SOLUSDT</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.outcome} onValueChange={(value) => setFilters({...filters, outcome: value})}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Outcomes</SelectItem>
                <SelectItem value="tp">Target Hit</SelectItem>
                <SelectItem value="sl">Stop Loss</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportLogs} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs List */}
      <Card>
        <CardHeader>
          <CardTitle>Signal History ({filteredLogs.length} records)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{log.signalId}</Badge>
                    <span className="font-semibold">{log.symbol}</span>
                    <Badge variant={log.action === 'buy' ? 'default' : 'destructive'}>
                      {log.action.toUpperCase()}
                    </Badge>
                    {getOutcomeBadge(log.outcome, log.profitPercent)}
                    {getRiskBadge(log.fundamentalRisk)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {log.timestamp.toLocaleString()}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <h5 className="font-semibold text-sm mb-2">Price Data</h5>
                    <div className="text-sm space-y-1">
                      <div>Entry: ${log.price.toFixed(2)}</div>
                      <div>Target: ${log.targetPrice.toFixed(2)}</div>
                      <div>Stop: ${log.stopLoss.toFixed(2)}</div>
                      <div>Confidence: {(log.confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-2">Intelligence Data</h5>
                    <div className="text-sm space-y-1">
                      <div>🐋 {log.intelligenceData.whaleActivity}</div>
                      <div>📱 {log.intelligenceData.sentiment}</div>
                      <div>😰 {log.intelligenceData.fearGreed}</div>
                      <div>📰 {log.intelligenceData.newsImpact}</div>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-semibold text-sm mb-2">Risk & Position</h5>
                    <div className="text-sm space-y-1">
                      <div>Position: {log.riskData.positionSize}%</div>
                      <div>Risk: ${log.riskData.riskAmount}</div>
                      <div>Exposure: {log.riskData.exposurePercent}%</div>
                      {log.profitLoss && (
                        <div className={log.profitLoss > 0 ? 'text-green-600' : 'text-red-600'}>
                          P&L: ${log.profitLoss} ({log.profitPercent?.toFixed(1)}%)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t">
                  <div>
                    <span className="text-sm font-medium">Strategy:</span>
                    <span className="text-sm ml-2">{log.strategy}</span>
                  </div>
                  {log.exitReason && (
                    <div>
                      <span className="text-sm text-muted-foreground">Exit Reason: {log.exitReason}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
