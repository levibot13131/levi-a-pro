
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const TwitterSentimentChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">ניתוח סנטימנט בטוויטר</CardTitle>
        <CardDescription className="text-right">
          ניתוח תחושת השוק לגבי מטבעות קריפטו מובילים
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center">נתוני סנטימנט יוצגו כאן בקרוב.</p>
      </CardContent>
    </Card>
  );
};

export default TwitterSentimentChart;
