
import React, { ReactNode } from 'react';
import { Badge } from '@/components/ui/badge';

interface AssetMetricCardProps {
  title: string;
  value: string | number | ReactNode;
  badge?: string | ReactNode;
  icon?: ReactNode;
}

const AssetMetricCard = ({ title, value, badge, icon }: AssetMetricCardProps) => {
  return (
    <div className="p-2 border rounded-md text-right">
      <div className="flex items-center justify-between">
        <Badge variant="outline" className="text-xs">
          {badge}
        </Badge>
        <span className="text-muted-foreground text-xs">{title}</span>
      </div>
      <p className="font-medium mt-1 flex items-center justify-end gap-1">
        {icon}
        <span>{value}</span>
      </p>
    </div>
  );
};

export default AssetMetricCard;
