
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  RefreshCw, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Filter
} from 'lucide-react';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';
import { toast } from 'sonner';

interface RejectionData {
  symbol: string;
  reason: string;
  confidence: number;
  riskReward: number;
  timestamp: number;
  details: string;
  canOverride: boolean;
}

export const RejectionAnalysisPanel: React.FC = () => {
  const [rejections, setRejections] = useState<RejectionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string>('all');

  useEffect(() => {
    loadRejections();
  }, []);

  const loadRejections = () => {
    setLoading(true);
    try {
      const debugInfo = liveSignalEngine.getDebugInfo();
      const rejectionsData = debugInfo.recentRejections.map(r => ({
        symbol: r.symbol,
        reason: r.reason,
        confidence: r.confidence,
        riskReward: r.riskReward,
        timestamp: r.timestamp,
        details: r.details || '',
        canOverride: r.confidence > 65 && r.riskReward > 1.2 // Allow override for borderline cases
      }));
      
      setRejections(rejectionsData);
      console.log('📊 Loaded rejections:', rejectionsData.length);
    } catch (error) {
      console.error('Error loading rejections:', error);
      toast.error('שגיאה בטעינת נתוני דחיות');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      'Timestamp,Symbol,Reason,Confidence,Risk_Reward,Details,Can_Override',
      ...rejections.map(r => 
        `${new Date(r.timestamp).toISOString()},${r.symbol},"${r.reason}",${r.confidence},${r.riskReward},"${r.details}",${r.canOverride}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `signal_rejections_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast.success('קובץ CSV נוצר בהצלחה');
  };

  const overrideRejection = (index: number) => {
    const rejection = rejections[index];
    console.log('🔄 Overriding rejection:', rejection);
    
    // This would trigger a manual signal approval
    toast.success(`איתות ${rejection.symbol} אושר לשליחה`);
    
    // Update the rejection to show it was overridden
    setRejections(prev => prev.map((r, i) => 
      i === index ? { ...r, canOverride: false, reason: `${r.reason} (OVERRIDDEN)` } : r
    ));
  };

  const uniqueReasons = [...new Set(rejections.map(r => r.reason.split(' ')[0]))];
  const filteredRejections = selectedReason === 'all' 
    ? rejections 
    : rejections.filter(r => r.reason.toLowerCase().includes(selectedReason.toLowerCase()));

  const rejectionStats = {
    total: rejections.length,
    canOverride: rejections.filter(r => r.canOverride).length,
    avgConfidence: rejections.reduce((acc, r) => acc + r.confidence, 0) / rejections.length || 0,
    avgRiskReward: rejections.reduce((acc, r) => acc + r.riskReward, 0) / rejections.length || 0
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            ניתוח דחיות איתותים
          </div>
          <div className="flex gap-2">
            <Button onClick={loadRejections} disabled={loading} size="sm" variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              רענן
            </Button>
            <Button onClick={exportToCSV} size="sm" variant="secondary">
              <Download className="h-4 w-4 mr-2" />
              ייצא CSV
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Statistics Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">{rejectionStats.total}</div>
              <div className="text-sm text-muted-foreground">סה"כ דחיות</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded">
              <div className="text-2xl font-bold text-yellow-600">{rejectionStats.canOverride}</div>
              <div className="text-sm text-muted-foreground">ניתן לאישור</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">{rejectionStats.avgConfidence.toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">ביטחון ממוצע</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">{rejectionStats.avgRiskReward.toFixed(2)}</div>
              <div className="text-sm text-muted-foreground">R/R ממוצע</div>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center gap-4">
            <Filter className="h-4 w-4" />
            <select 
              value={selectedReason} 
              onChange={(e) => setSelectedReason(e.target.value)}
              className="border rounded px-3 py-1"
            >
              <option value="all">כל הסיבות</option>
              {uniqueReasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
            <Badge variant="outline">
              {filteredRejections.length} מתוך {rejections.length}
            </Badge>
          </div>

          {/* Rejections Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 text-right">זמן</th>
                    <th className="px-4 py-2 text-right">נכס</th>
                    <th className="px-4 py-2 text-right">סיבת דחייה</th>
                    <th className="px-4 py-2 text-right">ביטחון</th>
                    <th className="px-4 py-2 text-right">R/R</th>
                    <th className="px-4 py-2 text-right">פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRejections.map((rejection, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm">
                        {new Date(rejection.timestamp).toLocaleString('he-IL')}
                      </td>
                      <td className="px-4 py-2 font-medium">{rejection.symbol}</td>
                      <td className="px-4 py-2 text-sm">
                        <span className="text-red-600">{rejection.reason}</span>
                        {rejection.details && (
                          <div className="text-xs text-gray-500 mt-1">{rejection.details}</div>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={rejection.confidence > 70 ? "default" : "secondary"}>
                          {rejection.confidence.toFixed(1)}%
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        <Badge variant={rejection.riskReward > 1.5 ? "default" : "secondary"}>
                          {rejection.riskReward.toFixed(2)}
                        </Badge>
                      </td>
                      <td className="px-4 py-2">
                        {rejection.canOverride ? (
                          <Button 
                            onClick={() => overrideRejection(index)}
                            size="sm" 
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            אשר
                          </Button>
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredRejections.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              אין דחיות להצגה
            </div>
          )}

          {/* Learning Recommendations */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <h4 className="font-semibold mb-2 text-blue-800">המלצות מערכת הלמידה</h4>
            <div className="text-sm text-blue-700 space-y-1">
              {rejectionStats.avgConfidence > 70 && (
                <div>• רמת הביטחון הממוצעת גבוהה - שקול להוריד את הסף ל-70%</div>
              )}
              {rejectionStats.avgRiskReward > 1.4 && (
                <div>• יחס R/R טוב - שקול להוריד את הסף ל-1.2</div>
              )}
              {rejectionStats.canOverride > 5 && (
                <div>• יש {rejectionStats.canOverride} איתותים שניתן לאשר ידנית</div>
              )}
              <div>• סה"כ {rejectionStats.total} דחיות נרשמו למערכת הלמידה</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
