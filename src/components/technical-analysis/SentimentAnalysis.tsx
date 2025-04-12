
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const SentimentAnalysis = () => {
  const sentimentData = {
    overall: 65,
    social: 78,
    news: 55
  };

  return (
    <Card className="w-full">
      <CardContent className="py-6">
        <h3 className="text-lg font-semibold mb-4 text-right">ניתוח סנטימנט</h3>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{sentimentData.overall}%</span>
              <span className="text-sm font-medium text-right">סנטימנט כללי</span>
            </div>
            <Progress 
              value={sentimentData.overall} 
              className="h-2 bg-gray-200"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{sentimentData.social}%</span>
              <span className="text-sm font-medium text-right">סנטימנט מרשתות חברתיות</span>
            </div>
            <Progress 
              value={sentimentData.social} 
              className="h-2 bg-gray-200"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{sentimentData.news}%</span>
              <span className="text-sm font-medium text-right">סנטימנט חדשותי</span>
            </div>
            <Progress 
              value={sentimentData.news} 
              className="h-2 bg-gray-200"
            />
          </div>
          
          <div className="pt-4">
            <h4 className="text-sm font-semibold mb-2 text-right">מקורות נוספים לניתוח סנטימנט:</h4>
            <ul className="text-sm text-right space-y-1">
              <li>• מדד הפחד והחמדנות: 65 (חמדנות)</li>
              <li>• חיפושים בגוגל: עלייה של 15% בשבוע האחרון</li>
              <li>• מדדי וויקס: רמות נמוכות</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;
