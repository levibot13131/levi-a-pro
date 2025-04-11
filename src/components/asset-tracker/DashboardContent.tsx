
import React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Rocket, Bell } from 'lucide-react';
import TrackedAssetList from '@/components/asset-tracker/TrackedAssetList';
import SocialMonitoring from '@/components/asset-tracker/SocialMonitoring';
import { TrackedAsset } from '@/services/assetTracking/types';

interface DashboardContentProps {
  assets: TrackedAsset[];
  onTogglePin: (assetId: string) => void;
  onToggleAlerts: (assetId: string) => void;
  onSetPriority: (assetId: string, priority: 'high' | 'medium' | 'low') => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  assets,
  onTogglePin,
  onToggleAlerts,
  onSetPriority
}) => {
  const highPriorityAssets = assets.filter(a => a.priority === 'high').slice(0, 5);
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-end gap-2">
              <Rocket className="h-5 w-5" />
              נכסים מובילים
            </CardTitle>
            <CardDescription className="text-right">
              נכסים בעדיפות גבוהה במעקב שלך
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TrackedAssetList 
              assets={highPriorityAssets}
              onTogglePin={onTogglePin}
              onToggleAlerts={onToggleAlerts}
              onSetPriority={onSetPriority}
              compact={true}
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center justify-end gap-2">
              <Bell className="h-5 w-5" />
              התראות אחרונות
            </CardTitle>
            <CardDescription className="text-right">
              התראות על שינויים משמעותיים בנכסים
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 text-muted-foreground">
              <p>ההתראות האחרונות יופיעו כאן</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <SocialMonitoring />
    </div>
  );
};

export default DashboardContent;
