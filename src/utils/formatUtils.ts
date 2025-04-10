
/**
 * Formats price values for display based on their magnitude
 */
export const formatPrice = (price: number): string => {
  return price < 1 
    ? price.toFixed(6) 
    : price < 1000 
      ? price.toFixed(2) 
      : price.toLocaleString(undefined, { maximumFractionDigits: 2 });
};

/**
 * Formats date for display based on timeframe
 */
export const formatDate = (timestamp: number, locale: string = 'he-IL'): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(locale, { 
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Formats time for display
 */
export const formatTime = (timestamp: number, locale: string = 'he-IL'): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString(locale, { 
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats datetime for display
 */
export const formatDateTime = (timestamp: number, locale: string = 'he-IL'): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString(locale, { 
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats percentage for display with coloring
 */
export const getPercentageColor = (value: number): string => {
  if (value > 0) return 'text-green-500';
  if (value < 0) return 'text-red-500';
  return 'text-gray-500';
};

/**
 * Formats percentage for display
 */
export const formatPercentage = (value: number): string => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};
