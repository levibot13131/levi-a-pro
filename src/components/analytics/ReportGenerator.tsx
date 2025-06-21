
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Send, Calendar, TrendingUp, Target } from 'lucide-react';
import { toast } from 'sonner';

interface ReportData {
  period: string;
  totalSignals: number;
  winRate: number;
  bestSignal: {
    symbol: string;
    profit: number;
    strategy: string;
  };
  worstSignal: {
    symbol: string;
    loss: number;
    strategy: string;
  };
  topStrategy: string;
  lessonsLearned: string[];
  accuracy: number;
}

export const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastReport, setLastReport] = useState<ReportData>({
    period: 'June 21, 2025',
    totalSignals: 8,
    winRate: 75.0,
    bestSignal: {
      symbol: 'BTCUSDT',
      profit: 420,
      strategy: 'Almog Personal Method'
    },
    worstSignal: {
      symbol: 'ETHUSDT',
      loss: -180,
      strategy: 'SMC Trading'
    },
    topStrategy: 'Almog Personal Method',
    lessonsLearned: [
      'Intelligence layer correctly identified whale accumulation in BTC',
      'Fear & Greed index at 25 provided excellent buying opportunities',
      'News sentiment helped avoid USDT FUD-related signals'
    ],
    accuracy: 78.5
  });

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated successfully!`);
      
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsGenerating(false);
    }
  };

  const exportReport = (format: 'csv' | 'pdf' | 'json') => {
    // Simulate export
    toast.success(`Report exported as ${format.toUpperCase()}`);
  };

  const sendToTelegram = async () => {
    try {
      const reportMessage = `
📊 <b>LeviPro ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report - ${lastReport.period}</b>

🎯 <b>Performance Summary:</b>
• Signals Sent: ${lastReport.totalSignals}
• Win Rate: ${lastReport.winRate}%
• Accuracy: ${lastReport.accuracy}%

🏆 <b>Best Signal:</b>
${lastReport.bestSignal.symbol} (+$${lastReport.bestSignal.profit})
Strategy: ${lastReport.bestSignal.strategy}

⚠️ <b>Worst Signal:</b>
${lastReport.worstSignal.symbol} ($${lastReport.worstSignal.loss})
Strategy: ${lastReport.worstSignal.strategy}

🧠 <b>Top Strategy:</b> ${lastReport.topStrategy}

💡 <b>Key Insights:</b>
${lastReport.lessonsLearned.map((lesson, i) => `${i + 1}. ${lesson}`).join('\n')}

#LeviPro #Report #Analytics
`;

      // Here you would integrate with actual Telegram bot
      toast.success('Report sent to Telegram successfully!');
      
    } catch (error) {
      toast.error('Failed to send report to Telegram');
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Automated Report Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily Report</SelectItem>
                <SelectItem value="weekly">Weekly Report</SelectItem>
                <SelectItem value="monthly">Monthly Report</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={generateReport} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Generate Report'}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportReport('pdf')}>
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportReport('json')}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
            <Button variant="outline" size="sm" onClick={sendToTelegram}>
              <Send className="h-4 w-4 mr-2" />
              Send to Telegram
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Last Generated Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Latest {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</span>
            <Badge variant="outline">{lastReport.period}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{lastReport.totalSignals}</div>
              <div className="text-sm text-muted-foreground">Signals Sent</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{lastReport.winRate}%</div>
              <div className="text-sm text-muted-foreground">Win Rate</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">{lastReport.accuracy}%</div>
              <div className="text-sm text-muted-foreground">Accuracy</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <div className="text-2xl font-bold text-orange-600">{lastReport.topStrategy.split(' ')[0]}</div>
              <div className="text-sm text-muted-foreground">Top Strategy</div>
            </div>
          </div>

          {/* Best & Worst Signals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  Best Signal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Symbol:</span>
                    <span className="font-semibold">{lastReport.bestSignal.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Profit:</span>
                    <span className="font-bold text-green-600">+${lastReport.bestSignal.profit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Strategy:</span>
                    <span className="text-sm">{lastReport.bestSignal.strategy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-600" />
                  Worst Signal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Symbol:</span>
                    <span className="font-semibold">{lastReport.worstSignal.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loss:</span>
                    <span className="font-bold text-red-600">${lastReport.worstSignal.loss}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Strategy:</span>
                    <span className="text-sm">{lastReport.worstSignal.strategy}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lessons Learned */}
          <Card>
            <CardHeader>
              <CardTitle>Key Insights & Lessons Learned</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lastReport.lessonsLearned.map((lesson, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded">
                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-sm flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-sm">{lesson}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};
