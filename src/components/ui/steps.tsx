
import React from 'react';
import { cn } from '@/lib/utils';

interface StepProps {
  title: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

interface StepsProps {
  children: React.ReactNode;
  className?: string;
}

export const Step = ({ title, icon, children, className }: StepProps) => {
  return (
    <div className={cn("border-l pl-6 pb-6 border-muted-foreground/20 last:border-l-0 last:pb-0 relative", className)}>
      <div className="absolute -left-[5px] h-[10px] w-[10px] rounded-full bg-primary" />
      <h3 className="font-medium text-lg mb-2 flex items-center gap-2">
        {icon && <span className="text-primary">{icon}</span>}
        {title}
      </h3>
      <div className="text-sm text-muted-foreground">
        {children}
      </div>
    </div>
  );
};

export const Steps = ({ children, className }: StepsProps) => {
  return (
    <div className={cn("space-y-0", className)}>
      {children}
    </div>
  );
};
