
import React from 'react';
import { Badge } from '../../../components/ui/badge';

interface SyncStatusDisplayProps {
  isConnected: boolean;
  syncEnabled: boolean;
  refreshTimer: number;
  lastSyncTime: Date | null;
  formatLastSyncTime: () => string;
}

const SyncStatusDisplay: React.FC<SyncStatusDisplayProps> = ({
  isConnected,
  syncEnabled,
  refreshTimer,
  lastSyncTime,
  formatLastSyncTime
}) => {
  if (!isConnected || !syncEnabled) return null;
  
  return (
    <div className="mt-2 flex justify-end items-center text-sm text-muted-foreground">
      <span>עדכון אחרון: {formatLastSyncTime()}</span>
      <Badge 
        variant="outline" 
        className="mr-2"
      >
        {refreshTimer < 30 ? 'נתונים עדכניים' : 'עדכון בקרוב'}
      </Badge>
    </div>
  );
};

export default SyncStatusDisplay;
