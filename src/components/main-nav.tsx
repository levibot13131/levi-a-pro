
import * as React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import GuideModal from "./GuideModal";

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const [guideOpen, setGuideOpen] = React.useState(false);
  
  return (
    <>
      <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary dark:text-white"
                : "text-muted-foreground"
            )
          }
        >
          ראשי
        </NavLink>
        <NavLink
          to="/assets"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary dark:text-white"
                : "text-muted-foreground"
            )
          }
        >
          נכסים
        </NavLink>
        <NavLink
          to="/market-news"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary dark:text-white"
                : "text-muted-foreground"
            )
          }
        >
          חדשות שוק
        </NavLink>
        <NavLink
          to="/trading-signals"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary dark:text-white"
                : "text-muted-foreground"
            )
          }
        >
          איתותי מסחר
        </NavLink>
        <NavLink
          to="/trading-view"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary dark:text-white"
                : "text-muted-foreground"
            )
          }
        >
          TradingView
        </NavLink>
        <NavLink
          to="/binance-integration"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary dark:text-white"
                : "text-muted-foreground"
            )
          }
        >
          בינאנס
        </NavLink>
        <NavLink
          to="/backtesting"
          className={({ isActive }) =>
            cn(
              "text-sm font-medium transition-colors hover:text-primary",
              isActive
                ? "text-primary dark:text-white"
                : "text-muted-foreground"
            )
          }
        >
          בקטסט
        </NavLink>
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center justify-center h-8 w-8 p-0 rounded-full"
          onClick={() => setGuideOpen(true)}
        >
          <QuestionMarkCircledIcon className="h-5 w-5" />
          <span className="sr-only">מדריך התחברות</span>
        </Button>
      </nav>
      
      <GuideModal open={guideOpen} onOpenChange={setGuideOpen} />
    </>
  );
}
