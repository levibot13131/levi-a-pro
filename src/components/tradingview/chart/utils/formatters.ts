
export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('he-IL', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatPrice = (price: number) => {
  if (price >= 1000) {
    return `$${price.toLocaleString()}`;
  }
  return `$${price.toFixed(2)}`;
};

