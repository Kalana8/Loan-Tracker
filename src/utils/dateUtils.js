export function formatDate(date) {
  if (!date) return 'N/A';
  try {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Invalid Date';
    return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  } catch (error) {
    return 'Invalid Date';
  }
}

export function addMonths(date, months) {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

export function isOverdue(date) {
  return new Date(date) < new Date();
}

export function getDaysUntilDue(dueDate) {
  if (!dueDate) return null;
  try {
  const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    if (isNaN(due.getTime())) return null;
    
    const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
  } catch (error) {
    return null;
  }
}

export function getNextMonthDate(date) {
  if (!date) return null;
  try {
    const currentDate = new Date(date);
    if (isNaN(currentDate.getTime())) return null;
    
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth.toISOString().split('T')[0];
  } catch (error) {
    return null;
  }
}
