
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

/**
 * Formats numbers with K, M, B suffixes
 */
export const formatCompactNumber = (num: number): string => {
  if (num < 1000) return num.toString();
  
  const exp = Math.floor(Math.log10(num) / 3);
  const value = num / Math.pow(1000, exp);
  const suffix = ['', 'K', 'M', 'B', 'T'][exp];
  
  return `${value.toFixed(1)}${suffix}`;
};

/**
 * Formats duration into readable time
 */
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}מ'`;
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) return `${hours}ש'`;
  return `${hours}ש' ${remainingMinutes}מ'`;
};

/**
 * Formats risk-reward ratio
 */
export const formatRiskReward = (ratio: number): string => {
  return `1:${ratio.toFixed(1)}`;
};

/**
 * Gets class name for win rate display
 */
export const getWinRateColorClass = (winRate: number): string => {
  if (winRate >= 70) return 'text-green-500';
  if (winRate >= 50) return 'text-yellow-500';
  return 'text-red-500';
};

/**
 * Gets class name for profit factor display
 */
export const getProfitFactorColorClass = (profitFactor: number): string => {
  if (profitFactor >= 2) return 'text-green-500';
  if (profitFactor >= 1.5) return 'text-emerald-500';
  if (profitFactor >= 1) return 'text-yellow-500';
  return 'text-red-500';
};

/**
 * Formats date range for display
 */
export const formatDateRange = (startDate: string, endDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return `${start.toLocaleDateString('he-IL')} - ${end.toLocaleDateString('he-IL')}`;
};
