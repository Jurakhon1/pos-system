/**
 * Decimal formatting utilities for monetary values
 * Ensures all monetary values are properly formatted as decimals for API compatibility
 */

/**
 * Forces a number to have decimal representation (e.g., 252 becomes 252.00)
 * This is critical for API validation that expects decimal format
 */
export const forceDecimal = (amount: number): number => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 0.00;
  }
  
  // Convert to string with 2 decimal places, then back to number
  // This ensures we always have decimal representation
  return parseFloat(amount.toFixed(2));
};

/**
 * Formats a number as a decimal string with 2 decimal places
 */
export const formatAsDecimalString = (amount: number): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00';
  }
  
  return amount.toFixed(2);
};

/**
 * Ensures all monetary values in an object are properly formatted as decimals
 */
export const ensureDecimalFormat = (data: any): any => {
  if (data === null || data === undefined) return data;
  
  if (typeof data === 'number') {
    return forceDecimal(data);
  }
  
  if (Array.isArray(data)) {
    return data.map(item => ensureDecimalFormat(item));
  }
  
  if (typeof data === 'object') {
    const formatted: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Check if this field should be formatted as decimal (monetary fields)
      if (key.toLowerCase().includes('amount') || 
          key.toLowerCase().includes('price') || 
          key.toLowerCase().includes('total') ||
          key.toLowerCase().includes('cost') ||
          key.toLowerCase().includes('sum')) {
        if (typeof value === 'number') {
          formatted[key] = forceDecimal(value);
        } else {
          formatted[key] = value;
        }
      } else {
        formatted[key] = ensureDecimalFormat(value);
      }
    }
    return formatted;
  }
  
  return data;
};

/**
 * Validates if a number has proper decimal format
 */
export const isValidDecimal = (amount: number): boolean => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return false;
  }
  
  // Check if the number has decimal places
  const decimalString = amount.toString();
  return decimalString.includes('.') && decimalString.split('.')[1].length === 2;
};

/**
 * Formats monetary values for display
 */
export const formatMoney = (amount: number): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '0.00';
  }
  
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Parses a string input and ensures it's formatted as a decimal number
 */
export const parseAndFormatDecimal = (input: string): number => {
  const numValue = parseFloat(input) || 0;
  return forceDecimal(numValue);
};
