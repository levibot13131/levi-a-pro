
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface RiskCalculatorErrorProps {
  error: string | null;
}

const RiskCalculatorError = ({ error }: RiskCalculatorErrorProps) => {
  if (!error) return null;

  return (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>שגיאה</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default RiskCalculatorError;
