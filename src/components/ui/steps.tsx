
import React, { createContext, useContext } from 'react';
import { cn } from '@/lib/utils';

interface StepsContextProps {
  activeStep?: number;
}

const StepsContext = createContext<StepsContextProps>({
  activeStep: 0,
});

// Steps component 
const Steps = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement> & StepsContextProps
>(({ className, activeStep = 0, ...props }, ref) => (
  <StepsContext.Provider value={{ activeStep }}>
    <div 
      ref={ref} 
      className={cn("space-y-4", className)} 
      {...props} 
    />
  </StepsContext.Provider>
));
Steps.displayName = "Steps";

// Step component 
const Step = React.forwardRef<
  HTMLDivElement, 
  React.HTMLAttributes<HTMLDivElement> & { index?: number }
>(({ className, index, children, ...props }, ref) => {
  return (
    <div 
      ref={ref} 
      className={cn(
        "relative border p-4 rounded-md",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
});
Step.displayName = "Step";

export { Steps, Step };
