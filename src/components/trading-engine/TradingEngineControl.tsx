
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Settings, TrendingUp } from 'lucide-react';

const TradingEngineControl: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold flex items-center justify-end gap-2">
          <Activity className="h-8 w-8" />
          מנוע המסחר
        </h1>
        <p className="text-muted-foreground">
          בקרה וניהול מנוע המסחר האוטומטי
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Settings className="h-5 w-5" />
              הגדרות מנוע
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              תצורת מנוע המסחר האוטומטי
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              ביצועים
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              סטטיסטיקות ביצועי המנוע
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Activity className="h-5 w-5" />
              מצב פעילות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              סטטוס פעילות המנוע בזמן אמת
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TradingEngineControl;
