
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ניתן להוסיף את פונקציית formatPrice כאן:
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
