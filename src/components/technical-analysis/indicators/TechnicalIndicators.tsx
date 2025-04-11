
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';
import { IndicatorTabs } from './';

interface TechnicalIndicatorsProps {
  analysisLoading: boolean;
  analysisData: any;
  selectedAsset: any;
}

const TechnicalIndicators = ({ 
  analysisLoading, 
  analysisData, 
  selectedAsset 
}: TechnicalIndicatorsProps) => {
  const [autoScanEnabled, setAutoScanEnabled] = useState<boolean>(true);
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Switch
              id="auto-scan"
              checked={autoScanEnabled}
              onCheckedChange={setAutoScanEnabled}
            />
            <Label htmlFor="auto-scan">סריקה אוטומטית</Label>
          </div>
          <CardTitle className="text-right">אינדיקטורים וסריקה חכמה</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {analysisLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : analysisData ? (
          <IndicatorTabs
            analysisData={analysisData}
            selectedAsset={selectedAsset}
            autoScanEnabled={autoScanEnabled}
          />
        ) : (
          <div className="text-center p-10">
            <AlertTriangle className="h-10 w-10 text-yellow-500 mx-auto mb-4" />
            <p>לא נמצאו נתוני אינדיקטורים עבור הנכס הנבחר</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TechnicalIndicators;
