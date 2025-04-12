
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link, RefreshCw, BellRing, BellOff, Eye, EyeOff } from 'lucide-react';
import { addTrackedAsset } from '@/services/assetTracking';
import { toast } from 'sonner';

interface IntegrationStatusSectionProps {
  isConnected: boolean;
  lastSync?: string;
  assetId?: string;
  onForceUpdate?: () => void;
  onToggleNotifications?: () => void;
  hasNotifications?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

const IntegrationStatusSection: React.FC<IntegrationStatusSectionProps> = ({
  isConnected,
  lastSync,
  assetId,
  onForceUpdate,
  onToggleNotifications,
  hasNotifications = false,
  isVisible = true,
  onToggleVisibility
}) => {
  const handleTrackAsset = async () => {
    if (!assetId) return;
    
    try {
      const success = await addTrackedAsset(assetId);
      if (success) {
        toast.success('נכס נוסף למעקב');
      } else {
        toast.info('נכס כבר נמצא במעקב');
      }
    } catch (error) {
      toast.error('שגיאה בהוספת נכס למעקב');
    }
  };
  
  return (
    <div className="flex flex-col gap-2 border p-4 rounded-lg">
      <div className="flex justify-between items-center">
        <Badge variant={isConnected ? "success" : "destructive"}>
          {isConnected ? 'מחובר' : 'לא מחובר'}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {lastSync ? `עדכון אחרון: ${lastSync}` : 'אין נתונים'}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        {onForceUpdate && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onForceUpdate} 
            className="col-span-2"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            עדכן עכשיו
          </Button>
        )}
        
        {assetId && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTrackAsset}
          >
            <Eye className="h-4 w-4 mr-2" />
            הוסף למעקב
          </Button>
        )}
        
        {onToggleNotifications && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleNotifications}
          >
            {hasNotifications ? (
              <>
                <BellOff className="h-4 w-4 mr-2" />
                בטל התראות
              </>
            ) : (
              <>
                <BellRing className="h-4 w-4 mr-2" />
                הפעל התראות
              </>
            )}
          </Button>
        )}
        
        {onToggleVisibility && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onToggleVisibility}
          >
            {isVisible ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                הסתר
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                הצג
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default IntegrationStatusSection;
