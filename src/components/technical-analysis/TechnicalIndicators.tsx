
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { AlertTriangle, Send, ArrowUp, ArrowDown, BarChartHorizontal } from 'lucide-react';
import { toast } from 'sonner';

interface TechnicalIndicatorsProps {
  analysisLoading: boolean;
  analysisData: any;
  selectedAsset: any;
}

const TechnicalIndicators = ({ analysisLoading, analysisData, selectedAsset }: TechnicalIndicatorsProps) => {
  // יצירת הודעות איתות לשליחה
  const generateSignal = () => {
    if (!selectedAsset || !analysisData) return;
    
    toast.success('איתות נשלח בהצלחה', {
      description: `ניתוח טכני ל-${selectedAsset.name} בטווח ${selectedAsset.timeframe} נשלח למכשירך`,
      action: {
        label: 'הצג פרטים',
        onClick: () => console.log('הצגת פרטי איתות'),
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">אינדיקטורים טכניים</CardTitle>
      </CardHeader>
      <CardContent>
        {analysisLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : analysisData ? (
          <div>
            {/* תצוגת RSI */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2 text-right">RSI (מדד עוצמת תנועה יחסית)</h3>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analysisData.rsiData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="timestamp" 
                      tickFormatter={(timestamp) => {
                        const date = new Date(timestamp);
                        return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
                      }}
                    />
                    <YAxis 
                      domain={[0, 100]}
                      tickCount={5}
                      width={40}
                    />
                    <Tooltip 
                      formatter={(value: number) => [`${value.toFixed(2)}`, 'RSI']}
                      labelFormatter={(timestamp) => {
                        const date = new Date(timestamp as number);
                        return date.toLocaleDateString('he-IL', { 
                          day: 'numeric', 
                          month: 'numeric',
                          year: 'numeric'
                        });
                      }}
                    />
                    <ReferenceLine y={70} stroke="red" strokeDasharray="3 3" label="קנייתר יתר" />
                    <ReferenceLine y={30} stroke="green" strokeDasharray="3 3" label="מכירת יתר" />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#ff7300" 
                      dot={false}
                      name="RSI"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md text-right">
                <p className="font-medium">פרשנות:</p>
                <p className="text-sm">{analysisData.rsiInterpretation}</p>
              </div>
            </div>
            
            {/* אינדיקטורים נוספים - MACD, ממוצעים נעים, וכו' */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {analysisData.indicators.map((indicator: any, idx: number) => (
                <div key={idx} className="p-4 border rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <Badge 
                      className={
                        indicator.signal === 'buy' 
                          ? 'bg-green-100 text-green-800' 
                          : indicator.signal === 'sell' 
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                      }
                    >
                      {indicator.signal === 'buy' 
                        ? 'קנייה' 
                        : indicator.signal === 'sell' 
                          ? 'מכירה'
                          : 'ניטרלי'
                      }
                    </Badge>
                    <h4 className="font-medium text-right">{indicator.name}</h4>
                  </div>
                  <p className="text-sm text-right">{indicator.description}</p>
                  <div className="mt-2 text-right">
                    <span className="text-sm text-muted-foreground">ערך: </span>
                    <span className="font-medium">{indicator.value}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* מסקנה והמלצה כללית */}
            <div className="p-4 border-2 rounded-md border-primary">
              <h3 className="font-bold text-lg mb-2 text-right">סיכום והמלצה</h3>
              <p className="text-right mb-4">{analysisData.conclusion}</p>
              
              <div className="flex justify-between items-center">
                <Button 
                  className="gap-2" 
                  onClick={generateSignal}
                >
                  <Send className="h-4 w-4" />
                  שלח איתות למכשיר
                </Button>
                
                <div className="flex items-center gap-2">
                  <Badge 
                    className={
                      analysisData.overallSignal === 'buy' 
                        ? 'bg-green-100 text-green-800 text-lg p-2' 
                        : analysisData.overallSignal === 'sell' 
                          ? 'bg-red-100 text-red-800 text-lg p-2'
                          : 'bg-blue-100 text-blue-800 text-lg p-2'
                    }
                  >
                    {analysisData.overallSignal === 'buy' 
                      ? (
                        <div className="flex items-center gap-1">
                          <ArrowUp className="h-4 w-4" />
                          קנייה
                        </div>
                      ) 
                      : analysisData.overallSignal === 'sell' 
                        ? (
                          <div className="flex items-center gap-1">
                            <ArrowDown className="h-4 w-4" />
                            מכירה
                          </div>
                        )
                        : (
                          <div className="flex items-center gap-1">
                            <BarChartHorizontal className="h-4 w-4" />
                            המתנה
                          </div>
                        )
                    }
                  </Badge>
                  
                  <Badge 
                    variant="outline" 
                    className="text-lg p-2"
                  >
                    עוצמה: {analysisData.signalStrength}/10
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-10">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
            <p>לא נמצאו נתוני אינדיקטורים עבור הנכס הנבחר</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicators;
