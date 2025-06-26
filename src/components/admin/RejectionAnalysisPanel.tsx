
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Download, 
  Search, 
  AlertTriangle, 
  TrendingDown,
  Filter
} from 'lucide-react';
import { liveSignalEngine } from '@/services/trading/liveSignalEngine';

interface RejectionData {
  symbol: string;
  reason: string;
  confidence: number;
  riskReward: number;
  timestamp: number;
  details?: string;
}

export const RejectionAnalysisPanel: React.FC = () => {
  const [rejections, setRejections] = useState<RejectionData[]>([]);
  const [filteredRejections, setFilteredRejections] = useState<RejectionData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReason, setSelectedReason] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRejections();
    const interval = setInterval(loadRejections, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    filterRejections();
  }, [rejections, searchTerm, selectedReason]);

  const loadRejections = () => {
    try {
      const recentRejections = liveSignalEngine.getRecentRejections(100);
      setRejections(recentRejections);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load rejections:', error);
      setLoading(false);
    }
  };

  const filterRejections = () => {
    let filtered = rejections;

    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedReason !== 'all') {
      filtered = filtered.filter(r => r.reason.includes(selectedReason));
    }

    setFilteredRejections(filtered);
  };

  const exportToCSV = () => {
    const csvContent = [
      'Symbol,Reason,Confidence,Risk/Reward,Timestamp,Details',
      ...filteredRejections.map(r => 
        `${r.symbol},"${r.reason}",${r.confidence},${r.riskReward},${new Date(r.timestamp).toISOString()},"${r.details || ''}"`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `signal_rejections_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const getReasonColor = (reason: string) => {
    if (reason.includes('confidence') || reason.includes('ביטחון')) return 'bg-red-100 text-red-800';
    if (reason.includes('heat') || reason.includes('חום')) return 'bg-orange-100 text-orange-800';
    if (reason.includes('cooldown') || reason.includes('קול-דאון')) return 'bg-blue-100 text-blue-800';
    if (reason.includes('timeframe') || reason.includes('מסגרת')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const uniqueReasons = Array.from(new Set(rejections.map(r => {
    if (r.reason.includes('confidence') || r.reason.includes('ביטחון')) return 'confidence';
    if (r.reason.includes('heat') || r.reason.includes('חום')) return 'heat';
    if (r.reason.includes('cooldown') || r.reason.includes('קול-דאון')) return 'cooldown';
    if (r.reason.includes('timeframe') || r.reason.includes('מסגרת')) return 'timeframe';
    return 'other';
  })));

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>טוען נתוני דחיות...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5" />
            ניתוח דחיות איתותים ({filteredRejections.length})
          </span>
          <Button onClick={exportToCSV} size="sm">
            <Download className="h-4 w-4 mr-2" />
            ייצא CSV
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="חיפוש לפי סמל או סיבה..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-48">
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="all">כל הסיבות</option>
                {uniqueReasons.map(reason => (
                  <option key={reason} value={reason}>
                    {reason === 'confidence' ? 'ביטחון נמוך' :
                     reason === 'heat' ? 'חום גבוה' :
                     reason === 'cooldown' ? 'קול-דאון' :
                     reason === 'timeframe' ? 'מסגרת זמן' : 'אחר'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Rejections Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="p-3 text-right">זמן</th>
                    <th className="p-3 text-right">סמל</th>
                    <th className="p-3 text-right">סיבת דחייה</th>
                    <th className="p-3 text-right">ביטחון</th>
                    <th className="p-3 text-right">R/R</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRejections.map((rejection, index) => (
                    <tr key={index} className="border-t hover:bg-gray-50">
                      <td className="p-3">
                        {new Date(rejection.timestamp).toLocaleTimeString('he-IL')}
                      </td>
                      <td className="p-3">
                        <Badge variant="outline">{rejection.symbol}</Badge>
                      </td>
                      <td className="p-3">
                        <Badge className={getReasonColor(rejection.reason)}>
                          {rejection.reason.length > 50 ? 
                            rejection.reason.substring(0, 50) + '...' : 
                            rejection.reason}
                        </Badge>
                      </td>
                      <td className="p-3 font-mono">
                        {rejection.confidence.toFixed(1)}%
                      </td>
                      <td className="p-3 font-mono">
                        {rejection.riskReward.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {filteredRejections.length === 0 && (
            <div className="text-center py-8">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-gray-500">אין דחיות המתאימות לחיפוש</p>
            </div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center p-3 bg-red-50 rounded">
              <div className="text-lg font-bold text-red-600">
                {rejections.filter(r => r.reason.includes('confidence') || r.reason.includes('ביטחון')).length}
              </div>
              <div className="text-xs text-gray-600">ביטחון נמוך</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded">
              <div className="text-lg font-bold text-orange-600">
                {rejections.filter(r => r.reason.includes('heat') || r.reason.includes('חום')).length}
              </div>
              <div className="text-xs text-gray-600">חום גבוה</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-lg font-bold text-blue-600">
                {rejections.filter(r => r.reason.includes('cooldown') || r.reason.includes('קול-דאון')).length}
              </div>
              <div className="text-xs text-gray-600">קול-דאון</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded">
              <div className="text-lg font-bold text-purple-600">
                {rejections.filter(r => r.reason.includes('timeframe') || r.reason.includes('מסגרת')).length}
              </div>
              <div className="text-xs text-gray-600">מסגרת זמן</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
