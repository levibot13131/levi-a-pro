
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Twitter, MessageSquare, TrendingUp, Users } from 'lucide-react';

interface SentimentAnalysisProps {
  assetId: string;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ assetId }) => {
  // Mock sentiment data
  const sentimentData = {
    social: 78,
    news: 65,
    technical: 82,
    overall: 75,
    sources: 432,
    lastUpdated: '10 דקות',
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">סנטימנט כללי</h3>
          <span className="text-sm text-muted-foreground">עודכן לפני {sentimentData.lastUpdated}</span>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span>סנטימנט רשתות חברתיות</span>
            <Twitter className="h-4 w-4 text-blue-500" />
          </div>
          <Progress value={sentimentData.social} className="h-2 bg-gray-100" />
          
          <div className="flex justify-between items-center mt-4">
            <span>סנטימנט חדשות</span>
            <MessageSquare className="h-4 w-4 text-green-500" />
          </div>
          <Progress value={sentimentData.news} className="h-2 bg-gray-100" />
          
          <div className="flex justify-between items-center mt-4">
            <span>סנטימנט טכני</span>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <Progress value={sentimentData.technical} className="h-2 bg-gray-100" />
        </div>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-right text-lg">מדד הפחד/חמדנות כללי</CardTitle>
          <CardDescription className="text-right">מבוסס על ניתוח {sentimentData.sources} מקורות</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative py-4">
            <div className="flex justify-center">
              <div className="relative h-32 w-32 flex items-center justify-center rounded-full border-8 border-gray-100">
                <span className="text-3xl font-bold">{sentimentData.overall}</span>
                <span className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  חמדנות
                </span>
              </div>
            </div>
            
            <div className="mt-4 flex justify-between">
              <div className="text-center">
                <div className="h-2 w-10 bg-red-500 rounded"></div>
                <span className="text-xs">פחד קיצוני</span>
              </div>
              <div className="text-center">
                <div className="h-2 w-10 bg-orange-400 rounded"></div>
                <span className="text-xs">פחד</span>
              </div>
              <div className="text-center">
                <div className="h-2 w-10 bg-yellow-300 rounded"></div>
                <span className="text-xs">ניטרלי</span>
              </div>
              <div className="text-center">
                <div className="h-2 w-10 bg-green-400 rounded"></div>
                <span className="text-xs">חמדנות</span>
              </div>
              <div className="text-center">
                <div className="h-2 w-10 bg-green-600 rounded"></div>
                <span className="text-xs">חמדנות קיצונית</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/30 pb-2 flex justify-between">
          <div className="text-xs text-muted-foreground">
            <Users className="inline h-3 w-3 mr-1" />
            {sentimentData.sources} משתתפים
          </div>
          <span className="text-xs text-right text-muted-foreground">עודכן לפני {sentimentData.lastUpdated}</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SentimentAnalysis;
