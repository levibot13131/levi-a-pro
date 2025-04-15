
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SourcesTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">מקורות מידע</CardTitle>
      </CardHeader>
      <CardContent className="text-right">
        <p>מקורות המידע של הפלטפורמה יופיעו כאן.</p>
      </CardContent>
    </Card>
  );
};

export default SourcesTab;
