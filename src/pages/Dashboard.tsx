
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Zap, Brain } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-right">לוח בקרה ראשי - LeviPro</h1>
        <Badge className="bg-green-100 text-green-800">מערכת פעילה</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">איתותים פעילים</CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 היום</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">שיעור הצלחה</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87.5%</div>
            <p className="text-xs text-muted-foreground">7 ימים אחרונים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">השיטה האישית</CardTitle>
            <Brain className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">ביצועים מעולים</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">סטטוס מערכת</CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">חי</div>
            <p className="text-xs text-muted-foreground">כל המערכות פועלות</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-right">סטטוס אסטרטגיות</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-l-blue-500">
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">עדיפות עליונה</Badge>
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
              </div>
              <div className="text-right">
                <h3 className="font-semibold">השיטה האישית של אלמוג</h3>
                <p className="text-sm text-gray-600">משקל: 85% | רמת ביטחון: 94%</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
                <div className="text-right">
                  <h3 className="font-medium">RSI + MACD</h3>
                  <p className="text-sm text-gray-600">משקל: 72%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
                <div className="text-right">
                  <h3 className="font-medium">Smart Money Concepts</h3>
                  <p className="text-sm text-gray-600">משקל: 68%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
                <div className="text-right">
                  <h3 className="font-medium">Elliott Wave</h3>
                  <p className="text-sm text-gray-600">משקל: 65%</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <Badge className="bg-green-100 text-green-800">פעיל</Badge>
                <div className="text-right">
                  <h3 className="font-medium">Wyckoff Method</h3>
                  <p className="text-sm text-gray-600">משקל: 61%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
