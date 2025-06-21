
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useHebrew } from '@/hooks/use-hebrew';

interface MainNavProps {
  className?: string;
}

export function MainNav({ className }: MainNavProps) {
  const location = useLocation();
  const { isHebrew } = useHebrew();

  const navItems = [
    { href: '/dashboard', label: isHebrew ? 'דשבורד' : 'Dashboard' },
    { href: '/technical-analysis', label: isHebrew ? 'ניתוח טכני' : 'Technical Analysis' },
    { href: '/fundamental-data', label: isHebrew ? 'נתונים פונדמנטליים' : 'Fundamental Data' },
    { href: '/market-sentiment', label: isHebrew ? 'סנטימנט שוק' : 'Market Sentiment' },
    { href: '/charts-analysis', label: isHebrew ? 'ניתוח גרפים' : 'Charts Analysis' },
    { href: '/trading-engine', label: isHebrew ? 'מנוע מסחר' : 'Trading Engine' },
  ];

  return (
    <nav className={cn('flex items-center space-x-4 lg:space-x-6', className)}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            location.pathname === item.href
              ? 'text-primary'
              : 'text-muted-foreground'
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
