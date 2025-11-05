const SETTINGS_KEY = 'immocalc_settings';

// Default Settings für Schweizer Immobilien
export const DEFAULT_SETTINGS = {
  // Nebenkosten
  nebenkostenProzent: 7.5,
  
  // Finanzierung
  eigenkapitalProzent: 25,
  zinssatz: 2.5,
  tilgung: 1.0,
  
  // Kosten
  laufendeKostenProzent: 1.2,
  verwaltungProzent: 4.0, // Prozent der Jahresmiete
  ruecklagenProzent: 0.8,
  leerstandProzent: 2.0,
  
  // Steuern
  steuersatz: 30,
  abschreibungProzent: 2.5,
  abschreibungJahre: 40,
  
  // Mietberechnung
  bruttorenditeProzent: 4.5, // Zur Schätzung der Miete
  
  // Auto-Fill aktiviert
  autoFillEnabled: true
};

/**
 * Lädt Settings aus localStorage
 */
export const loadSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Fehler beim Laden der Settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Speichert Settings in localStorage
 */
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Fehler beim Speichern der Settings:', error);
    return false;
  }
};

/**
 * Setzt Settings auf Default zurück
 */
export const resetSettings = () => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.error('Fehler beim Zurücksetzen der Settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Berechnet Auto-Fill Werte basierend auf Kaufpreis und Settings
 */
export const calculateAutoFillValues = (kaufpreis, settings = DEFAULT_SETTINGS) => {
  const preis = parseFloat(kaufpreis) || 0;
  
  if (preis === 0) {
    return {};
  }
  
  // Nebenkosten berechnen
  const nebenkosten = (preis * settings.nebenkostenProzent / 100).toFixed(0);
  
  // Eigenkapital berechnen
  const eigenkapital = (preis * settings.eigenkapitalProzent / 100).toFixed(0);
  
  // Geschätzte Jahresmiete basierend auf Bruttorendite
  const jahresmiete = (preis * settings.bruttorenditeProzent / 100).toFixed(0);
  
  // Monatliche Bruttomiete
  const monatlicheBruttomiete = (parseFloat(jahresmiete) / 12).toFixed(0);
  
  // Laufende Kosten
  const laufendeKosten = (preis * settings.laufendeKostenProzent / 100).toFixed(0);
  
  // Verwaltung (basierend auf Jahresmiete)
  const verwaltung = (parseFloat(jahresmiete) * settings.verwaltungProzent / 100).toFixed(0);
  
  // Rücklagen
  const ruecklagen = (preis * settings.ruecklagenProzent / 100).toFixed(0);
  
  return {
    nebenkosten,
    eigenkapital,
    zinssatz: settings.zinssatz.toString(),
    tilgung: settings.tilgung.toString(),
    jahresmiete,
    monatlicheBruttomiete,
    laufendeKosten,
    verwaltung,
    ruecklagen,
    leerstand: settings.leerstandProzent.toString(),
    steuersatz: settings.steuersatz.toString(),
    abschreibungProzent: settings.abschreibungProzent.toString(),
    abschreibungJahre: settings.abschreibungJahre.toString()
  };
};

/**
 * Berechnet Beispielwerte für Preview in Settings
 */
export const calculatePreviewValues = (kaufpreis, settings) => {
  const werte = calculateAutoFillValues(kaufpreis, settings);
  
  return {
    kaufpreis: parseFloat(kaufpreis),
    ...werte,
    // Berechne auch Kennzahlen für Preview
    gesamtinvestition: parseFloat(kaufpreis) + parseFloat(werte.nebenkosten || 0),
    fremdkapital: parseFloat(kaufpreis) - parseFloat(werte.eigenkapital || 0),
    zinskosten: ((parseFloat(kaufpreis) - parseFloat(werte.eigenkapital || 0)) * parseFloat(settings.zinssatz) / 100).toFixed(0)
  };
};