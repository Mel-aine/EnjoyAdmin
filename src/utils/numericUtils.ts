/**
 * Utility functions for safe numeric conversion and validation of monetary amounts
 * Prevents string concatenation issues in folio calculations
 */

/**
 * Safely converts a value to a number, handling various input types
 * @param value - The value to convert (string, number, null, undefined)
 * @param defaultValue - Default value to return if conversion fails (default: 0)
 * @returns A valid number
 */
export function safeParseFloat(value: any, defaultValue: number = 0): number {
  // Handle null, undefined, or empty string
  if (value === null || value === undefined || value === '') {
    return defaultValue
  }

  // If already a number, return it (but check for NaN)
  if (typeof value === 'number') {
    return isNaN(value) ? defaultValue : value
  }

  // Convert string to number
  if (typeof value === 'string') {
    // Remove any non-numeric characters except decimal point and minus sign
    const cleanedValue = value.replace(/[^\d.-]/g, '')
    const parsed = parseFloat(cleanedValue)
    return isNaN(parsed) ? defaultValue : parsed
  }

  // For any other type, try to convert to string first, then to number
  const stringValue = String(value)
  const parsed = parseFloat(stringValue)
  return isNaN(parsed) ? defaultValue : parsed
}

/**
 * Safely converts a value to an integer
 * @param value - The value to convert
 * @param defaultValue - Default value to return if conversion fails (default: 0)
 * @returns A valid integer
 */
export function safeParseInt(value: any, defaultValue: number = 0): number {
  const floatValue = safeParseFloat(value, defaultValue)
  return Math.floor(floatValue)
}

/**
 * Validates if a value is a valid monetary amount
 * @param value - The value to validate
 * @returns True if valid monetary amount, false otherwise
 */
export function isValidMonetaryAmount(value: any): boolean {
  const parsed = safeParseFloat(value)
  return !isNaN(parsed) && isFinite(parsed) && parsed >= 0
}

/**
 * Calculates the sum of multiple monetary values safely
 * @param values - Array of values to sum
 * @returns The sum as a number
 */
export function safeSum(...values: any[]): number {
  return values.reduce((sum, value) => {
    return sum + safeParseFloat(value, 0)
  }, 0)
}

/**
 * Calculates the difference between two monetary values safely
 * @param minuend - The value to subtract from
 * @param subtrahend - The value to subtract
 * @returns The difference as a number
 */
export function safeDifference(minuend: any, subtrahend: any): number {
  return safeParseFloat(minuend, 0) - safeParseFloat(subtrahend, 0)
}

/**
 * Multiplies two values safely
 * @param multiplicand - The first value
 * @param multiplier - The second value
 * @returns The product as a number
 */
export function safeMultiply(multiplicand: any, multiplier: any): number {
  return safeParseFloat(multiplicand, 0) * safeParseFloat(multiplier, 0)
}

/**
 * Divides two values safely, avoiding division by zero
 * @param dividend - The value to divide
 * @param divisor - The value to divide by
 * @param defaultValue - Default value if division by zero (default: 0)
 * @returns The quotient as a number
 */
export function safeDivide(dividend: any, divisor: any, defaultValue: number = 0): number {
  const divisorNum = safeParseFloat(divisor, 0)
  if (divisorNum === 0) {
    return defaultValue
  }
  return safeParseFloat(dividend, 0) / divisorNum
}

/**
 * Formats a number as currency with proper decimal places
 * @param value - The value to format
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted number string
 */
export function formatCurrency(value: any, decimals: number = 0): string {
  const numValue = safeParseFloat(value, 0)
  return numValue.toFixed(decimals)
}

/**
 * Ensures a folio transaction amount is properly formatted for API submission
 * @param amount - The amount value
 * @returns Properly formatted numeric amount
 */
export function prepareFolioAmount(amount: any): number {
  const numericAmount = safeParseFloat(amount, 0)
  // Round to 2 decimal places to avoid floating point precision issues
  return Math.round(numericAmount * 100) / 100
}

/**
 * Validates and prepares folio totals to prevent string concatenation
 * @param totals - Object containing total amounts
 * @returns Object with properly converted numeric totals
 */
export function prepareFolioTotals(totals: {
  total_charges?: any
  total_payments?: any
  total_adjustments?: any
  total_taxes?: any
  total_service_charges?: any
  total_discounts?: any
  balance?: any
}): {
  total_charges: number
  total_payments: number
  total_adjustments: number
  total_taxes: number
  total_service_charges: number
  total_discounts: number
  balance: number
} {
  return {
    total_charges: prepareFolioAmount(totals.total_charges),
    total_payments: prepareFolioAmount(totals.total_payments),
    total_adjustments: prepareFolioAmount(totals.total_adjustments),
    total_taxes: prepareFolioAmount(totals.total_taxes),
    total_service_charges: prepareFolioAmount(totals.total_service_charges),
    total_discounts: prepareFolioAmount(totals.total_discounts),
    balance: prepareFolioAmount(totals.balance)
  }
}