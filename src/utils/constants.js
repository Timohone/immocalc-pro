// Storage Keys
export const STORAGE_PREFIX = 'immobilie:';

// Default Werte für neue Immobilien
export const DEFAULT_IMMOBILIE = {
  name: '',
  adresse: '',
  kaufpreis: '',
  nebenkosten: '',
  eigenkapital: '',
  zinssatz: '',
  jahresmiete: '',
  monatlicheBruttomiete: '',
  laufendeKosten: '',
  verwaltung: '',
  ruecklagen: '',
  leerstand: '',
  tilgung: '',
  // STEUERLICHE FELDER
  steuersatz: '',
  abschreibungProzent: '2.5',
  abschreibungJahre: '40',
  notizen: '',
  tags: [],
  // IMMOBILIEN DETAILS
  anzahlZimmer: '',
  quadratmeter: '',
  strasse: '',
  plz: '',
  ort: '',
  typ: '',
  stockwerk: '',
  baujahr: '',
  parkplaetze: '',
  balkon: false,
  garten: false,
  lift: false,
  keller: false,
  renovation: ''
};

// Immobilien Typen
export const IMMOBILIEN_TYPEN = [
  'Wohnung',
  'Einfamilienhaus',
  'Mehrfamilienhaus',
  'Reihenhaus',
  'Doppelhaushälfte',
  'Studio',
  'Loft',
  'Maisonette',
  'Penthouse',
  'Gewerbe',
  'Büro',
  'Sonstiges'
];

// Typische Prozentwerte für Schweizer Immobilien
export const TYPICAL_VALUES = {
  nebenkosten: 7.5,
  eigenkapital: 20,
  zinssatz: 2.5,
  leerstand: 2.0,
  verwaltung: 3.0,
  ruecklagen: 0.8,
  tilgung: 1.0,
  steuersatz: 30,
  abschreibung: 2.5
};

// Kennzahlen-Schwellwerte für Bewertung
export const KENNZAHLEN_SCHWELLWERTE = {
  bruttoMietrendite: {
    schlecht: 3.0,
    mittel: 4.5,
    gut: 6.0
  },
  nettoMietrendite: {
    schlecht: 2.0,
    mittel: 3.0,
    gut: 4.5
  },
  eigenkapitalrendite: {
    schlecht: 3.0,
    mittel: 6.0,
    gut: 10.0
  },
  eigenkapitalrenditeNachSteuern: {
    schlecht: 2.5,
    mittel: 5.0,
    gut: 8.0
  },
  dscr: {
    kritisch: 1.0,
    grenzwertig: 1.2,
    gut: 1.5
  }
};

// Tabs
export const TABS = {
  DASHBOARD: 'dashboard',
  SIMULATION: 'simulation',
  SZENARIEN: 'szenarien',
  VERGLEICH: 'vergleich'
};

// Form Validierung Messages
export const VALIDATION_MESSAGES = {
  required: 'Dieses Feld ist erforderlich',
  positive: 'Der Wert muss positiv sein',
  percentage: 'Der Wert muss zwischen 0 und 100 liegen',
  number: 'Bitte gib eine gültige Zahl ein'
};

// Chart Farben
export const CHART_COLORS = {
  primary: '#3b82f6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#06b6d4',
  secondary: '#6366f1',
  purple: '#a855f7',
  pink: '#ec4899'
};

// Kennzahlen Labels
export const KENNZAHLEN_LABELS = {
  anschaffungskosten: 'Anschaffungskosten',
  fremdkapital: 'Fremdkapital',
  zinskosten: 'Zinskosten p.a.',
  jahresNettoMiete: 'Jahres-Nettomiete',
  cashflow: 'Cashflow p.a.',
  cashflowMonatlich: 'Cashflow monatlich',
  bruttoMietrendite: 'Brutto-Mietrendite',
  nettoMietrendite: 'Netto-Mietrendite',
  eigenkapitalrendite: 'Eigenkapitalrendite',
  tilgungsBetrag: 'Tilgung p.a.',
  gesamtRendite: 'Gesamtrendite (inkl. Tilgung)',
  dscr: 'Debt Service Coverage Ratio (DSCR)',
  // NEUE LABELS
  abschreibungsBetrag: 'Abschreibung p.a.',
  steuerlichesErgebnis: 'Steuerliches Ergebnis',
  steuerlast: 'Steuerlast p.a.',
  cashflowNachSteuern: 'Cashflow nach Steuern',
  eigenkapitalrenditeNachSteuern: 'EK-Rendite nach Steuern'
};

// Szenario Templates
export const SZENARIO_TEMPLATES = {
  ZINSANSTIEG: {
    name: 'Zinsanstieg',
    beschreibung: 'Was passiert bei steigenden Zinsen?',
    parameter: { zinssatz: '+2' }
  },
  MIETRUECKGANG: {
    name: 'Mietrückgang',
    beschreibung: 'Auswirkung bei sinkenden Mieten',
    parameter: { jahresmiete: '-10%' }
  },
  OPTIMISTISCH: {
    name: 'Optimistisches Szenario',
    beschreibung: 'Best-Case: Höhere Mieten, niedrigere Kosten',
    parameter: { jahresmiete: '+10%', laufendeKosten: '-20%' }
  },
  PESSIMISTISCH: {
    name: 'Pessimistisches Szenario',
    beschreibung: 'Worst-Case: Niedrigere Mieten, höhere Kosten',
    parameter: { jahresmiete: '-10%', laufendeKosten: '+20%', zinssatz: '+1' }
  }
};