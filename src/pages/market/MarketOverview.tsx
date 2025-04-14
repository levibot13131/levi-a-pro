
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const MarketOverview = () => {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6 text-right">סקירת שוק</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-right">שוק הקריפטו</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right">נתוני שוק הקריפטו יופיעו כאן</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-right">שוק המניות</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right">נתוני שוק המניות יופיעו כאן</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-right">שוק המט"ח</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-right">נתוני שוק המט"ח יופיעו כאן</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketOverview;
