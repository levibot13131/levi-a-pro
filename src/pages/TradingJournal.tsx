
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, TrendingDown, Clock } from 'lucide-react';

const TradingJournal: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Card className="border-2 border-blue-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-blue-500" />
            יומן מסחר LeviPro
            <Badge variant="outline" className="text-blue-600">
              מעקב ביצועים
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-sm text-muted-foreground">איתותים מוצלחים</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded">
              <div className="text-2xl font-bold text-red-600">0</div>
              <div className="text-sm text-muted-foreground">איתותים כושלים</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">0%</div>
              <div className="text-sm text-muted-foreground">אחוז הצלחה</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-sm text-muted-foreground">איתותים פעילים</div>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">איתותים אחרונים</h3>
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>אין איתותים קיימים בתקופה זו</p>
              <p className="text-sm">איתותים יופיעו כאן כאשר המערכת תזהה הזדמנויות מסחר</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingJournal;
