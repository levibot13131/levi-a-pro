
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const seconds = Math.floor((now - timestamp) / 1000);

  if (seconds < 60) {
    return 'עכשיו';
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `לפני ${minutes} דקות`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `לפני ${hours} שעות`;
  }

  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `לפני ${days} ימים`;
  }

  const months = Math.floor(days / 30);
  if (months < 12) {
    return `לפני ${months} חודשים`;
  }

  const years = Math.floor(months / 12);
  return `לפני ${years} שנים`;
}

export const formatCurrency = (value: number, currency = 'USD', locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatNumber = (value: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value);
};

export const formatPercent = (value: number, locale = 'en-US'): string => {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Add formatPrice function
export const formatPrice = (price: number): string => {
  if (price < 1) {
    return price.toFixed(6);
  } else if (price < 1000) {
    return price.toFixed(2);
  } else {
    return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  }
};
