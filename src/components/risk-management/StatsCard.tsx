
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description?: string;
}

export const StatsCard = ({ title, value, icon, description }: StatsCardProps) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex justify-between items-start">
        <div className="mt-1">{icon}</div>
        <div className="text-right">
          <h3 className="font-medium text-muted-foreground">{title}</h3>
          <div className="text-2xl font-bold mt-1">{value}</div>
          {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
        </div>
      </div>
    </CardContent>
  </Card>
);
