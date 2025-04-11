
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface LoadingStateProps {
  title?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ title = 'ניתוח מעמיק' }) => {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-right">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center py-10">
        <LoadingSpinner />
      </CardContent>
    </Card>
  );
};

export default LoadingState;
