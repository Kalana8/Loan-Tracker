export function formatCurrency(amount) {
  return new Intl.NumberFormat('si-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
}

export function formatCurrencyCompact(amount) {
  return new Intl.NumberFormat('si-LK', {
    style: 'currency',
    currency: 'LKR',
    notation: 'compact',
    maximumFractionDigits: 1
  }).format(amount);
} 