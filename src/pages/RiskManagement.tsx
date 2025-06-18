
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PositionSizeCalculator } from '@/components/risk-management/PositionSizeCalculator';
import { PersonalStrategyEngine } from '@/components/trading-strategy/PersonalStrategyEngine';
import { Shield, Calculator, Brain, Target, TrendingUp, Activity } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const RiskManagement = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">ניהול סיכונים ואסטרטגיה אישית</h1>
          {isAdmin && (
            <Badge variant="secondary" className="gap-1">
              <Brain className="h-3 w-3" />
              מנהל מערכת
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground">
          כלי ניהול סיכונים מתקדמים והשיטה האישית של אלמוג למסחר
        </p>
      </div>

      <div className="grid gap-6">
        {/* Personal Strategy Engine - Priority Component */}
        <Card className="border-2 border-primary bg-gradient-to-r from-blue-50 to-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              מנוע האסטרטגיה האישית של אלמוג
              <Badge className="bg-green-100 text-green-800">פעיל</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalStrategyEngine />
          </CardContent>
        </Card>

        {/* Position Size Calculator */}
        <PositionSizeCalculator />

        {/* Enhanced Risk Rules Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-6 w-6" />
              כללי ניהול הון - השיטה האישית
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <span className="font-medium">סיכון מקסימלי לעסקה</span>
                  <span className="font-bold text-green-600">2%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <span className="font-medium">מספר עסקאות פתוחות מקסימלי</span>
                  <span className="font-bold text-yellow-600">3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <span className="font-medium">הפסד יומי מקסימלי</span>
                  <span className="font-bold text-red-600">5%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <span className="font-medium">יחס סיכון/רווח מינימלי</span>
                  <span className="font-bold text-blue-600">1:2</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <span className="font-medium">מינוף מקסימלי</span>
                  <span className="font-bold text-purple-600">5x</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="font-medium">אישור 2+ אסטרטגיות</span>
                  <span className="font-bold text-gray-600">חובה</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Strategy Breakdown */}
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-6 w-6 text-yellow-600" />
              רכיבי האסטרטגיה האישית
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white rounded-lg border">
                <Activity className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                <p className="text-sm font-medium mb-1">זיהוי לחץ רגשי</p>
                <p className="text-xs text-gray-600">ניתוח נפח + תנודתיות</p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">70%+ = איתות</Badge>
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm font-medium mb-1">ניתוח מומנטום</p>
                <p className="text-xs text-gray-600">תבניות נרות + כיוון</p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">65%+ = חזק</Badge>
                </div>
              </div>
              <div className="text-center p-4 bg-white rounded-lg border">
                <Target className="h-8 w-8 mx-auto mb-2 text-yellow-500" />
                <p className="text-sm font-medium mb-1">פריצות מאושרות</p>
                <p className="text-xs text-gray-600">נפח גבוה + אישור</p>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">נפח 1.5M+</Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg border border-dashed border-yellow-300">
              <p className="text-sm font-medium text-center text-yellow-800">
                🎯 <strong>חוק זהב:</strong> איתות נוצר רק כאשר לפחות 2 אסטרטגיות מסכימות
              </p>
              <p className="text-xs text-center text-yellow-600 mt-1">
                רמת ביטחון מחושבת לפי מספר האסטרטגיות המסכימות (מקס 95%)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskManagement;
