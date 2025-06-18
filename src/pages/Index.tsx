
import React from 'react';
import { Container } from '@/components/ui/container';
import RealTimeTradingDashboard from '@/components/dashboard/RealTimeTradingDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Shield, Zap } from 'lucide-react';

const Index: React.FC = () => {
  return (
    <Container className="py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            LeviPro Trading Intelligence
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            מערכת מסחר אוטומטית מתקדמת עם ניתוח בזמן אמת ואיתותים חכמים
          </p>
          
          {/* Status indicators */}
          <div className="flex justify-center gap-4 mt-6">
            <Badge className="bg-green-100 text-green-800 px-4 py-2">
              <Activity className="h-4 w-4 mr-2" />
              מערכת פעילה
            </Badge>
            <Badge className="bg-blue-100 text-blue-800 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              מאובטח וחסוי
            </Badge>
            <Badge className="bg-purple-100 text-purple-800 px-4 py-2">
              <Zap className="h-4 w-4 mr-2" />
              זמן אמת
            </Badge>
          </div>
        </div>

        {/* Welcome message */}
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-right">ברוך הבא למערכת LeviPro</CardTitle>
          </CardHeader>
          <CardContent className="text-right space-y-4">
            <p className="text-lg">
              המערכת פועלת בקצב של 30 שניות ומייצרת איתותים מבוססי AI עם אסטרטגיות מתקדמות
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800">🎯 איתותי מסחר חכמים</h3>
                <p className="text-sm text-green-600">ניתוח RSI, מומנטום ונפח בזמן אמת</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800">📊 ניטור מערכת</h3>
                <p className="text-sm text-blue-600">בקרת בריאות ואינטגרציה מתמשכת</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Main Dashboard */}
        <RealTimeTradingDashboard />
      </div>
    </Container>
  );
};

export default Index;
