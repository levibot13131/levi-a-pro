
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyAnalysisStateProps {
  onRefetch: () => void;
  title?: string;
}

const EmptyAnalysisState: React.FC<EmptyAnalysisStateProps> = ({ 
  onRefetch, 
  title = 'ניתוח מעמיק' 
}) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-right">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <Button onClick={onRefetch}>טען ניתוח</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyAnalysisState;
