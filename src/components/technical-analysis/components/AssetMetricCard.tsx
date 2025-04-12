
import React, { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AssetMetricCardProps {
  title: string;
  value: string | number | ReactNode;
  badge?: string | ReactNode;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
}

const AssetMetricCard = ({ 
  title, 
  value, 
  badge, 
  icon, 
  trend, 
  className 
}: AssetMetricCardProps) => {
  return (
    <div className={cn(
      "p-2 border rounded-md text-right transition-colors",
      trend === 'up' && "border-green-200 bg-green-50/30",
      trend === 'down' && "border-red-200 bg-red-50/30",
      className
    )}>
      <div className="flex items-center justify-between">
        {badge && (
          <Badge variant="outline" className="text-xs">
            {badge}
          </Badge>
        )}
        <span className="text-muted-foreground text-xs">{title}</span>
      </div>
      <p className={cn(
        "font-medium mt-1 flex items-center justify-end gap-1",
        trend === 'up' && "text-green-600",
        trend === 'down' && "text-red-600"
      )}>
        {icon}
        <span>{value}</span>
      </p>
    </div>
  );
};

export default AssetMetricCard;
