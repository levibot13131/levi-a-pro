
import React from 'react';
import { 
  BellRing, 
  BellOff, 
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { TrackedAsset } from '@/services/assetTracking/types';
import AssetListTable from './AssetListTable';

interface TrackedAssetListProps {
  assets: TrackedAsset[];
  onTogglePin: (assetId: string) => void;
  onToggleAlerts: (assetId: string) => void;
  onSetPriority: (assetId: string, priority: 'high' | 'medium' | 'low') => void;
  onRowAction?: (assetId: string) => void;
  compact?: boolean;
}

const TrackedAssetList: React.FC<TrackedAssetListProps> = ({ 
  assets, 
  onTogglePin, 
  onToggleAlerts, 
  onSetPriority,
  onRowAction,
  compact = false
}) => {
  const renderActions = (asset: TrackedAsset) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>אפשרויות</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onToggleAlerts(asset.id)}>
            {asset.alertsEnabled ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                <span>בטל התראות</span>
              </>
            ) : (
              <>
                <BellRing className="h-4 w-4 mr-2" />
                <span>הפעל התראות</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>עדיפות</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onSetPriority(asset.id, 'high')}>
            <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
            <span>גבוהה</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSetPriority(asset.id, 'medium')}>
            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
            <span>בינונית</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onSetPriority(asset.id, 'low')}>
            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
            <span>נמוכה</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <AssetListTable 
      assets={assets}
      onTogglePin={onTogglePin}
      onRowAction={onRowAction}
      renderActions={renderActions}
      compact={compact}
    />
  );
};

export default TrackedAssetList;
