
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  Zap, 
  Settings, 
  ToggleLeft, 
  ToggleRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface StatusCardProps {
  isActive: boolean;
  connectionStatus: string;
  isForceRealTime: boolean;
  handleToggleRealData: () => void;
  handleManualRefresh: () => void;
  handleEnableRealTime: () => void;
  isDevelopment: boolean;
}

export const ConnectionStatusCard: React.FC<StatusCardProps> = ({
  isActive,
  connectionStatus,
  isForceRealTime,
  handleToggleRealData,
  handleManualRefresh,
  handleEnableRealTime,
  isDevelopment
}) => {
  return isActive ? (
    <div className="rounded-md p-3 bg-green-50 dark:bg-green-950/20 flex items-start justify-between">
      <div>
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1"
            onClick={handleManualRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            רענן נתונים
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 justify-start"
            onClick={handleToggleRealData}
          >
            {isForceRealTime ? (
              <>
                <ToggleRight className="h-4 w-4 text-green-600" />
                מצב נתונים אמיתיים
              </>
            ) : (
              <>
                <ToggleLeft className="h-4 w-4" />
                מצב נתוני דמו
              </>
            )}
          </Button>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2 mb-1">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold">בינאנס מחובר בהצלחה</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          מערכת זמן אמת פעילה. נתונים מתעדכנים אוטומטית כל {isDevelopment ? "5" : "30"} שניות.
        </p>
        <p className="text-sm font-medium mt-1">
          מצב נתונים: {isForceRealTime ? (
            <span className="text-green-600">אמיתי</span>
          ) : (
            <span className="text-orange-500">דמו</span>
          )}
        </p>
      </div>
    </div>
  ) : (
    <div className="rounded-md p-3 bg-yellow-50 dark:bg-yellow-950/20 flex items-start justify-between">
      <div>
        <Button
          variant="outline"
          size="sm"
          className="gap-1"
          onClick={handleEnableRealTime}
          disabled={connectionStatus === 'disconnected'}
        >
          <Zap className="h-4 w-4" />
          הפעל זמן אמת
        </Button>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="h-5 w-5 text-yellow-600" />
          <h3 className="font-semibold">מצב דמו פעיל</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          המערכת פועלת במצב דמו. התחבר לבינאנס להפעלת מצב זמן אמת.
        </p>
        <Button
          variant="link"
          size="sm"
          className="p-0 h-auto"
          asChild
        >
          <Link to="/deployment-guide">
            למדריך הפצה מלא
          </Link>
        </Button>
      </div>
    </div>
  );
};

interface ProxyWarningCardProps {
  showWarning: boolean;
  isDevelopment: boolean;
}

export const ProxyWarningCard: React.FC<ProxyWarningCardProps> = ({
  showWarning,
  isDevelopment
}) => {
  if (!showWarning || isDevelopment) return null;
  
  return (
    <div className="rounded-md p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
      <div className="flex items-center gap-2 mb-1 justify-end">
        <h3 className="font-semibold">הגדרות פרוקסי חסרות</h3>
        <AlertTriangle className="h-5 w-5 text-amber-600" />
      </div>
      <p className="text-sm text-muted-foreground text-right mb-2">
        לחוויה מלאה וחיבור API מאובטח, מומלץ להגדיר פרוקסי.
      </p>
      <Button variant="outline" size="sm" className="w-full" asChild>
        <Link to="/proxy-settings">
          <Settings className="mr-2 h-4 w-4" />
          הגדר פרוקסי עכשיו
        </Link>
      </Button>
    </div>
  );
};

interface ConnectionStatsProps {
  connectionStatus: string;
  isRealTime: boolean;
  isDevelopment: boolean;
  lastUpdateTime: Date | null;
}

export const ConnectionStatsCard: React.FC<ConnectionStatsProps> = ({
  connectionStatus,
  isRealTime,
  isDevelopment,
  lastUpdateTime
}) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="border rounded-md p-3">
          <div className="text-2xl font-bold text-primary">
            {isDevelopment ? "100%" :
            connectionStatus === 'connected' ? '100%' : 
            connectionStatus === 'partial' ? '50%' : '0%'}
          </div>
          <div className="text-sm text-muted-foreground">כיסוי נתונים בזמן אמת</div>
        </div>
        <div className="border rounded-md p-3">
          <div className="text-2xl font-bold text-primary">
            {isRealTime ? (isDevelopment ? '5s' : '30s') : 'N/A'}
          </div>
          <div className="text-sm text-muted-foreground">תדירות עדכון</div>
        </div>
      </div>
      
      {lastUpdateTime && (
        <div className="text-sm text-right text-muted-foreground">
          עדכון אחרון: {lastUpdateTime.toLocaleTimeString('he-IL')}
        </div>
      )}
    </>
  );
};
