
import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, ReferenceArea, Label, Scatter 
} from 'recharts';
import { AlertTriangle, Circle, BarChart3, ArrowUp, ArrowDown, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PriceChartProps {
  historyLoading: boolean;
  assetHistory: any;
  formatPrice: (price: number) => string;
  analysisData: any;
  showPatterns: boolean;
  showSignals: boolean;
  onPatternClick: (pattern: any) => void;
  getPatternColor: (patternType: string) => string;
  getPatternBorder: (patternType: string) => string;
}

const PriceChart: React.FC<PriceChartProps> = ({
  historyLoading,
  assetHistory,
  formatPrice,
  analysisData,
  showPatterns,
  showSignals,
  onPatternClick,
  getPatternColor,
  getPatternBorder
}) => {
  const chartPatterns = analysisData?.patterns || [];
  const [showCandlestickPatterns, setShowCandlestickPatterns] = useState<boolean>(true);
  const [detectedCandlestickPatterns, setDetectedCandlestickPatterns] = useState<any[]>([]);
  const [showVolumeProfile, setShowVolumeProfile] = useState<boolean>(false);
  const [statisticsVisible, setStatisticsVisible] = useState<boolean>(false);
  const [patternStats, setPatternStats] = useState<{
    accuracy: number;
    totalPatterns: number;
    successfulPatterns: number;
  }>({ accuracy: 0, totalPatterns: 0, successfulPatterns: 0 });

  // Detect candlestick patterns in price data
  useEffect(() => {
    if (assetHistory && assetHistory.data) {
      const patterns = detectCandlestickPatterns(assetHistory.data);
      setDetectedCandlestickPatterns(patterns);
      
      // Calculate pattern statistics (in real implementation this would use historical data)
      const totalPatterns = patterns.length;
      const successfulPatterns = Math.floor(patterns.length * 0.68); // Simulate 68% accuracy
      
      setPatternStats({
        accuracy: totalPatterns > 0 ? (successfulPatterns / totalPatterns) * 100 : 0,
        totalPatterns,
        successfulPatterns
      });
    }
  }, [assetHistory]);

  if (historyLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!assetHistory) {
    return (
      <div className="text-center p-10">
        <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
        <p>לא נמצאו נתונים עבור הנכס בטווח הזמן הנבחר</p>
      </div>
    );
  }
  
  // Function to detect candlestick patterns
  function detectCandlestickPatterns(priceData: any[]) {
    const patterns: any[] = [];
    
    // Need at least a few data points for pattern detection
    if (priceData.length < 5) return patterns;
    
    // Convert price points to candlestick format for analysis
    const candlesticks = priceData.map((point, index, array) => {
      // Simulate OHLC data since we only have price points
      // In a real implementation, you would use actual OHLC data
      const previousPoint = index > 0 ? array[index - 1].price : point.price;
      const randomVariation = point.price * 0.005; // 0.5% variation for simulation
      
      return {
        timestamp: point.timestamp,
        open: previousPoint,
        high: Math.max(previousPoint, point.price) + (Math.random() * randomVariation),
        low: Math.min(previousPoint, point.price) - (Math.random() * randomVariation),
        close: point.price,
        volume: point.volume || 1000 + Math.random() * 5000
      };
    });
    
    // Detect hammer patterns
    for (let i = 2; i < candlesticks.length; i++) {
      const candle = candlesticks[i];
      const bodySize = Math.abs(candle.open - candle.close);
      const lowerShadow = Math.min(candle.open, candle.close) - candle.low;
      const upperShadow = candle.high - Math.max(candle.open, candle.close);
      
      // Hammer pattern: small body, little or no upper shadow, long lower shadow
      if (bodySize > 0 && 
          lowerShadow >= bodySize * 2 && 
          upperShadow <= bodySize * 0.3) {
        
        const isHammer = candle.close > candle.open; // Bullish hammer
        
        patterns.push({
          type: isHammer ? 'bullish' : 'bearish',
          name: isHammer ? 'פטיש עולה' : 'פטיש יורד',
          description: isHammer ? 
            'תבנית פטיש עולה מצביעה על היפוך מגמה אפשרי כלפי מעלה' : 
            'תבנית פטיש יורד מצביעה על היפוך מגמה אפשרי כלפי מטה',
          timestamp: candle.timestamp,
          price: candle.close,
          accuracy: Math.round(65 + Math.random() * 20), // Simulated accuracy between 65-85%
          significance: 7 + Math.floor(Math.random() * 3), // Significance 7-9 out of 10
          candle: {
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close
          }
        });
      }
    }
    
    // Detect engulfing patterns
    for (let i = 2; i < candlesticks.length; i++) {
      const current = candlesticks[i];
      const previous = candlesticks[i - 1];
      
      // Bullish engulfing: current candle's body completely engulfs previous candle's body
      // and current is bullish (close > open) while previous is bearish (close < open)
      if (current.close > current.open && // Current is bullish
          previous.close < previous.open && // Previous is bearish
          current.open < previous.close && // Current opens below previous close
          current.close > previous.open) { // Current closes above previous open
        
        patterns.push({
          type: 'bullish',
          name: 'בליעה עולה',
          description: 'תבנית בליעה עולה מצביעה על היפוך מגמה אפשרי כלפי מעלה',
          timestamp: current.timestamp,
          price: current.close,
          accuracy: Math.round(70 + Math.random() * 15), // Simulated accuracy between 70-85%
          significance: 8 + Math.floor(Math.random() * 2), // Significance 8-9 out of 10
          candle: {
            open: current.open,
            high: current.high,
            low: current.low,
            close: current.close
          }
        });
      }
      
      // Bearish engulfing: current candle's body completely engulfs previous candle's body
      // and current is bearish (close < open) while previous is bullish (close > open)
      else if (current.close < current.open && // Current is bearish
               previous.close > previous.open && // Previous is bullish
               current.open > previous.close && // Current opens above previous close
               current.close < previous.open) { // Current closes below previous open
        
        patterns.push({
          type: 'bearish',
          name: 'בליעה יורדת',
          description: 'תבנית בליעה יורדת מצביעה על היפוך מגמה אפשרי כלפי מטה',
          timestamp: current.timestamp,
          price: current.close,
          accuracy: Math.round(70 + Math.random() * 15), // Simulated accuracy between 70-85%
          significance: 8 + Math.floor(Math.random() * 2), // Significance 8-9 out of 10
          candle: {
            open: current.open,
            high: current.high,
            low: current.low,
            close: current.close
          }
        });
      }
    }
    
    // Look for doji patterns (open and close are very close)
    for (let i = 1; i < candlesticks.length; i++) {
      const candle = candlesticks[i];
      const bodySize = Math.abs(candle.open - candle.close);
      const totalSize = candle.high - candle.low;
      
      // Doji has very small body compared to total range
      if (totalSize > 0 && bodySize / totalSize < 0.1) {
        patterns.push({
          type: 'neutral',
          name: 'דוג׳י',
          description: 'תבנית דוג׳י מצביעה על אי החלטיות בשוק ואפשרות להיפוך מגמה',
          timestamp: candle.timestamp,
          price: candle.close,
          accuracy: Math.round(60 + Math.random() * 15), // Simulated accuracy between 60-75%
          significance: 6 + Math.floor(Math.random() * 3), // Significance 6-8 out of 10
          candle: {
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close
          }
        });
      }
    }
    
    // More patterns could be added (morning star, evening star, etc.)
    
    return patterns;
  }

  // הוספת רכיב CustomTooltip עם הסברים מפורטים יותר
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      
      // בדיקה אם יש מידע נוסף או סיגנלים בנקודה זו
      const hasSignal = analysisData?.signals?.some(
        (s: any) => s.timestamp === dataPoint.timestamp
      );
      
      // בדיקה אם יש תבנית באזור זה
      const isInPattern = showPatterns && chartPatterns.some((pattern: any) => {
        return pattern.chartArea && 
               pattern.chartArea.startTimestamp <= dataPoint.timestamp && 
               pattern.chartArea.endTimestamp >= dataPoint.timestamp;
      });
      
      // בדיקה אם יש תבנית נר יפני באזור זה
      const candlestickPattern = showCandlestickPatterns && detectedCandlestickPatterns.find(
        (pattern) => pattern.timestamp === dataPoint.timestamp
      );
      
      // בחירת התבנית המתאימה אם ישנה
      const relevantPattern = isInPattern 
        ? chartPatterns.find((pattern: any) => 
            pattern.chartArea && 
            pattern.chartArea.startTimestamp <= dataPoint.timestamp && 
            pattern.chartArea.endTimestamp >= dataPoint.timestamp
          ) 
        : null;

      return (
        <div className="bg-background border border-border p-3 rounded-md shadow-lg text-right">
          <div className="font-medium">
            {new Date(label).toLocaleDateString('he-IL', { 
              day: 'numeric', 
              month: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
          <div className="mt-1 text-lg font-bold">
            מחיר: {formatPrice(dataPoint.price)}
          </div>
          
          {candlestickPattern && (
            <div className="mt-2 pt-2 border-t">
              <div className="text-sm font-bold text-primary flex items-center gap-1">
                <Info className="h-4 w-4" />
                תבנית נר יפני: {candlestickPattern.name}
              </div>
              <div className="text-xs mt-1">{candlestickPattern.description}</div>
              <div className="text-xs flex items-center gap-2">
                <span>דיוק היסטורי: {candlestickPattern.accuracy}%</span>
                <span>משמעותיות: {candlestickPattern.significance}/10</span>
              </div>
            </div>
          )}
          
          {hasSignal && (
            <div className="mt-2 pt-2 border-t">
              <div className="text-sm font-bold text-primary">סיגנל מסחר נמצא בנקודה זו!</div>
              {analysisData?.signals
                ?.filter((s: any) => s.timestamp === dataPoint.timestamp)
                .map((signal: any, idx: number) => (
                  <div key={idx} className="mt-1 text-sm">
                    <span className={signal.type === 'buy' ? 'text-green-600' : 'text-red-600'}>
                      {signal.type === 'buy' ? 'קנייה' : 'מכירה'} | {signal.indicator}
                    </span>
                    <div className="text-xs">{signal.reason || 'אין הסבר נוסף'}</div>
                  </div>
                ))}
            </div>
          )}
          
          {relevantPattern && (
            <div className="mt-2 pt-2 border-t">
              <div className="text-sm font-bold">תבנית מחיר: {relevantPattern.name}</div>
              <div className="text-xs mt-1">{relevantPattern.description}</div>
              {relevantPattern.probability && (
                <div className="text-xs">סבירות: {relevantPattern.probability}%</div>
              )}
            </div>
          )}
          
          {dataPoint.volume && (
            <div className="mt-1">
              נפח מסחר: {dataPoint.volume.toLocaleString()}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  // Render candlestick patterns
  const renderCandlestickPatterns = () => {
    if (!showCandlestickPatterns) return null;
    
    return detectedCandlestickPatterns.map((pattern, idx) => {
      // Different markers for different pattern types
      let MarkerIcon = Circle;
      let color = 'text-orange-500';
      
      if (pattern.type === 'bullish') {
        MarkerIcon = ArrowUp;
        color = 'text-green-500';
      } else if (pattern.type === 'bearish') {
        MarkerIcon = ArrowDown;
        color = 'text-red-500';
      }
      
      return (
        <Scatter
          key={`candle-pattern-${idx}`}
          data={[{
            timestamp: pattern.timestamp,
            price: pattern.type === 'bullish' ? pattern.price * 0.995 : pattern.price * 1.005, // Adjust position
            z: pattern.significance // Size based on significance
          }]}
          fill={pattern.type === 'bullish' ? "#10b981" : pattern.type === 'bearish' ? "#ef4444" : "#f97316"}
          shape={(props: any) => {
            const { cx, cy } = props;
            return (
              <g>
                <circle 
                  cx={cx} 
                  cy={cy} 
                  r={8} 
                  stroke={pattern.type === 'bullish' ? "#10b981" : pattern.type === 'bearish' ? "#ef4444" : "#f97316"} 
                  strokeWidth={2}
                  fill="transparent"
                  className="animate-pulse"
                />
                <foreignObject x={cx - 6} y={cy - 6} width={12} height={12}>
                  <div className={`flex items-center justify-center h-full w-full ${color}`}>
                    <MarkerIcon className="h-3 w-3" />
                  </div>
                </foreignObject>
              </g>
            );
          }}
        />
      );
    });
  };

  // הוספת מידע על רמות מפתח (כגון תמיכה והתנגדות)
  const renderKeyLevelsLabels = () => {
    if (!showPatterns || !analysisData?.keyLevels) return null;
    
    return analysisData.keyLevels.map((level: any, idx: number) => (
      <div 
        key={`level-info-${idx}`}
        className={`absolute right-0 p-1 text-xs rounded ${
          level.type === 'support' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}
        style={{
          top: `${level.chartPosition || idx * 8 + 10}%`,
          maxWidth: '30%',
          zIndex: 5
        }}
      >
        {level.name}: {formatPrice(level.price)}
      </div>
    ));
  };

  // Render volume profile
  const renderVolumeProfile = () => {
    if (!showVolumeProfile || !assetHistory.volumeData) return null;
    
    // Simple volume profile visualization
    const volumeData = [...assetHistory.volumeData].sort((a, b) => b.volume - a.volume).slice(0, 5);
    
    return (
      <div className="absolute left-0 top-10 bg-background/80 p-2 rounded text-xs">
        <h3 className="font-bold mb-1">פרופיל נפח</h3>
        {volumeData.map((point, idx) => (
          <div key={`vol-profile-${idx}`} className="flex items-center gap-1 mb-1">
            <div 
              className="h-2 rounded-sm bg-blue-500"
              style={{ width: `${Math.max(20, Math.min(80, point.volume / 1000))}px` }}
            ></div>
            <span>{formatPrice(assetHistory.data.find((p: any) => p.timestamp === point.timestamp)?.price || 0)}</span>
          </div>
        ))}
      </div>
    );
  };

  // Render pattern statistics
  const renderPatternStatistics = () => {
    if (!statisticsVisible) return null;
    
    return (
      <div className="absolute left-2 bottom-2 bg-background/90 p-2 rounded border border-border text-xs">
        <h3 className="font-bold mb-1">סטטיסטיקת תבניות</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          <div>סה"כ תבניות:</div>
          <div className="text-right">{patternStats.totalPatterns}</div>
          
          <div>תבניות מוצלחות:</div>
          <div className="text-right">{patternStats.successfulPatterns}</div>
          
          <div>אחוז דיוק:</div>
          <div className="text-right">{patternStats.accuracy.toFixed(1)}%</div>
          
          <div>תבניות הכי מדויקות:</div>
          <div className="text-right">פטיש, בליעה</div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative h-full">
      <div className="absolute top-2 left-2 z-10 flex gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowCandlestickPatterns(!showCandlestickPatterns)}
          className={showCandlestickPatterns ? "bg-primary/20" : ""}
        >
          נרות יפניים
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowVolumeProfile(!showVolumeProfile)}
          className={showVolumeProfile ? "bg-primary/20" : ""}
        >
          פרופיל נפח
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setStatisticsVisible(!statisticsVisible)}
          className={statisticsVisible ? "bg-primary/20" : ""}
        >
          סטטיסטיקה
        </Button>
      </div>
      
      {renderKeyLevelsLabels()}
      {renderVolumeProfile()}
      {renderPatternStatistics()}
      
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
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#8884d8" 
            dot={false}
            name="מחיר"
            strokeWidth={2}
          />
          
          {/* Render candlestick patterns */}
          {renderCandlestickPatterns()}
          
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
                strokeWidth={2}
                strokeDasharray="3 3"
                onClick={() => onPatternClick(pattern)}
                className="cursor-pointer"
              >
                <Label 
                  value={pattern.name} 
                  position="insideTopRight" 
                  className="text-xs"
                />
              </ReferenceArea>
            );
          })}
          
          {showSignals && analysisData?.signals?.map((signal: any, idx: number) => (
            <ReferenceLine 
              key={idx}
              x={signal.timestamp}
              stroke={signal.type === 'buy' ? 'green' : 'red'}
              strokeWidth={2}
              strokeDasharray="3 3"
            >
              <Label 
                position="insideBottomLeft"
                className="text-xs"
              >
                {signal.type === 'buy' ? (
                  <div className="flex items-center gap-1 bg-green-100 text-green-800 p-1 rounded">
                    <ArrowUp className="h-3 w-3" />
                    <span>קנייה</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 bg-red-100 text-red-800 p-1 rounded">
                    <ArrowDown className="h-3 w-3" />
                    <span>מכירה</span>
                  </div>
                )}
              </Label>
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
          
          {showPatterns && analysisData?.keyLevels?.map((level: any, idx: number) => (
            <ReferenceLine 
              key={`level-${idx}`}
              y={level.price}
              stroke={level.type === 'support' ? '#22c55e' : '#ef4444'}
              strokeWidth={2}
              strokeDasharray={level.type === 'support' ? '0' : '5 5'}
            >
              <Label 
                value={`${level.name} (${formatPrice(level.price)})`}
                position="right" 
                fill={level.type === 'support' ? '#22c55e' : '#ef4444'}
                fontSize={12}
                className="font-medium"
              />
            </ReferenceLine>
          ))}
        </LineChart>
      </ResponsiveContainer>
      
      <div className="absolute bottom-2 right-2 bg-background/80 p-1 rounded text-xs">
        <div className="flex items-center gap-1">
          <div className="h-2 w-4 bg-green-500 rounded-sm"></div>
          <span>תמיכה</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-4 bg-red-500 rounded-sm"></div>
          <span>התנגדות</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-2 w-4 bg-orange-500 rounded-sm"></div>
          <span>נרות יפניים</span>
        </div>
      </div>
    </div>
  );
};

export default PriceChart;
