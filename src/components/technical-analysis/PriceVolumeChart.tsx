
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, ReferenceLine, ReferenceArea, Label 
} from 'recharts';
import { Volume2, AlertTriangle, Eye, EyeOff, Info } from 'lucide-react';
import { AssetHistoricalData } from '@/types/asset';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

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
  const [showPatterns, setShowPatterns] = useState<boolean>(true);
  const [showSignals, setShowSignals] = useState<boolean>(true);
  const [selectedPattern, setSelectedPattern] = useState<any>(null);

  // Extract patterns from analysis data
  const chartPatterns = analysisData?.patterns || [];
  
  // Function to get color based on pattern type
  const getPatternColor = (patternType: string) => {
    if (patternType.includes('bullish') || patternType.includes('buy')) {
      return 'rgba(0, 255, 0, 0.1)';
    } else if (patternType.includes('bearish') || patternType.includes('sell')) {
      return 'rgba(255, 0, 0, 0.1)';
    }
    return 'rgba(255, 165, 0, 0.1)'; // neutral/consolidation pattern
  };

  // Function to get pattern border color
  const getPatternBorder = (patternType: string) => {
    if (patternType.includes('bullish') || patternType.includes('buy')) {
      return 'rgba(0, 200, 0, 0.5)';
    } else if (patternType.includes('bearish') || patternType.includes('sell')) {
      return 'rgba(200, 0, 0, 0.5)';
    }
    return 'rgba(200, 165, 0, 0.5)'; // neutral/consolidation pattern
  };

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
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPatterns(!showPatterns)}
            >
              {showPatterns ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {showPatterns ? 'הסתר תבניות' : 'הצג תבניות'}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowSignals(!showSignals)}
            >
              {showSignals ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {showSignals ? 'הסתר סיגנלים' : 'הצג סיגנלים'}
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
          <div className="h-96 relative">
            {selectedPattern && (
              <div className="absolute top-0 right-0 p-3 bg-background/90 backdrop-blur-sm border rounded-md shadow-md z-10 w-64 max-h-64 overflow-y-auto">
                <div className="flex justify-between items-start mb-2">
                  <Button variant="ghost" size="sm" onClick={() => setSelectedPattern(null)} className="h-6 w-6 p-0">
                    ✕
                  </Button>
                  <h3 className="font-bold text-right">{selectedPattern.name}</h3>
                </div>
                <p className="text-sm text-right mb-2">{selectedPattern.description}</p>
                {selectedPattern.probability && (
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">{selectedPattern.probability}%</span>
                    <span>סבירות להתממשות:</span>
                  </div>
                )}
                {selectedPattern.keyLevels && (
                  <div className="mt-2">
                    <h4 className="text-right text-sm font-medium mb-1">רמות מפתח:</h4>
                    <ul className="text-right text-xs space-y-1">
                      {selectedPattern.keyLevels.map((level: any, i: number) => (
                        <li key={i} className="flex justify-between">
                          <span>{formatPrice(level.price)}</span>
                          <span>{level.name}:</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assetHistory.data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                
                {/* סימון אזורי תבניות על הגרף */}
                {showPatterns && chartPatterns.map((pattern: any, idx: number) => {
                  if (!pattern.chartArea) return null;
                  
                  return (
                    <ReferenceArea
                      key={`pattern-${idx}`}
                      x1={pattern.chartArea.startTimestamp}
                      x2={pattern.chartArea.endTimestamp}
                      y1={pattern.chartArea.minPrice}
                      y2={pattern.chartArea.maxPrice}
                      fill={getPatternColor(pattern.type)}
                      stroke={getPatternBorder(pattern.type)}
                      strokeDasharray="3 3"
                      onClick={() => setSelectedPattern(pattern)}
                      className="cursor-pointer"
                    >
                      <Label value={pattern.name} position="insideTopRight" />
                    </ReferenceArea>
                  );
                })}
                
                {/* סימון סיגנלים על הגרף */}
                {showSignals && analysisData?.signals?.map((signal: any, idx: number) => (
                  <ReferenceLine 
                    key={idx}
                    x={signal.timestamp}
                    stroke={signal.type === 'buy' ? 'green' : 'red'}
                    strokeDasharray="3 3"
                  >
                    <Label 
                      value={signal.type === 'buy' ? 'קנייה' : 'מכירה'} 
                      position="insideBottomLeft" 
                      fill={signal.type === 'buy' ? 'green' : 'red'}
                    />
                    {signal.indicator && (
                      <Label 
                        value={signal.indicator} 
                        position="insideTopLeft" 
                        fill={signal.type === 'buy' ? 'green' : 'red'}
                        fontSize={10}
                      />
                    )}
                  </ReferenceLine>
                ))}
                
                {/* סימון רמות תמיכה והתנגדות */}
                {showPatterns && analysisData?.keyLevels?.map((level: any, idx: number) => (
                  <ReferenceLine 
                    key={`level-${idx}`}
                    y={level.price}
                    stroke={level.type === 'support' ? 'green' : 'red'}
                    strokeDasharray="3 3"
                  >
                    <Label 
                      value={level.name} 
                      position="right" 
                      fill={level.type === 'support' ? 'green' : 'red'}
                    />
                  </ReferenceLine>
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
        
        {/* תצוגת הסברים לתבניות שזוהו */}
        {showPatterns && chartPatterns.length > 0 && !selectedPattern && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h3 className="font-bold text-lg mb-2 text-right">תבניות מחיר שזוהו</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {chartPatterns.map((pattern: any, idx: number) => (
                <div 
                  key={idx} 
                  className="p-2 border rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => setSelectedPattern(pattern)}
                >
                  <div className="flex justify-between items-start">
                    <Badge 
                      className={
                        pattern.type?.includes('bullish') || pattern.type?.includes('buy')
                          ? 'bg-green-100 text-green-800' 
                          : pattern.type?.includes('bearish') || pattern.type?.includes('sell')
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {pattern.type?.includes('bullish') || pattern.type?.includes('buy')
                        ? 'עולה' 
                        : pattern.type?.includes('bearish') || pattern.type?.includes('sell')
                          ? 'יורד'
                          : 'ניטרלי'
                      }
                    </Badge>
                    <h4 className="font-medium text-right">{pattern.name}</h4>
                  </div>
                  <p className="text-sm text-right mt-1 truncate">{pattern.description}</p>
                  
                  <div className="flex justify-end mt-1">
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      הצג פרטים
                    </Button>
                  </div>
                </div>
              ))}
            </div>
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
                
                {/* הדגשת נפחים חריגים */}
                {assetHistory.volumeData.map((point, idx) => {
                  if (point.abnormal) {
                    return (
                      <ReferenceLine
                        key={`vol-${idx}`}
                        x={point.timestamp}
                        strokeWidth={2}
                        stroke="rgba(255, 165, 0, 0.7)"
                      >
                        <Label 
                          value="נפח חריג" 
                          position="top" 
                          fill="rgba(255, 165, 0, 1)"
                          fontSize={10}
                        />
                      </ReferenceLine>
                    );
                  }
                  return null;
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
        
        {/* אזור הסבר לסיגנלים */}
        {analysisData?.signals && analysisData.signals.length > 0 && showSignals && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
            <h3 className="font-bold text-lg mb-2 text-right">הסברים לסיגנלים שזוהו</h3>
            <div className="space-y-2">
              {analysisData.signals.map((signal: any, idx: number) => (
                <div key={idx} className="p-2 border rounded-md flex justify-between items-start">
                  <div>
                    <Badge className={signal.type === 'buy' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {signal.type === 'buy' ? 'קנייה' : 'מכירה'}
                    </Badge>
                    <div className="text-xs mt-1">
                      מחיר: {formatPrice(signal.price)}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{signal.indicator}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{signal.reason || 'אין הסבר נוסף'}</p>
                    <p className="text-xs">
                      {new Date(signal.timestamp).toLocaleDateString('he-IL', { 
                        day: 'numeric', 
                        month: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PriceVolumeChart;

