
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SentimentOverview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">סיכום נתונים</CardTitle>
      </CardHeader>
      <CardContent className="text-right">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">היקף איסוף</p>
            <p className="text-2xl font-bold">5,280</p>
            <p className="text-xs text-muted-foreground">ציוצים שנאספו ב-24 שעות</p>
          </div>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">סנטימנט כולל</p>
            <p className="text-2xl font-bold text-green-500">חיובי</p>
            <p className="text-xs text-muted-foreground">מבוסס על ניתוח 5,280 ציוצים</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentOverview;
