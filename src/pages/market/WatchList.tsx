
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WatchList = () => {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <h1 className="text-2xl font-bold mb-6 text-right">רשימת מעקב</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-right">רשימת הנכסים שלי</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-right">רשימת הנכסים במעקב תופיע כאן</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default WatchList;
