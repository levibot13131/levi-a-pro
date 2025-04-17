
import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeProps extends React.HTMLAttributes<HTMLPreElement> {
  children: React.ReactNode;
}

const Code = React.forwardRef<HTMLPreElement, CodeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <pre
        ref={ref}
        className={cn(
          "mb-4 mt-2 overflow-x-auto rounded-lg bg-slate-950 p-4 text-left font-mono text-sm text-slate-50 dark:bg-slate-900",
          className
        )}
        {...props}
      >
        <code className="font-mono text-sm">{children}</code>
      </pre>
    );
  }
);

Code.displayName = "Code";

export { Code };
