import { VALIDATION_MESSAGES } from './constants';

/**
 * Validiert ob ein Wert vorhanden ist
 * @param {any} value - Der zu validierende Wert
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateRequired = (value) => {
  const isValid = value !== null && value !== undefined && value !== '';
  return {
    valid: isValid,
    message: isValid ? '' : VALIDATION_MESSAGES.required
  };
};

/**
 * Validiert ob ein Wert eine gültige Zahl ist
 * @param {any} value - Der zu validierende Wert
 * @returns {object} - { valid: boolean, message: string }
 */
export const validateNumber = (value) => {
  if (value === '' || value === null || value === undefined) {
    return { valid: true, message: '' };
  }
  
  const num = parseFloat(value);
  const isValid = !isNaN(num);
  
  return {
    valid: isValid,
    message: isValid ? '' : VALIDATION_MESSAGES.number
  };
};

/**
 * Validiert ob ein Wert eine positive Zahl ist
 * @param {any} value - Der zu validierende Wert
 * @returns {object} - { valid: boolean, message: string }
 */
export const validatePositive = (value) => {
  if (value === '' || value === null || value === undefined) {
    return { valid: true, message: '' };
  }
  
  const num = parseFloat(value);
  const isValid = !isNaN(num) && num >= 0;
  
  return {
    valid: isValid,
    message: isValid ? '' : VALIDATION_MESSAGES.positive
  };
};

/**
 * Validiert ob ein Wert ein gültiger Prozentsatz ist (0-100)
 * @param {any} value - Der zu validierende Wert
 * @returns {object} - { valid: boolean, message: string }
 */
export const validatePercentage = (value) => {
  if (value === '' || value === null || value === undefined) {
    return { valid: true, message: '' };
  }
  
  const num = parseFloat(value);
  const isValid = !isNaN(num) && num >= 0 && num <= 100;
  
  return {
    valid: isValid,
    message: isValid ? '' : VALIDATION_MESSAGES.percentage
  };
};

/**
 * Validiert ein Immobilien-Formular
 * @param {object} formData - Die Formulardaten
 * @returns {object} - { valid: boolean, errors: object }
 */
export const validateImmobilieForm = (formData) => {
  const errors = {};
  
  // Name ist Pflichtfeld
  if (!formData.name || formData.name.trim() === '') {
    errors.name = VALIDATION_MESSAGES.required;
  }
  
  // Kaufpreis validieren
  const kaufpreisValidation = validatePositive(formData.kaufpreis);
  if (!kaufpreisValidation.valid) {
    errors.kaufpreis = kaufpreisValidation.message;
  }
  
  // Prozentwerte validieren
  const percentageFields = ['zinssatz', 'leerstand', 'tilgung'];
  percentageFields.forEach(field => {
    if (formData[field]) {
      const validation = validatePercentage(formData[field]);
      if (!validation.valid) {
        errors[field] = validation.message;
      }
    }
  });
  
  // Positive Zahlen validieren
  const positiveFields = [
    'nebenkosten', 'eigenkapital', 'jahresmiete', 
    'monatlicheBruttomiete', 'laufendeKosten', 
    'verwaltung', 'ruecklagen'
  ];
  
  positiveFields.forEach(field => {
    if (formData[field]) {
      const validation = validatePositive(formData[field]);
      if (!validation.valid) {
        errors[field] = validation.message;
      }
    }
  });
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Bereinigt Formular-Input (entfernt Leerzeichen, etc.)
 * @param {string} value - Der zu bereinigende Wert
 * @returns {string} - Bereinigter Wert
 */
export const sanitizeInput = (value) => {
  if (typeof value !== 'string') return value;
  return value.trim();
};

/**
 * Prüft ob eine Immobilie vollständige Daten hat
 * @param {object} immobilie - Die zu prüfende Immobilie
 * @returns {boolean} - true wenn vollständig
 */
export const isCompleteImmobilie = (immobilie) => {
  const requiredFields = [
    'name', 'kaufpreis', 'eigenkapital', 
    'zinssatz', 'jahresmiete'
  ];
  
  return requiredFields.every(field => {
    const value = immobilie[field];
    return value !== null && value !== undefined && value !== '';
  });
};