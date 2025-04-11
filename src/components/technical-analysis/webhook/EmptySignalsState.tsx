
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const EmptySignalsState: React.FC = () => {
  return (
    <div className="text-center py-8 text-muted-foreground">
      <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
      <p>אין סיגנלים להצגה</p>
      <p className="text-sm">סיגנלים חדשים מטריידינגויו יופיעו כאן</p>
      <p className="text-xs mt-2">עקוב אחר המדריך למעלה כדי להגדיר התראות בטריידינגויו</p>
    </div>
  );
};

export default EmptySignalsState;
