
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { calculatePositionSize } from '@/services/customTradingStrategyService';
import RiskCalculatorForm from './RiskCalculatorForm';
import RiskCalculatorResults from './RiskCalculatorResults';
import RiskCalculatorError from './RiskCalculatorError';

const RiskCalculator = () => {
  const [accountSize, setAccountSize] = useState<string>('10000');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [riskPercentage, setRiskPercentage] = useState<string>('1');
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [calculationResult, setCalculationResult] = useState(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleCalculate = () => {
    // Clear previous results
    setError(null);
    setCalculationResult(null);
    
    // Validate inputs
    if (!accountSize || !entryPrice || !stopLoss || !riskPercentage) {
      setError('יש למלא את כל השדות');
      return;
    }
    
    const parsedAccountSize = parseFloat(accountSize);
    const parsedEntryPrice = parseFloat(entryPrice);
    const parsedStopLoss = parseFloat(stopLoss);
    const parsedRiskPercentage = parseFloat(riskPercentage);
    
    // Validate parsed values
    if (isNaN(parsedAccountSize) || isNaN(parsedEntryPrice) || isNaN(parsedStopLoss) || isNaN(parsedRiskPercentage)) {
      setError('אחד או יותר מהערכים שהוכנסו אינם מספרים תקינים');
      return;
    }
    
    if (parsedAccountSize <= 0 || parsedEntryPrice <= 0 || parsedRiskPercentage <= 0) {
      setError('יש להכניס ערכים חיוביים בלבד');
      return;
    }
    
    // For long positions, stop loss must be below entry price
    if (direction === 'long' && parsedStopLoss >= parsedEntryPrice) {
      setError('בעסקת לונג, הסטופ לוס חייב להיות נמוך ממחיר הכניסה');
      return;
    }
    
    // For short positions, stop loss must be above entry price
    if (direction === 'short' && parsedStopLoss <= parsedEntryPrice) {
      setError('בעסקת שורט, הסטופ לוס חייב להיות גבוה ממחיר הכניסה');
      return;
    }
    
    // Calculate position size
    try {
      const result = calculatePositionSize(
        parsedAccountSize,
        parsedRiskPercentage,
        parsedEntryPrice,
        parsedStopLoss,
        direction
      );
      setCalculationResult(result);
    } catch (err: any) {
      setError(err.message || 'אירעה שגיאה בחישוב גודל הפוזיציה');
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">מחשבון גודל פוזיציה וניהול סיכונים</CardTitle>
      </CardHeader>
      <CardContent>
        <RiskCalculatorForm
          accountSize={accountSize}
          setAccountSize={setAccountSize}
          entryPrice={entryPrice}
          setEntryPrice={setEntryPrice}
          stopLoss={stopLoss}
          setStopLoss={setStopLoss}
          riskPercentage={riskPercentage}
          setRiskPercentage={setRiskPercentage}
          direction={direction}
          setDirection={setDirection}
        />
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleCalculate}>חשב</Button>
        </div>
        
        {error && <RiskCalculatorError error={error} />}
        
        {calculationResult && (
          <RiskCalculatorResults 
            result={calculationResult} 
            riskPercentage={parseFloat(riskPercentage)}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default RiskCalculator;
