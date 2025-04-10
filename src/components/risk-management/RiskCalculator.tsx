import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calculator, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { calculatePositionSize } from '@/services/customTradingStrategyService';

interface RiskCalculatorProps {
  accountSize?: number;
  onCalculate?: (result: any) => void;
}

const RiskCalculator = ({ accountSize = 100000, onCalculate }: RiskCalculatorProps) => {
  const [values, setValues] = useState({
    accountSize,
    riskPercentage: 1,
    entryPrice: 0,
    stopLossPrice: 0,
    targetPrice: 0
  });
  
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleChange = (field: string, value: number) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setError(null);
  };
  
  const handleCalculate = () => {
    try {
      if (values.entryPrice === 0) {
        throw new Error("מחיר כניסה חייב להיות גדול מאפס");
      }
      
      if (values.entryPrice === values.stopLossPrice) {
        throw new Error("מחיר כניסה וסטופ לוס לא יכולים להיות זהים");
      }
      
      const calculationResult = calculatePositionSize(
        values.accountSize,
        values.riskPercentage,
        values.entryPrice,
        values.stopLossPrice,
        values.targetPrice || undefined
      );
      
      setResult(calculationResult);
      
      if (onCalculate) {
        onCalculate(calculationResult);
      }
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('he-IL', { style: 'currency', currency: 'ILS' }).format(amount);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <Calculator className="h-5 w-5" />
          <div>חישוב גודל פוזיציה</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4 text-right">
          <div>
            <label className="text-sm font-medium mb-1 block">גודל החשבון</label>
            <Input
              type="number"
              value={values.accountSize}
              onChange={(e) => handleChange('accountSize', Number(e.target.value))}
              className="text-right"
              min={1000}
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <div className="text-sm font-medium">{values.riskPercentage}%</div>
              <label className="text-sm font-medium">אחוז סיכון</label>
            </div>
            <Slider
              value={[values.riskPercentage]}
              min={0.1}
              max={3}
              step={0.1}
              onValueChange={(values) => handleChange('riskPercentage', values[0])}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">מחיר כניסה</label>
            <Input
              type="number"
              value={values.entryPrice === 0 ? '' : values.entryPrice}
              onChange={(e) => handleChange('entryPrice', Number(e.target.value))}
              className="text-right"
              placeholder="הזן מחיר כניסה"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">מחיר סטופ לוס</label>
            <Input
              type="number"
              value={values.stopLossPrice === 0 ? '' : values.stopLossPrice}
              onChange={(e) => handleChange('stopLossPrice', Number(e.target.value))}
              className="text-right"
              placeholder="הזן מחיר סטופ"
              step="0.01"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium mb-1 block">מחיר יעד (אופציונלי)</label>
            <Input
              type="number"
              value={values.targetPrice === 0 ? '' : values.targetPrice}
              onChange={(e) => handleChange('targetPrice', Number(e.target.value))}
              className="text-right"
              placeholder="הזן מחיר יעד"
              step="0.01"
            />
          </div>
          
          <Button onClick={handleCalculate} className="w-full mt-2">
            חשב גודל פוזיציה
          </Button>
          
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>שגיאה</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {result && (
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
              
              {result.targetPrice && (
                <div className="flex justify-between">
                  <Badge variant={result.riskRewardRatio >= 2 ? "secondary" : "default"} className="font-mono">
                    {result.riskRewardRatio.toFixed(2)}:1
                  </Badge>
                  <div>יחס סיכוי:סיכון:</div>
                </div>
              )}
              
              <div className="pt-2 border-t">
                <Alert variant={values.riskPercentage <= 1 ? "default" : "destructive"} className="flex items-start">
                  {values.riskPercentage <= 1 ? (
                    <CheckCircle2 className="h-4 w-4 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-4 w-4 mt-0.5" />
                  )}
                  <div className="mr-2 text-right">
                    <AlertTitle>
                      {values.riskPercentage <= 1 ? "סיכון תקין" : "סיכון גבוה"}
                    </AlertTitle>
                    <AlertDescription className="text-xs">
                      {values.riskPercentage <= 1 
                        ? "אחוז הסיכ��ן עומד בכללים של אסטרטגיית הסיכון שלך" 
                        : "אחוז הסיכון גבוה מהמומלץ באסטרטגיה (1%)"}
                    </AlertDescription>
                  </div>
                </Alert>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RiskCalculator;
