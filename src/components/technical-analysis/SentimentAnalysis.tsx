
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface SentimentAnalysisProps {
  assetId: string;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ assetId }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">סנטימנט כללי</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-green-500">65</span>
                <span className="text-sm">מדד פחד/חמדנות</span>
              </div>
              <Progress value={65} className="h-2 bg-gray-200" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-green-500">72%</span>
                <span className="text-sm">סנטימנט רשתות חברתיות</span>
              </div>
              <Progress value={72} className="h-2 bg-gray-200" />
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-yellow-500">55%</span>
                <span className="text-sm">סנטימנט חדשות</span>
              </div>
              <Progress value={55} className="h-2 bg-gray-200" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-sm">מגמות שיחה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-right space-y-2">
            <p className="text-sm font-medium">מילות מפתח חיוביות:</p>
            <div className="flex flex-wrap gap-2 justify-end">
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">התאוששות</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">עליות</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">מומנטום</span>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">פריצה</span>
            </div>
            
            <p className="text-sm font-medium mt-2">מילות מפתח שליליות:</p>
            <div className="flex flex-wrap gap-2 justify-end">
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">רגולציה</span>
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">תיקון</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;
