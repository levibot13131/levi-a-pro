
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';
import { calculatePositionSize } from '@/services/customTradingStrategyService';
import RiskCalculatorForm from './RiskCalculatorForm';
import RiskCalculatorResults from './RiskCalculatorResults';
import RiskCalculatorError from './RiskCalculatorError';

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
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <Calculator className="h-5 w-5" />
          <div>חישוב גודל פוזיציה</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RiskCalculatorForm 
          values={values}
          handleChange={handleChange}
          handleCalculate={handleCalculate}
        />
        
        <RiskCalculatorError error={error} />
        
        <RiskCalculatorResults 
          result={result} 
          riskPercentage={values.riskPercentage} 
        />
      </CardContent>
    </Card>
  );
};

export default RiskCalculator;
