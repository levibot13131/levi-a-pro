
import React from 'react';

export type TimeframeType = '1m' | '3m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d' | '1w' | '1M' | '1y' | 'all';

export const timeframeOptions = [
  { value: '5m', label: '5 דקות' },
  { value: '15m', label: '15 דקות' },
  { value: '1h', label: 'שעה' },
  { value: '4h', label: '4 שעות' },
  { value: '1d', label: 'יומי' },
  { value: '1w', label: 'שבועי' },
];

// טווחי זמן מורחבים עבור הדשבורד וגרפים אחרים
export const extendedTimeframeOptions = [
  { value: '1m', label: 'דקה' },
  { value: '3m', label: '3 דקות' },
  { value: '5m', label: '5 דקות' },
  { value: '15m', label: '15 דקות' },
  { value: '30m', label: '30 דקות' },
  { value: '1h', label: 'שעה' },
  { value: '4h', label: '4 שעות' },
  { value: '1d', label: 'יומי' },
  { value: '1w', label: 'שבועי' },
  { value: '1M', label: 'חודשי' },
  { value: '1y', label: 'שנתי' },
  { value: 'all', label: 'הכל' },
];

export default timeframeOptions;
