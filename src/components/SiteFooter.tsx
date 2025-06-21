
import React from 'react';
import { useHebrew } from '@/hooks/use-hebrew';

export function SiteFooter() {
  const { isHebrew } = useHebrew();

  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          {isHebrew 
            ? 'LeviPro Elite Trading System © 2024. כל הזכויות שמורות.'
            : 'LeviPro Elite Trading System © 2024. All rights reserved.'
          }
        </p>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">
            {isHebrew ? 'גרסה 1.0' : 'Version 1.0'}
          </span>
        </div>
      </div>
    </footer>
  );
}
