
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Activity } from 'lucide-react';

type HealthStatus = 'healthy' | 'partial' | 'disconnected' | 'unknown';

interface HealthIndicatorProps {
  health: HealthStatus;
}

export const HealthIndicator: React.FC<HealthIndicatorProps> = ({ health }) => {
  const healthDetails = getHealthDetails(health);
  
  return (
    <Badge className={`${healthDetails.color} flex items-center gap-1`}>
      {healthDetails.icon} {healthDetails.label}
    </Badge>
  );
};

function getHealthDetails(health: HealthStatus) {
  switch (health) {
    case 'healthy':
      return {
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: 'Healthy',
        color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      };
    case 'partial':
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        label: 'Partial',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      };
    case 'disconnected':
      return {
        icon: <AlertCircle className="h-4 w-4" />,
        label: 'Disconnected',
        color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      };
    default:
      return {
        icon: <Activity className="h-4 w-4" />,
        label: 'Unknown',
        color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      };
  }
}
