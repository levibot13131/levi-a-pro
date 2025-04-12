
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number as currency
 * @param value - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, decimals: number = 2): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(decimals)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(decimals)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(decimals)}K`;
  }
  return `$${value.toFixed(decimals)}`;
}

/**
 * Format a number as percentage
 * @param value - Number to format
 * @returns Formatted percentage string
 */
export function formatPercentage(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

/**
 * Format a date as a relative time (e.g., "3 hours ago")
 * @param date - Date to format
 * @returns Formatted relative time string
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'לפני פחות מדקה';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `לפני ${diffInMinutes} דקות`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `לפני ${diffInHours} שעות`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `לפני ${diffInDays} ימים`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `לפני ${diffInMonths} חודשים`;
  }
  
  const diffInYears = Math.floor(diffInMonths / 12);
  return `לפני ${diffInYears} שנים`;
}

/**
 * Format time ago for news and social posts
 * @param dateString - ISO date string
 * @returns Formatted time ago string
 */
export function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  return formatRelativeTime(date);
}

/**
 * Generate a random color hex code
 * @returns Random color hex code
 */
export function randomColor(): string {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

/**
 * Safely parse JSON with a fallback value
 * @param value - Value to parse
 * @param fallback - Fallback value if parsing fails
 * @returns Parsed JSON or fallback
 */
export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    return fallback;
  }
}

/**
 * Truncate text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param length - Maximum length
 * @returns Truncated text
 */
export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
}

/**
 * Format a price number with currency symbol
 * @param price - Price to format
 * @returns Formatted price string
 */
export function formatPrice(price: number): string {
  return `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

/**
 * Get color class based on percentage value
 * @param value - Percentage value
 * @returns CSS color class
 */
export function getPercentageColor(value: number): string {
  if (value > 0) return 'text-green-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
}
