/**
 * Formatiert einen Wert als Schweizer Franken
 * @param {number} value - Der zu formatierende Wert
 * @returns {string} - Formatierter Währungswert
 */
export const formatCurrency = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'CHF 0.00';
  }
  
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
};

/**
 * Formatiert einen Wert als Schweizer Franken (kompakt, ohne Nachkommastellen)
 * @param {number} value - Der zu formatierende Wert
 * @returns {string} - Formatierter Währungswert
 */
export const formatCurrencyCompact = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'CHF 0';
  }
  
  return new Intl.NumberFormat('de-CH', {
    style: 'currency',
    currency: 'CHF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

/**
 * Formatiert einen Wert als Prozent
 * @param {number} value - Der zu formatierende Wert
 * @param {number} decimals - Anzahl Nachkommastellen (Standard: 2)
 * @returns {string} - Formatierter Prozentwert
 */
export const formatPercent = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.00%';
  }
  
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatiert eine Zahl mit Tausendertrennzeichen
 * @param {number} value - Der zu formatierende Wert
 * @returns {string} - Formatierte Zahl
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }
  
  return new Intl.NumberFormat('de-CH').format(value);
};

/**
 * Formatiert ein Datum im Schweizer Format
 * @param {string|Date} date - Das zu formatierende Datum
 * @returns {string} - Formatiertes Datum
 */
export const formatDate = (date) => {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('de-CH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(dateObj);
};

/**
 * Parst einen String zu einer Zahl
 * @param {string|number} value - Der zu parsende Wert
 * @returns {number} - Geparste Zahl oder 0
 */
export const parseNumber = (value) => {
  if (typeof value === 'number') return value;
  if (!value) return 0;
  
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Formatiert eine Kennzahl mit entsprechendem Icon/Indikator
 * @param {number} value - Der Wert
 * @param {string} type - Art der Kennzahl ('currency', 'percent', 'number')
 * @returns {object} - Formatierter Wert mit Styling-Info
 */
export const formatKennzahl = (value, type = 'currency') => {
  let formatted;
  let color = 'text-gray-300';
  
  switch (type) {
    case 'currency':
      formatted = formatCurrency(value);
      color = value >= 0 ? 'text-green-400' : 'text-red-400';
      break;
    case 'percent':
      formatted = formatPercent(value);
      color = value >= 0 ? 'text-green-400' : 'text-red-400';
      break;
    case 'number':
      formatted = formatNumber(value);
      color = value >= 0 ? 'text-green-400' : 'text-red-400';
      break;
    default:
      formatted = String(value);
  }
  
  return {
    value: formatted,
    color,
    isPositive: value >= 0
  };
};