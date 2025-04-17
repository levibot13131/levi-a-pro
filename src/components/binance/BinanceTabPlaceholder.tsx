
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface BinanceTabPlaceholderProps {
  title: string;
}

const BinanceTabPlaceholder: React.FC<BinanceTabPlaceholderProps> = ({ title }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-md">
          <p className="text-center text-sm">
            פיתוח {title} בתהליך...
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default BinanceTabPlaceholder;
