import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (secondsAgo < 60) {
    return 'לפני פחות מדקה';
  } else if (secondsAgo < 3600) {
    const minutesAgo = Math.floor(secondsAgo / 60);
    return `לפני ${minutesAgo} ${minutesAgo === 1 ? 'דקה' : 'דקות'}`;
  } else if (secondsAgo < 86400) {
    const hoursAgo = Math.floor(secondsAgo / 3600);
    return `לפני ${hoursAgo} ${hoursAgo === 1 ? 'שעה' : 'שעות'}`;
  } else if (secondsAgo < 2592000) {
    const daysAgo = Math.floor(secondsAgo / 86400);
    return `לפני ${daysAgo} ${daysAgo === 1 ? 'יום' : 'ימים'}`;
  } else if (secondsAgo < 31536000) {
    const monthsAgo = Math.floor(secondsAgo / 2592000);
    return `לפני ${monthsAgo} ${monthsAgo === 1 ? 'חודש' : 'חודשים'}`;
  } else {
    const yearsAgo = Math.floor(secondsAgo / 31536000);
    return `לפני ${yearsAgo} ${yearsAgo === 1 ? 'שנה' : 'שנים'}`;
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatNumber(num: number, decimals: number = 2): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(decimals) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(decimals) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(decimals) + 'K';
  } else {
    return num.toFixed(decimals);
  }
}

export function formatPrice(price: number): string {
  return price < 1 
    ? price.toFixed(6) 
    : price < 1000 
      ? price.toFixed(2) 
      : price.toLocaleString(undefined, { maximumFractionDigits: 2 });
}
