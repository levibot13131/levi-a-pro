
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, TrendingUp, Activity } from 'lucide-react';

const FundamentalData: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="text-right">
        <h1 className="text-3xl font-bold flex items-center justify-end gap-2">
          <BookOpen className="h-8 w-8" />
          נתונים פונדמנטליים
        </h1>
        <p className="text-muted-foreground">
          ניתוח פונדמנטלי מקיף של נכסים דיגיטליים
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              נתוני שוק
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              שווי שוק, נפח מסחר, התפלגות
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              מדדי יציבות
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              דירוגי אשראי ומדדי סיכון
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Activity className="h-5 w-5" />
              פעילות רשת
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right text-muted-foreground">
              עסקאות, כתובות פעילות, hash rate
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FundamentalData;
