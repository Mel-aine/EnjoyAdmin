/**
 * Date utility functions for formatting dates with internationalization support
 */

/**
 * Format a date to display day number and month abbreviation
 * @param date - The date to format
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Object with day number and month abbreviation
 */
export function formatDateDisplay(date: Date, locale: string = 'en-US'): { day: string; month: string; weekday: string} {
  const day = date.getDate().toString().padStart(2, '0');
  
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
  const month = monthFormatter.format(date).toUpperCase();
  const weekday = date.toLocaleString(locale, { weekday: 'short' }).toUpperCase();
  
  return {
    day,
    month,
    weekday
  };
}

/**
 * Format a date to display day number and month abbreviation as strings
 * @param date - The date to format
 * @param locale - The locale for formatting (default: 'en-US')
 * @returns Object with formatted day and month strings
 */
export function getDateParts(date: Date, locale: string = 'en-US'): { dayText: string; monthText: string } {
  const { day, month } = formatDateDisplay(date, locale);
  
  return {
    dayText: day,
    monthText: month
  };
}

/**
 * Get month abbreviation in specified language
 * @param date - The date to get month from
 * @param locale - The locale for formatting
 * @returns Month abbreviation in uppercase
 */
export function getMonthAbbreviation(date: Date, locale: string = 'en-US'): string {
  const monthFormatter = new Intl.DateTimeFormat(locale, { month: 'short' });
  return monthFormatter.format(date).toUpperCase();
}

/**
 * Get day of month as zero-padded string
 * @param date - The date to get day from
 * @returns Day of month as zero-padded string (e.g., '02', '15')
 */
export function getDayOfMonth(date: Date): string {
  return date.getDate().toString().padStart(2, '0');
}

/**
 * Example usage:
 * const date = new Date('2024-08-02');
 * const { day, month } = formatDateDisplay(date, 'en-US');
 * // day: '02', month: 'AUG'
 * 
 * const { dayText, monthText } = getDateParts(date, 'fr-FR');
 * // dayText: '02', monthText: 'AOÛT'
 */