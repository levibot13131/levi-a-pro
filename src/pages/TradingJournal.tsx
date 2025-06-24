
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock,
  Download,
  FileText,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/layout/Navbar';

interface SignalEntry {
  id: string;
  symbol: string;
  action: string;
  entry_price: number;
  target_price: number;
  stop_loss: number;
  confidence: number;
  outcome?: string;
  actual_profit_loss?: number;
  created_at: string;
  closed_at?: string;
  strategy: string;
  reasoning: string;
}

const TradingJournal: React.FC = () => {
  const [signals, setSignals] = useState<SignalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSignals: 0,
    successfulSignals: 0,
    successRate: 0,
    totalProfitLoss: 0,
    activeSignals: 0
  });

  useEffect(() => {
    loadSignalHistory();
  }, []);

  const loadSignalHistory = async () => {
    try {
      const { data, error } = await supabase
        .from('signal_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      if (data) {
        setSignals(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error loading signal history:', error);
      toast.error('שגיאה בטעינת היסטוריית איתותים');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (signalData: SignalEntry[]) => {
    const totalSignals = signalData.length;
    const successfulSignals = signalData.filter(s => s.outcome === 'profit').length;
    const successRate = totalSignals > 0 ? (successfulSignals / totalSignals) * 100 : 0;
    const totalProfitLoss = signalData.reduce((sum, s) => sum + (s.actual_profit_loss || 0), 0);
    const activeSignals = signalData.filter(s => !s.outcome || s.outcome === 'active').length;

    setStats({
      totalSignals,
      successfulSignals,
      successRate,
      totalProfitLoss,
      activeSignals
    });
  };

  const exportToCsv = () => {
    const headers = ['תאריך', 'נכס', 'פעולה', 'מחיר כניסה', 'מחיר יעד', 'עצירת הפסד', 'ביטחון', 'תוצאה', 'רווח/הפסד %'];
    const csvContent = [
      headers.join(','),
      ...signals.map(signal => [
        new Date(signal.created_at).toLocaleDateString('he-IL'),
        signal.symbol,
        signal.action === 'buy' ? 'קנייה' : 'מכירה',
        signal.entry_price,
        signal.target_price,
        signal.stop_loss,
        `${signal.confidence}%`,
        signal.outcome === 'profit' ? 'רווח' : signal.outcome === 'loss' ? 'הפסד' : 'פעיל',
        signal.actual_profit_loss || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `levipro-journal-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('יומן יוצא בהצלחה');
  };

  const getOutcomeColor = (outcome?: string, profitLoss?: number) => {
    if (!outcome || outcome === 'active') return 'bg-blue-50 text-blue-800';
    if (outcome === 'profit' || (profitLoss && profitLoss > 0)) return 'bg-green-50 text-green-800';
    return 'bg-red-50 text-red-800';
  };

  const getOutcomeText = (outcome?: string, profitLoss?: number) => {
    if (!outcome || outcome === 'active') return 'פעיל';
    if (outcome === 'profit' || (profitLoss && profitLoss > 0)) return 'רווח';
    return 'הפסד';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">טוען יומן מסחר...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <Card className="border-2 border-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-500" />
                יומן מסחר LeviPro
                <Badge variant="outline" className="text-blue-600">
                  מעקב ביצועים
                </Badge>
              </div>
              <Button onClick={exportToCsv} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                ייצוא ל-CSV
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded">
                <div className="text-2xl font-bold text-blue-600">{stats.totalSignals}</div>
                <div className="text-sm text-muted-foreground">סה"כ איתותים</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded">
                <div className="text-2xl font-bold text-green-600">{stats.successfulSignals}</div>
                <div className="text-sm text-muted-foreground">איתותים מוצלחים</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded">
                <div className="text-2xl font-bold text-purple-600">{stats.successRate.toFixed(1)}%</div>
                <div className="text-sm text-muted-foreground">אחוז הצלחה</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded">
                <div className={`text-2xl font-bold ${stats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.totalProfitLoss >= 0 ? '+' : ''}{stats.totalProfitLoss.toFixed(2)}%
                </div>
                <div className="text-sm text-muted-foreground">רווח/הפסד כולל</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded">
                <div className="text-2xl font-bold text-yellow-600">{stats.activeSignals}</div>
                <div className="text-sm text-muted-foreground">איתותים פעילים</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signal History */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="w-full">
            <TabsTrigger value="all">כל האיתותים</TabsTrigger>
            <TabsTrigger value="active">פעילים</TabsTrigger>
            <TabsTrigger value="closed">סגורים</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {signals.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">אין איתותים קיימים בתקופה זו</p>
                  <p className="text-sm text-muted-foreground">איתותים יופיעו כאן כאשר המערכת תזהה הזדמנויות מסחר</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {signals.map((signal) => (
                  <Card key={signal.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge className={getOutcomeColor(signal.outcome, signal.actual_profit_loss)}>
                            {getOutcomeText(signal.outcome, signal.actual_profit_loss)}
                          </Badge>
                          <Badge variant="outline">
                            {signal.action === 'buy' ? (
                              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 mr-1 text-red-500" />
                            )}
                            {signal.action === 'buy' ? 'קנייה' : 'מכירה'}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{signal.symbol}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(signal.created_at).toLocaleDateString('he-IL')} | 
                            {new Date(signal.created_at).toLocaleTimeString('he-IL')}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">מחיר כניסה</div>
                          <div className="font-semibold">${signal.entry_price}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">יעד</div>
                          <div className="font-semibold text-green-600">${signal.target_price}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">עצירת הפסד</div>
                          <div className="font-semibold text-red-600">${signal.stop_loss}</div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">ביטחון</div>
                          <div className="font-semibold">{signal.confidence}%</div>
                        </div>
                      </div>
                      
                      {signal.reasoning && (
                        <div className="mt-3 p-3 bg-gray-50 rounded">
                          <div className="text-sm font-medium mb-1">נימוק:</div>
                          <div className="text-sm text-muted-foreground">{signal.reasoning}</div>
                        </div>
                      )}
                      
                      {signal.actual_profit_loss && (
                        <div className="mt-3 flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            נסגר: {signal.closed_at ? new Date(signal.closed_at).toLocaleDateString('he-IL') : 'N/A'}
                          </div>
                          <div className={`font-bold ${signal.actual_profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {signal.actual_profit_loss >= 0 ? '+' : ''}{signal.actual_profit_loss.toFixed(2)}%
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            <div className="grid gap-4">
              {signals.filter(s => !s.outcome || s.outcome === 'active').map((signal) => (
                <Card key={signal.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-50 text-blue-800">פעיל</Badge>
                      <div className="text-right">
                        <div className="font-bold">{signal.symbol}</div>
                        <div className="text-sm text-muted-foreground">
                          {signal.action === 'buy' ? 'קנייה' : 'מכירה'} ב-${signal.entry_price}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="closed">
            <div className="grid gap-4">
              {signals.filter(s => s.outcome && s.outcome !== 'active').map((signal) => (
                <Card key={signal.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getOutcomeColor(signal.outcome, signal.actual_profit_loss)}>
                        {getOutcomeText(signal.outcome, signal.actual_profit_loss)}
                      </Badge>
                      <div className="text-right">
                        <div className="font-bold">{signal.symbol}</div>
                        <div className={`text-sm font-semibold ${signal.actual_profit_loss && signal.actual_profit_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {signal.actual_profit_loss ? `${signal.actual_profit_loss >= 0 ? '+' : ''}${signal.actual_profit_loss.toFixed(2)}%` : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradingJournal;
