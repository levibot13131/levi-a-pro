
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

const IntelligenceDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            Intelligence Layer Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <span>🐋 Whale Activity Monitor</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded">
                <span>📱 Sentiment Analysis</span>
                <Badge className="bg-green-100 text-green-800">Live</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded">
                <span>😰 Fear & Greed Index</span>
                <Badge className="bg-green-100 text-green-800">Tracking</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-red-50 rounded">
                <span>🚨 Risk Scoring</span>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">94%</div>
            <div className="text-sm text-muted-foreground">Intelligence Accuracy</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-muted-foreground">Enhanced Signals Today</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">85%</div>
            <div className="text-sm text-muted-foreground">Signal Boost Rate</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IntelligenceDashboard;
