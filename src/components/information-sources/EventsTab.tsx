
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const EventsTab = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">אירועים קרובים</CardTitle>
      </CardHeader>
      <CardContent className="text-right">
        <p>אירועים קרובים יופיעו כאן.</p>
      </CardContent>
    </Card>
  );
};

export default EventsTab;
