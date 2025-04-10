
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import { PositionSizingCalculation } from '@/services/customTradingStrategyService';

interface RiskCalculatorResultsProps {
  result: PositionSizingCalculation | null;
  riskPercentage: number;
}

const RiskCalculatorResults = ({ result, riskPercentage }: RiskCalculatorResultsProps) => {
  if (!result) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount);
  };

  return (
    <div className="mt-4 space-y-3 p-3 bg-muted rounded-lg">
      <h3 className="font-semibold text-lg text-center">תוצאות החישוב</h3>
      <div className="flex justify-between">
        <Badge variant="outline" className="font-mono">
          {formatCurrency(result.maxLossAmount)}
        </Badge>
        <div>סכום מקסימלי לסיכון:</div>
      </div>
      
      <div className="flex justify-between">
        <Badge variant="outline" className="font-mono">
          {result.positionSize.toFixed(6)}
        </Badge>
        <div>גודל פוזיציה מחושב:</div>
      </div>
      
      {result.takeProfitPrice && (
        <div className="flex justify-between">
          <Badge variant={result.riskRewardRatio >= 2 ? "secondary" : "default"} className="font-mono">
            {result.riskRewardRatio.toFixed(2)}:1
          </Badge>
          <div>יחס סיכוי:סיכון:</div>
        </div>
      )}
      
      <div className="pt-2 border-t">
        <Alert variant={riskPercentage <= 1 ? "default" : "destructive"} className="flex items-start">
          {riskPercentage <= 1 ? (
            <CheckCircle2 className="h-4 w-4 mt-0.5" />
          ) : (
            <AlertTriangle className="h-4 w-4 mt-0.5" />
          )}
          <div className="mr-2 text-right">
            <AlertTitle>
              {riskPercentage <= 1 ? "סיכון תקין" : "סיכון גבוה"}
            </AlertTitle>
            <AlertDescription className="text-xs">
              {riskPercentage <= 1 
                ? "אחוז הסיכון עומד בכללים של אסטרטגיית הסיכון שלך" 
                : "אחוז הסיכון גבוה מהמומלץ באסטרטגיה (1%)"}
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </div>
  );
};

export default RiskCalculatorResults;
