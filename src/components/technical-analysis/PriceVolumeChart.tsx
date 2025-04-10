
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import { Volume2, AlertTriangle } from 'lucide-react';
import { AssetHistoricalData } from '@/types/asset';

interface PriceVolumeChartProps {
  historyLoading: boolean;
  assetHistory: AssetHistoricalData | undefined;
  showVolume: boolean;
  setShowVolume: (value: boolean) => void;
  formatPrice: (price: number) => string;
  analysisData: any;
}

const PriceVolumeChart = ({
  historyLoading,
  assetHistory,
  showVolume,
  setShowVolume,
  formatPrice,
  analysisData
}: PriceVolumeChartProps) => {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowVolume(!showVolume)}
            >
              <Volume2 className="h-4 w-4 mr-2" />
              {showVolume ? 'הסתר נפח' : 'הצג נפח'}
            </Button>
          </div>
          <CardTitle className="text-right">גרף מחיר</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {historyLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : assetHistory ? (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assetHistory.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(timestamp) => {
                    const date = new Date(timestamp);
                    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
                  }}
                />
                <YAxis 
                  domain={['auto', 'auto']}
                  tickFormatter={(value) => formatPrice(value)}
                  width={80}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${formatPrice(value)}`, 'מחיר']}
                  labelFormatter={(timestamp) => {
                    const date = new Date(timestamp as number);
                    return date.toLocaleDateString('he-IL', { 
                      day: 'numeric', 
                      month: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="price" 
                  stroke="#8884d8" 
                  dot={false}
                  name="מחיר"
                />
                
                {/* סימון סיגנלים על הגרף אם יש */}
                {analysisData?.signals?.map((signal: any, idx: number) => (
                  <ReferenceLine 
                    key={idx}
                    x={signal.timestamp}
                    stroke={signal.type === 'buy' ? 'green' : 'red'}
                    strokeDasharray="3 3"
                    label={{ 
                      value: signal.type === 'buy' ? 'קנייה' : 'מכירה',
                      position: 'insideBottomLeft',
                      fill: signal.type === 'buy' ? 'green' : 'red',
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="text-center p-10">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
            <p>לא נמצאו נתונים עבור הנכס בטווח הזמן הנבחר</p>
          </div>
        )}
        
        {showVolume && assetHistory && assetHistory.volumeData && (
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={assetHistory.volumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(timestamp) => {
                    const date = new Date(timestamp);
                    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
                  }}
                />
                <YAxis 
                  tickFormatter={(value) => value >= 1000000 
                    ? `${(value / 1000000).toFixed(1)}M` 
                    : value >= 1000 
                      ? `${(value / 1000).toFixed(1)}K` 
                      : value
                  }
                  width={60}
                />
                <Tooltip 
                  formatter={(value: number) => {
                    if (value >= 1000000) {
                      return [`${(value / 1000000).toFixed(2)}M`, 'נפח']
                    } else if (value >= 1000) {
                      return [`${(value / 1000).toFixed(2)}K`, 'נפח']
                    }
                    return [value, 'נפח']
                  }}
                  labelFormatter={(timestamp) => {
                    const date = new Date(timestamp as number);
                    return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
                  }}
                />
                <Bar 
                  dataKey="volume" 
                  fill="#8884d8" 
                  name="נפח מסחר"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceVolumeChart;
