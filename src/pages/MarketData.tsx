
import React from 'react';
import { Container } from '@/components/ui/container';

const MarketData = () => {
  return (
    <Container className="py-6">
      <h1 className="text-3xl font-bold">נתוני שוק</h1>
      <p className="text-muted-foreground">מידע על מחירים, מגמות ונתונים נוספים</p>
      
      <div className="mt-6">
        <p>תוכן עמוד נתוני השוק יופיע כאן</p>
      </div>
    </Container>
  );
};

export default MarketData;
