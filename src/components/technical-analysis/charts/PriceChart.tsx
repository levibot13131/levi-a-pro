
import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  ReferenceLine, ReferenceArea, Label 
} from 'recharts';
import { AlertTriangle } from 'lucide-react';

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

  return (
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
              onClick={() => onPatternClick(pattern)}
              className="cursor-pointer"
            >
              <Label value={pattern.name} position="insideTopRight" />
            </ReferenceArea>
          );
        })}
        
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
  );
};

export default PriceChart;
