/**
 * Converts a date string from 'DD/MM/YY' to 'DDD, DD MMM YYYY'
 * Example: '01/05/25' => 'Thu, 01 May 2025'
 * @param {string} dateStr
 * @returns {string}
 */
export function formatDateToLong(dateStr) {
  if (!dateStr) return '';
  const [day, month, year] = dateStr.split('/');
  // Convert to full year (assume 20xx for 2-digit years)
  const fullYear = year.length === 2 ? 2000 + parseInt(year, 10) : parseInt(year, 10);
  // JS months are 0-based
  const dateObj = new Date(fullYear, parseInt(month, 10) - 1, parseInt(day, 10));
  // Format: DDD, DD MMM YYYY
  return dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}