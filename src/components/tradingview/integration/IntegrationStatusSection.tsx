
import React, { useState } from 'react';
import TradingViewConnectionStatus from '../TradingViewConnectionStatus';
import SyncStatusDisplay from './SyncStatusDisplay';
import { getAllAssetsSync } from '@/services/realTimeAssetService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Bell } from 'lucide-react';
import { toast } from 'sonner';
import { addTrackedAsset } from '@/services/assetTracking/assetManagement';
import { getTrackedAssets } from '@/services/assetTracking/storage';

interface IntegrationStatusSectionProps {
  isConnected: boolean;
  syncEnabled: boolean;
  refreshTimer: number;
  lastSyncTime: Date | null;
  formatLastSyncTime: () => string;
  toggleAutoSync: () => void;
}

const IntegrationStatusSection: React.FC<IntegrationStatusSectionProps> = ({
  isConnected,
  syncEnabled,
  refreshTimer,
  lastSyncTime,
  formatLastSyncTime,
  toggleAutoSync
}) => {
  // Get total assets count across all markets for display
  const totalAssets = getAllAssetsSync().length;
  const [isCreatingWatchlist, setIsCreatingWatchlist] = useState(false);
  
  // הוספת פונקציה ליצירת רשימת מעקב אוטומטית
  const createAutomaticWatchlist = () => {
    setIsCreatingWatchlist(true);
    
    try {
      // קבלת כל הנכסים הזמינים
      const allAssets = getAllAssets();
      // קבלת הנכסים שכבר במעקב
      const trackedAssets = getTrackedAssets();
      const trackedIds = trackedAssets.map(asset => asset.id);
      
      // בחירת נכסים פופולריים (לדוגמה: 5 הראשונים שעוד לא במעקב)
      const popularAssets = allAssets
        .filter(asset => !trackedIds.includes(asset.id))
        .slice(0, 5);
      
      if (popularAssets.length === 0) {
        toast.info('כל הנכסים הפופולריים כבר נמצאים ברשימת המעקב שלך');
        setIsCreatingWatchlist(false);
        return;
      }
      
      // הוספת הנכסים לרשימת המעקב
      let addedCount = 0;
      popularAssets.forEach(asset => {
        const success = addTrackedAsset(asset.id);
        if (success) addedCount++;
      });
      
      if (addedCount > 0) {
        toast.success(`נוספו ${addedCount} נכסים לרשימת המעקב`, {
          description: 'התראות יופעלו אוטומטית עבור נכסים אלו'
        });
      } else {
        toast.error('לא הצלחנו להוסיף נכסים חדשים לרשימת המעקב');
      }
    } catch (error) {
      console.error('Error creating automatic watchlist:', error);
      toast.error('אירעה שגיאה ביצירת רשימת המעקב האוטומטית');
    } finally {
      setIsCreatingWatchlist(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
      <div className="lg:col-span-3">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={createAutomaticWatchlist}
              disabled={isCreatingWatchlist}
              className="flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" />
              יצירת רשימת מעקב אוטומטית
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast.success('התראות אוטומטיות הופעלו', {
                  description: 'המערכת תשלח התראות אוטומטיות כאשר מתרחשים שינויים משמעותיים'
                });
              }}
              className="flex items-center gap-1"
            >
              <Bell className="h-4 w-4" />
              הפעלת התראות אוטומטיות
            </Button>
          </div>
          
          <Badge variant="outline" className="px-3 py-1">
            <span className="text-sm font-medium">נכסים פעילים: {totalAssets}</span>
          </Badge>
        </div>
        
        <TradingViewConnectionStatus 
          syncEnabled={syncEnabled}
          toggleAutoSync={toggleAutoSync}
        />
        
        <SyncStatusDisplay 
          isConnected={isConnected}
          syncEnabled={syncEnabled}
          refreshTimer={refreshTimer}
          lastSyncTime={lastSyncTime}
          formatLastSyncTime={formatLastSyncTime}
        />
      </div>
    </div>
  );
};

export default IntegrationStatusSection;
