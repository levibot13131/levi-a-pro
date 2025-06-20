
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { signalOutcomeTracker } from '@/services/ai/signalOutcomeTracker';
import { Brain, TrendingUp, TrendingDown, Target, Zap, BarChart3 } from 'lucide-react';

const AILearningDashboard: React.FC = () => {
  const [strategyPerformance, setStrategyPerformance] = useState<any[]>([]);
  const [learningInsights, setLearningInsights] = useState<any>(null);
  const [adaptiveWeights, setAdaptiveWeights] = useState<Record<string, number>>({});

  useEffect(() => {
    const updateLearningData = () => {
      setStrategyPerformance(signalOutcomeTracker.getStrategyPerformance());
      setLearningInsights(signalOutcomeTracker.getLearningInsights());
      setAdaptiveWeights(signalOutcomeTracker.getAdaptiveWeights());
    };

    updateLearningData();

    // Listen for learning updates
    const handleLearningUpdate = () => {
      updateLearningData();
    };

    window.addEventListener('ai-learning-update', handleLearningUpdate);

    // Update every 30 seconds
    const interval = setInterval(updateLearningData, 30000);

    return () => {
      window.removeEventListener('ai-learning-update', handleLearningUpdate);
      clearInterval(interval);
    };
  }, []);

  const getPerformanceColor = (winRate: number) => {
    if (winRate >= 0.8) return 'text-green-600';
    if (winRate >= 0.6) return 'text-blue-600';
    if (winRate >= 0.4) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getWeightColor = (weight: number) => {
    if (weight >= 0.8) return 'bg-green-100 text-green-800';
    if (weight >= 0.6) return 'bg-blue-100 text-blue-800';
    if (weight >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="space-y-6">
      {/* Learning Overview */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            לולאת למידה של AI - מעקב ביצועים
          </CardTitle>
        </CardHeader>
        <CardContent>
          {learningInsights && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {learningInsights.totalSignalsTracked}
                </div>
                <div className="text-sm text-muted-foreground">איתותים במעקב</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {(learningInsights.overallWinRate * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">שיעור הצלחה כללי</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {learningInsights.adaptationCount}
                </div>
                <div className="text-sm text-muted-foreground">אסטרטגיות פעילות</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-orange-600">
                  {learningInsights.topPerformer}
                </div>
                <div className="text-sm text-muted-foreground">אסטרטגיה מובילה</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Strategy Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            ביצועי אסטרטגיות עם משקלים אדפטיביים
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {strategyPerformance.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>מחכה לנתוני למידה...</p>
                <p className="text-sm">הAI יתחיל ללמוד כשיהיו תוצאות איתותים</p>
              </div>
            ) : (
              strategyPerformance.map((strategy, index) => (
                <Card key={strategy.strategy} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Badge className={getWeightColor(strategy.currentWeight)}>
                          משקל: {(strategy.currentWeight * 100).toFixed(0)}%
                        </Badge>
                        {strategy.strategy === 'almog-personal-method' && (
                          <Badge className="bg-gold-100 text-gold-800">🧠 שיטה אישית</Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <h3 className="font-bold">{strategy.strategy}</h3>
                        <p className="text-sm text-muted-foreground">
                          {strategy.totalSignals} איתותים כולל
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className={`text-xl font-bold ${getPerformanceColor(strategy.winRate)}`}>
                          {(strategy.winRate * 100).toFixed(1)}%
                        </div>
                        <div className="text-xs text-muted-foreground">שיעור הצלחה</div>
                        <Progress value={strategy.winRate * 100} className="h-2 mt-1" />
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          +{strategy.avgProfitPercent.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">רווח ממוצע</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">
                          -{strategy.avgLossPercent.toFixed(2)}%
                        </div>
                        <div className="text-xs text-muted-foreground">הפסד ממוצע</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                          {strategy.bestRR.toFixed(1)}:1
                        </div>
                        <div className="text-xs text-muted-foreground">R/R הטוב ביותר</div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">
                          ביטחון: {(strategy.confidence * 100).toFixed(0)}%
                        </span>
                        <span className="text-muted-foreground">
                          זמן ממוצע: {Math.round(strategy.avgDuration / 60)}h
                        </span>
                        <span className="text-muted-foreground">
                          W/L: {strategy.winCount}/{strategy.lossCount}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Learning Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            סטטוס למידה אדפטיבית
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <Badge className="bg-green-100 text-green-800">✅ פעיל</Badge>
              <span className="font-medium">מעקב תוצאות איתותים</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <Badge className="bg-blue-100 text-blue-800">🔄 אוטומטי</Badge>
              <span className="font-medium">עדכון משקלי אסטרטגיות</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <Badge className="bg-purple-100 text-purple-800">🧠 למידה</Badge>
              <span className="font-medium">זיכרון ביצועים היסטורי</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <Badge className="bg-orange-100 text-orange-800">⚡ אדפטיבי</Badge>
              <span className="font-medium">התאמת ניקוד איכות בזמן אמת</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AILearningDashboard;
