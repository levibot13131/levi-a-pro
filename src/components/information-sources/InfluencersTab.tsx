
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const InfluencersTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">משפיענים</CardTitle>
      </CardHeader>
      <CardContent className="text-right">
        <p>רשימת המשפיענים תופיע כאן.</p>
      </CardContent>
    </Card>
  );
};

export default InfluencersTab;
