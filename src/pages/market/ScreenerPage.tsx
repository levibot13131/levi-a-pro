
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ScreenerPage = () => {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6 text-right">סורק מטבעות</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-right">סורק מטבעות חכם</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-right">תוצאות הסריקה יופיעו כאן</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScreenerPage;
