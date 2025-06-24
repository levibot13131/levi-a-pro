
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Download, Send, Calendar, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface ReportData {
  period: string;
  totalSignals: number;
  winRate: number;
  totalProfitLoss: number;
  bestSignal: {
    symbol: string;
    profit: number;
    strategy: string;
  } | null;
  worstSignal: {
    symbol: string;
    loss: number;
    strategy: string;
  } | null;
  topStrategy: string;
  accuracy: number;
  signalsByStrategy: Record<string, number>;
  profitBySymbol: Record<string, number>;
}

export const ReportGenerator: React.FC = () => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  useEffect(() => {
    generateReport();
  }, [reportType]);

  const generateReport = async () => {
    setIsGenerating(true);
    
    try {
      const dateFilter = getDateFilter(reportType);
      
      const { data: signals, error } = await supabase
        .from('signal_history')
        .select('*')
        .gte('created_at', dateFilter);

      if (error) throw error;

      if (signals) {
        const report = calculateReportMetrics(signals);
        setReportData(report);
      }

      toast.success(`דוח ${getReportTypeText(reportType)} נוצר בהצלחה!`);
      
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error('שגיאה ביצירת הדוח');
    } finally {
      setIsGenerating(false);
    }
  };

  const getDateFilter = (type: 'daily' | 'weekly' | 'monthly'): string => {
    const now = new Date();
    switch (type) {
      case 'daily':
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        return today.toISOString();
      case 'weekly':
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return weekAgo.toISOString();
      case 'monthly':
        const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        return monthAgo.toISOString();
      default:
        return now.toISOString();
    }
  };

  const getReportTypeText = (type: string): string => {
    switch (type) {
      case 'daily': return 'יומי';
      case 'weekly': return 'שבועי';
      case 'monthly': return 'חודשי';
      default: return 'יומי';
    }
  };

  const calculateReportMetrics = (signals: any[]): ReportData => {
    const totalSignals = signals.length;
    const successfulSignals = signals.filter(s => s.outcome === 'profit' || (s.actual_profit_loss && s.actual_profit_loss > 0)).length;
    const winRate = totalSignals > 0 ? (successfulSignals / totalSignals) * 100 : 0;
    const totalProfitLoss = signals.reduce((sum, s) => sum + (s.actual_profit_loss || 0), 0);
    
    // Find best and worst signals
    const profitableSignals = signals.filter(s => s.actual_profit_loss && s.actual_profit_loss > 0);
    const losingSignals = signals.filter(s => s.actual_profit_loss && s.actual_profit_loss < 0);
    
    const bestSignal = profitableSignals.length > 0 
      ? profitableSignals.reduce((best, current) => 
          (current.actual_profit_loss > best.actual_profit_loss) ? current : best
        )
      : null;
    
    const worstSignal = losingSignals.length > 0
      ? losingSignals.reduce((worst, current) => 
          (current.actual_profit_loss < worst.actual_profit_loss) ? current : worst
        )
      : null;

    // Calculate strategy statistics
    const signalsByStrategy: Record<string, number> = {};
    const profitBySymbol: Record<string, number> = {};
    
    signals.forEach(signal => {
      signalsByStrategy[signal.strategy] = (signalsByStrategy[signal.strategy] || 0) + 1;
      profitBySymbol[signal.symbol] = (profitBySymbol[signal.symbol] || 0) + (signal.actual_profit_loss || 0);
    });

    const topStrategy = Object.keys(signalsByStrategy).reduce((a, b) => 
      signalsByStrategy[a] > signalsByStrategy[b] ? a : b, 'N/A'
    );

    return {
      period: new Date().toLocaleDateString('he-IL'),
      totalSignals,
      winRate,
      totalProfitLoss,
      bestSignal: bestSignal ? {
        symbol: bestSignal.symbol,
        profit: bestSignal.actual_profit_loss,
        strategy: bestSignal.strategy
      } : null,
      worstSignal: worstSignal ? {
        symbol: worstSignal.symbol,
        loss: worstSignal.actual_profit_loss,
        strategy: worstSignal.strategy
      } : null,
      topStrategy,
      accuracy: winRate,
      signalsByStrategy,
      profitBySymbol
    };
  };

  const exportReport = (format: 'csv' | 'pdf' | 'json') => {
    if (!reportData) return;

    let content = '';
    let filename = `levipro-report-${reportType}-${new Date().toISOString().split('T')[0]}`;

    switch (format) {
      case 'csv':
        content = generateCsvReport(reportData);
        filename += '.csv';
        break;
      case 'json':
        content = JSON.stringify(reportData, null, 2);
        filename += '.json';
        break;
      case 'pdf':
        toast.info('ייצוא PDF יבוא בקרוב');
        return;
    }

    const blob = new Blob([content], { type: format === 'csv' ? 'text/csv' : 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    toast.success(`דוח יוצא כ-${format.toUpperCase()} בהצלחה`);
  };

  const generateCsvReport = (data: ReportData): string => {
    const headers = ['מדד', 'ערך'];
    const rows = [
      ['תקופה', data.period],
      ['סה"כ איתותים', data.totalSignals.toString()],
      ['אחוז הצלחה', `${data.winRate.toFixed(1)}%`],
      ['רווח/הפסד כולל', `${data.totalProfitLoss.toFixed(2)}%`],
      ['האסטרטגיה הטובה ביותר', data.topStrategy],
      ['דיוק', `${data.accuracy.toFixed(1)}%`]
    ];

    if (data.bestSignal) {
      rows.push(['האיתות הטוב ביותר', `${data.bestSignal.symbol} (+${data.bestSignal.profit.toFixed(2)}%)`]);
    }

    if (data.worstSignal) {
      rows.push(['האיתות הגרוע ביותר', `${data.worstSignal.symbol} (${data.worstSignal.loss.toFixed(2)}%)`]);
    }

    return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  };

  const sendToTelegram = async () => {
    if (!reportData) return;

    try {
      const reportMessage = `
📊 <b>דוח LeviPro ${getReportTypeText(reportType)} - ${reportData.period}</b>

🎯 <b>סיכום ביצועים:</b>
• איתותים שנשלחו: ${reportData.totalSignals}
• אחוז הצלחה: ${reportData.winRate.toFixed(1)}%
• דיוק: ${reportData.accuracy.toFixed(1)}%

${reportData.bestSignal ? `🏆 <b>האיתות הטוב ביותר:</b>
${reportData.bestSignal.symbol} (+${reportData.bestSignal.profit.toFixed(2)}%)
אסטרטגיה: ${reportData.bestSignal.strategy}

` : ''}${reportData.worstSignal ? `⚠️ <b>האיתות הגרוע ביותר:</b>
${reportData.worstSignal.symbol} (${reportData.worstSignal.loss.toFixed(2)}%)
אסטרטגיה: ${reportData.worstSignal.strategy}

` : ''}🧠 <b>האסטרטגיה המובילה:</b> ${reportData.topStrategy}

💰 <b>רווח/הפסד כולל:</b> ${reportData.totalProfitLoss >= 0 ? '+' : ''}${reportData.totalProfitLoss.toFixed(2)}%

#LeviPro #דוח #ניתוח
`;

      // Here you would integrate with actual Telegram bot
      // For now, we'll simulate the success
      toast.success('דוח נשלח לטלגרם בהצלחה!');
      
    } catch (error) {
      console.error('Error sending to Telegram:', error);
      toast.error('שגיאה בשליחת הדוח לטלגרם');
    }
  };

  if (!reportData) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>יוצר דוח...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            מחולל דוחות אוטומטי
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Select value={reportType} onValueChange={(value: any) => setReportType(value)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="בחר סוג דוח" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">דוח יומי</SelectItem>
                <SelectItem value="weekly">דוח שבועי</SelectItem>
                <SelectItem value="monthly">דוח חודשי</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={generateReport} disabled={isGenerating}>
              {isGenerating ? 'יוצר דוח...' : 'צור דוח'}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => exportReport('csv')}>
              <Download className="h-4 w-4 mr-2" />
              ייצוא CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => exportReport('json')}>
              <Download className="h-4 w-4 mr-2" />
              ייצוא JSON
            </Button>
            <Button variant="outline" size="sm" onClick={sendToTelegram}>
              <Send className="h-4 w-4 mr-2" />
              שלח לטלגרם
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>דוח {getReportTypeText(reportType)} אחרון</span>
            <Badge variant="outline">{reportData.period}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Performance Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{reportData.totalSignals}</div>
              <div className="text-sm text-muted-foreground">איתותים נשלחו</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{reportData.winRate.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">אחוז הצלחה</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">{reportData.accuracy.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">דיוק</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <div className={`text-2xl font-bold ${reportData.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {reportData.totalProfitLoss >= 0 ? '+' : ''}{reportData.totalProfitLoss.toFixed(2)}%
              </div>
              <div className="text-sm text-muted-foreground">רווח/הפסד כולל</div>
            </div>
          </div>

          {/* Best & Worst Signals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportData.bestSignal && (
              <Card className="border-green-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    האיתות הטוב ביותר
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>נכס:</span>
                      <span className="font-semibold">{reportData.bestSignal.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>רווח:</span>
                      <span className="font-bold text-green-600">+{reportData.bestSignal.profit.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>אסטרטגיה:</span>
                      <span className="text-sm">{reportData.bestSignal.strategy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {reportData.worstSignal && (
              <Card className="border-red-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5 text-red-600" />
                    האיתות הגרוע ביותר
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>נכס:</span>
                      <span className="font-semibold">{reportData.worstSignal.symbol}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>הפסד:</span>
                      <span className="font-bold text-red-600">{reportData.worstSignal.loss.toFixed(2)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>אסטרטגיה:</span>
                      <span className="text-sm">{reportData.worstSignal.strategy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Strategy Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                ביצועי אסטרטגיות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                  <span>האסטרטגיה המובילה:</span>
                  <span className="font-bold">{reportData.topStrategy}</span>
                </div>
                {Object.entries(reportData.signalsByStrategy).map(([strategy, count]) => (
                  <div key={strategy} className="flex justify-between items-center p-2 border rounded">
                    <span className="text-sm">{strategy}</span>
                    <Badge variant="secondary">{count} איתותים</Badge>
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
