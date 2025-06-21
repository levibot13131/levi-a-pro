
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

const TechnicalAnalysis: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold flex items-center justify-end gap-2">
          <TrendingUp className="h-8 w-8" />
          ניתוח טכני
        </h1>
        <p className="text-muted-foreground">
          ניתוח טכני מתקדם ואיתותים חכמים
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              מדדים טכניים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              RSI, MACD, Bollinger Bands ועוד
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Activity className="h-5 w-5" />
              דפוסי מחיר
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              זיהוי דפוסים אוטומטי
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              איתותים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              איתותי קנייה ומכירה חכמים
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TechnicalAnalysis;
