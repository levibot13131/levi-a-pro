
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export interface RiskCalculatorFormProps {
  accountSize: string;
  setAccountSize: React.Dispatch<React.SetStateAction<string>>;
  entryPrice: string;
  setEntryPrice: React.Dispatch<React.SetStateAction<string>>;
  stopLoss: string;
  setStopLoss: React.Dispatch<React.SetStateAction<string>>;
  riskPercentage: string;
  setRiskPercentage: React.Dispatch<React.SetStateAction<string>>;
  direction: 'long' | 'short';
  setDirection: React.Dispatch<React.SetStateAction<'long' | 'short'>>;
}

const RiskCalculatorForm: React.FC<RiskCalculatorFormProps> = ({
  accountSize,
  setAccountSize,
  entryPrice,
  setEntryPrice,
  stopLoss,
  setStopLoss,
  riskPercentage,
  setRiskPercentage,
  direction,
  setDirection
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accountSize" className="text-right block">גודל חשבון (₪)</Label>
          <Input
            id="accountSize"
            type="text"
            value={accountSize}
            onChange={(e) => setAccountSize(e.target.value)}
            dir="ltr"
            className="text-right"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="riskPercentage" className="text-right block">אחוז סיכון (%)</Label>
          <Input
            id="riskPercentage"
            type="text"
            value={riskPercentage}
            onChange={(e) => setRiskPercentage(e.target.value)}
            dir="ltr"
            className="text-right"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label className="text-right block">כיוון העסקה</Label>
        <RadioGroup
          value={direction}
          onValueChange={(value) => setDirection(value as 'long' | 'short')}
          className="flex justify-end space-x-4 rtl:space-x-reverse"
        >
          <div className="flex items-center">
            <RadioGroupItem value="short" id="short" />
            <Label htmlFor="short" className="mr-2">שורט</Label>
          </div>
          <div className="flex items-center">
            <RadioGroupItem value="long" id="long" />
            <Label htmlFor="long" className="mr-2">לונג</Label>
          </div>
        </RadioGroup>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entryPrice" className="text-right block">מחיר כניסה</Label>
          <Input
            id="entryPrice"
            type="text"
            value={entryPrice}
            onChange={(e) => setEntryPrice(e.target.value)}
            dir="ltr"
            className="text-right"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="stopLoss" className="text-right block">מחיר סטופ לוס</Label>
          <Input
            id="stopLoss"
            type="text"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            dir="ltr"
            className="text-right"
          />
        </div>
      </div>
    </div>
  );
};

export default RiskCalculatorForm;
