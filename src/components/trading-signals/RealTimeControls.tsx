
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { getAlertDestinations } from '@/services/tradingView/alerts/destinations';

interface RealTimeControlsProps {
  realTimeActive: boolean;
  toggleRealTimeAnalysis: () => void;
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
}

const RealTimeControls: React.FC<RealTimeControlsProps> = ({
  realTimeActive,
  toggleRealTimeAnalysis,
  showSettings,
  setShowSettings
}) => {
  const hasActiveDestinations = getAlertDestinations().some(dest => dest.active);
  
  const handleToggleRealTime = () => {
    if (!hasActiveDestinations && !realTimeActive) {
      setShowSettings(true);
      toast.warning('לא הוגדרו יעדי התראות פעילים', {
        description: 'הגדר לפחות יעד אחד לקבלת התראות לפני הפעלת ניתוח בזמן אמת'
      });
      return;
    }
    
    toggleRealTimeAnalysis();
  };
  
  return (
    <div className="flex gap-2">
      <Button 
        onClick={handleToggleRealTime}
        variant={realTimeActive ? "destructive" : "default"}
        className="flex items-center gap-2"
      >
        {realTimeActive ? (
          <>הפסק ניתוח בזמן אמת</>
        ) : (
          <>
            <Play className="h-4 w-4" />
            הפעל ניתוח בזמן אמת
          </>
        )}
      </Button>
      
      <Button
        variant="outline"
        onClick={() => setShowSettings(!showSettings)}
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        {showSettings ? 'הסתר הגדרות' : 'הגדרות התראות'}
      </Button>
    </div>
  );
};

export default RealTimeControls;
