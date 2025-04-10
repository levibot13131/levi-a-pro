
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface RiskCalculatorFormProps {
  values: {
    accountSize: number;
    riskPercentage: number;
    entryPrice: number;
    stopLossPrice: number;
    targetPrice: number;
  };
  handleChange: (field: string, value: number) => void;
  handleCalculate: () => void;
}

const RiskCalculatorForm = ({ values, handleChange, handleCalculate }: RiskCalculatorFormProps) => {
  return (
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
    </div>
  );
};

export default RiskCalculatorForm;
