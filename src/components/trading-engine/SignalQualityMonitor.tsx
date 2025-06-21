
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

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">שיעור מעבר:</span>
              <Badge variant={passRate >= 80 ? "default" : passRate >= 60 ? "secondary" : "destructive"}>
                {passRate.toFixed(1)}%
              </Badge>
            </div>
            
            <Progress value={passRate} className="h-3" />
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">סף ניקוד מינימלי:</span>
              <Badge variant="outline">{threshold}</Badge>
            </div>
          </div>

          {/* Quality Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">התפלגות איכות איתותים</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">ELITE (90+)</span>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">
                    {Math.floor(scoreStats.signalsPassedFilter * 0.2)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm">HIGH (75-89)</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {Math.floor(scoreStats.signalsPassedFilter * 0.4)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">MEDIUM (60-74)</span>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800">
                    {Math.floor(scoreStats.signalsPassedFilter * 0.3)}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">LOW (&lt;60)</span>
                  </div>
                  <Badge className="bg-gray-100 text-gray-800">
                    {scoreStats.totalSignalsAnalyzed - scoreStats.signalsPassedFilter}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scoring Components */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">רכיבי הניקוד</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>יחס סיכוי/סיכון (×20)</span>
                  <span className="font-medium">עד 50 נקודות</span>
                </div>
                <div className="flex justify-between">
                  <span>רמת ביטחון (×75)</span>
                  <span className="font-medium">עד 75 נקודות</span>
                </div>
                <div className="flex justify-between">
                  <span>בונוס אסטרטגיה אישית</span>
                  <span className="font-medium">+25 נקודות</span>
                </div>
                <div className="flex justify-between">
                  <span>בונוס שעות מסחר</span>
                  <span className="font-medium">+10 נקודות</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-semibold">
                  <span>סה"כ מקסימלי</span>
                  <span>160 נקודות</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignalQualityMonitor;
