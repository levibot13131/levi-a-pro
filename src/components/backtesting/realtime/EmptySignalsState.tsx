
import React from 'react';
import { BellRing } from 'lucide-react';

const EmptySignalsState: React.FC = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <BellRing className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
      <p>אין איתותים להצגה</p>
      <p className="text-sm">איתותים חדשים יופיעו כאן כאשר המערכת פעילה</p>
    </div>
  );
};

export default EmptySignalsState;
