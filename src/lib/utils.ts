
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Add formatPrice function
export const formatPrice = (price: number): string => {
  if (price < 0.01) {
    return price.toFixed(8);
  } else if (price < 1) {
    return price.toFixed(6);
  } else if (price < 1000) {
    return price.toFixed(2);
  } else {
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
};

// Add formatCurrency utility
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2
  }).format(amount);
};

// Add formatTimeAgo utility
export const formatTimeAgo = (date: Date | string | number): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'לפני פחות מדקה';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `לפני ${minutes} דקות`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `לפני ${hours} שעות`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `לפני ${days} ימים`;
  }
};
