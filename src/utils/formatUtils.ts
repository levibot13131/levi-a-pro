
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
