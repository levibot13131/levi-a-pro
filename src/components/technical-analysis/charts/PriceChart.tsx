
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, ReferenceArea, Label 
} from 'recharts';
import { AlertTriangle, Circle, BarChart3, ArrowUp, ArrowDown } from 'lucide-react';

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

  return (
    <div className="relative h-full">
      {renderKeyLevelsLabels()}
      
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
      </div>
    </div>
  );
};

export default PriceChart;
