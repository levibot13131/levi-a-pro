
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PositionSizeCalculator } from '@/components/risk-management/PositionSizeCalculator';
import { PersonalStrategyEngine } from '@/components/trading-strategy/PersonalStrategyEngine';
import { Shield, Calculator, Brain } from 'lucide-react';

const RiskManagement = () => {
  return (
    <div className="container mx-auto py-6 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">ניהול סיכונים ואסטרטגיה אישית</h1>
        <p className="text-muted-foreground">
          כלי ניהול סיכונים מתקדמים והשיטה האישית של אלמוג למסחר
        </p>
      </div>

      <div className="grid gap-6">
        {/* Personal Strategy Engine */}
        <Card className="border-2 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-6 w-6 text-primary" />
              מנוע האסטרטגיה האישית של אלמוג
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PersonalStrategyEngine />
          </CardContent>
        </Card>

        {/* Position Size Calculator */}
        <PositionSizeCalculator />

        {/* Risk Rules Summary */}
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
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">סיכון מקסימלי לעסקה</span>
                  <span className="font-bold text-green-600">2%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">מספר עסקאות פתוחות מקסימלי</span>
                  <span className="font-bold text-yellow-600">3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">הפסד יומי מקסימלי</span>
                  <span className="font-bold text-red-600">5%</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">יחס סיכון/רווח מינימלי</span>
                  <span className="font-bold text-blue-600">1:2</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">מינוף מקסימלי</span>
                  <span className="font-bold text-purple-600">5x</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">אישור 2+ אסטרטגיות</span>
                  <span className="font-bold text-gray-600">חובה</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskManagement;
