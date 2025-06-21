
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Target, TrendingUp, Filter, Award } from 'lucide-react';
import { SignalScoringEngine } from '@/services/trading/signalScoringEngine';

const SignalQualityMonitor: React.FC = () => {
  const scoreStats = SignalScoringEngine.getDailyStats();
  const threshold = SignalScoringEngine.getScoreThreshold();
  
  const passRate = scoreStats.totalSignalsAnalyzed > 0 
    ? (scoreStats.signalsPassedFilter / scoreStats.totalSignalsAnalyzed) * 100 
    : 0;

  return (
    <div className="space-y-4">
      <Card className="border-r-4 border-r-blue-500">
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-500" />
            מנוע ניקוד איכות איתותים
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{scoreStats.totalSignalsAnalyzed}</div>
              <div className="text-sm text-muted-foreground">נותחו היום</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{scoreStats.signalsPassedFilter}</div>
              <div className="text-sm text-muted-foreground">עברו סינון</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{scoreStats.averageScore}</div>
              <div className="text-sm text-muted-foreground">ניקוד ממוצע</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{scoreStats.topScore}</div>
              <div className="text-sm text-muted-foreground">ניקוד מקסימלי</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">שיעור הצלחה בסינון</span>
              <span className="text-sm text-muted-foreground">{passRate.toFixed(1)}%</span>
            </div>
            <Progress value={passRate} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span className="text-sm">סף איכות מינימלי</span>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {threshold} נקודות
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span className="text-sm">שיעור דחייה</span>
            </div>
            <Badge className="bg-red-100 text-red-800">
              {scoreStats.rejectionRate.toFixed(1)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-right text-sm">מרכיבי הניקוד</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex justify-between">
              <span>×2.0</span>
              <span>יחס סיכון/תשואה</span>
            </div>
            <div className="flex justify-between">
              <span>×1.5</span>
              <span>רמת ביטחון</span>
            </div>
            <div className="flex justify-between">
              <span>×1.25</span>
              <span>פוטנציאל רווח</span>
            </div>
            <div className="flex justify-between">
              <span>×1.25</span>
              <span>הצלחת אסטרטגיה</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">+10</span>
              <span>התאמת זמנים</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">+15</span>
              <span>תמיכה פונדמנטלית</span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-600">+25</span>
              <span>שיטה אישית</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">-15</span>
              <span>סתירות אינדיקטורים</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalQualityMonitor;
