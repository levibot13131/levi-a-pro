
import React from 'react';
import { Skeleton } from '../../ui/skeleton';
import { RefreshCw } from 'lucide-react';

const ChartLoading: React.FC = () => {
  return (
    <div className="space-y-2">
      <Skeleton className="h-[300px] w-full rounded-lg" />
      <div className="flex justify-center items-center">
        <RefreshCw className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="mr-2 text-sm text-muted-foreground">טוען נתוני מחיר בזמן אמת...</span>
      </div>
    </div>
  );
};

export default ChartLoading;
