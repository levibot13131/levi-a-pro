
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EliteSignalDashboard from '@/components/signals/EliteSignalDashboard';
import { TrendingUp, Target, Zap, Brain } from 'lucide-react';

const Dashboard: React.FC = () => {
  return (
    <div className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">לוח בקרה - LeviPro Elite</h1>
          <p className="text-muted-foreground">
            מערכת איתותים אוטונומית עם פילטרי איכות מתקדמים
          </p>
        </div>
        <Brain className="h-12 w-12 text-primary" />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center space-x-2">
            <Target className="h-8 w-8 text-green-500" />
            <div>
              <p className="text-sm font-medium">מצב מנוע</p>
              <p className="text-2xl font-bold text-green-600">Elite</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-blue-500" />
            <div>
              <p className="text-sm font-medium">איכות איתותים</p>
              <p className="text-2xl font-bold text-blue-600">&gt;80%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-2">
            <Zap className="h-8 w-8 text-orange-500" />
            <div>
              <p className="text-sm font-medium">R/R מינימום</p>
              <p className="text-2xl font-bold text-orange-600">1.5:1</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center space-x-2">
            <Brain className="h-8 w-8 text-purple-500" />
            <div>
              <p className="text-sm font-medium">AI Learning</p>
              <p className="text-2xl font-bold text-purple-600">פעיל</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Elite Signal Dashboard */}
      <EliteSignalDashboard />

      {/* Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>סטטוס מערכת</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>🔥 Elite Signal Engine</span>
              <span className="text-green-600 font-semibold">פעיל</span>
            </div>
            <div className="flex justify-between items-center">
              <span>📱 Telegram Integration</span>
              <span className="text-green-600 font-semibold">מחובר</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🧠 AI Learning Engine</span>
              <span className="text-blue-600 font-semibold">לומד</span>
            </div>
            <div className="flex justify-between items-center">
              <span>🎯 Personal Method Priority</span>
              <span className="text-orange-600 font-semibold">80%</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
