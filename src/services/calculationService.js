import { parseNumber } from '../utils/formatters';

/**
 * Berechnet alle Kennzahlen für eine Immobilie (ERWEITERT)
 */
export const berechneKennzahlen = (immobilie) => {
  // Basis Input Werte
  const kaufpreis = parseNumber(immobilie.kaufpreis);
  const nebenkosten = parseNumber(immobilie.nebenkosten);
  const eigenkapital = parseNumber(immobilie.eigenkapital);
  const zinssatz = parseNumber(immobilie.zinssatz);
  const jahresmiete = parseNumber(immobilie.jahresmiete);
  const laufendeKosten = parseNumber(immobilie.laufendeKosten);
  const verwaltung = parseNumber(immobilie.verwaltung);
  const ruecklagen = parseNumber(immobilie.ruecklagen);
  const leerstand = parseNumber(immobilie.leerstand);
  const tilgung = parseNumber(immobilie.tilgung);

  // Steuer Parameter
  const steuersatz = parseNumber(immobilie.steuersatz) || 0;
  const abschreibungProzent = parseNumber(immobilie.abschreibungProzent) || 2.5;
  const abschreibungJahre = parseNumber(immobilie.abschreibungJahre) || 40;

  // Basis-Berechnungen
  const anschaffungskosten = kaufpreis + nebenkosten;
  const fremdkapital = anschaffungskosten - eigenkapital;
  const zinskosten = (fremdkapital * zinssatz) / 100;
  
  const leerstandsVerlust = (jahresmiete * leerstand) / 100;
  const jahresNettoMiete = jahresmiete - laufendeKosten - verwaltung - ruecklagen - leerstandsVerlust;
  
  const cashflow = jahresNettoMiete - zinskosten;
  const cashflowMonatlich = cashflow / 12;
  
  // Renditen
  const bruttoMietrendite = kaufpreis > 0 ? (jahresmiete / kaufpreis) * 100 : 0;
  const nettoMietrendite = kaufpreis > 0 ? (jahresNettoMiete / kaufpreis) * 100 : 0;
  const eigenkapitalrendite = eigenkapital > 0 ? (cashflow / eigenkapital) * 100 : 0;
  
  const tilgungsBetrag = (fremdkapital * tilgung) / 100;
  const gesamtRendite = eigenkapital > 0 ? ((cashflow + tilgungsBetrag) / eigenkapital) * 100 : 0;

  const gesamtSchuldendienst = zinskosten + tilgungsBetrag;
  const dscr = gesamtSchuldendienst > 0 ? jahresNettoMiete / gesamtSchuldendienst : 0;

  // NEUE STEUERBERECHNUNG
  const abschreibungsBetrag = kaufpreis * (abschreibungProzent / 100);
  const steuerlichesErgebnis = jahresNettoMiete - zinskosten - abschreibungsBetrag;
  const steuerlast = steuerlichesErgebnis > 0 ? steuerlichesErgebnis * (steuersatz / 100) : 0;
  const cashflowNachSteuern = cashflow - steuerlast;
  const eigenkapitalrenditeNachSteuern = eigenkapital > 0 ? (cashflowNachSteuern / eigenkapital) * 100 : 0;

  return {
    // Basis
    anschaffungskosten,
    fremdkapital,
    eigenkapital,
    
    // Kosten
    zinskosten,
    tilgungsBetrag,
    laufendeKosten,
    verwaltung,
    ruecklagen,
    leerstandsVerlust,
    
    // Einnahmen
    jahresBruttoMiete: jahresmiete,
    jahresNettoMiete,
    
    // Cashflow
    cashflow,
    cashflowMonatlich,
    
    // Renditen
    bruttoMietrendite,
    nettoMietrendite,
    eigenkapitalrendite,
    gesamtRendite,
    
    // Kennzahlen
    dscr,
    
    // NEUE: Steuerliche Kennzahlen
    abschreibungsBetrag,
    steuerlichesErgebnis,
    steuerlast,
    cashflowNachSteuern,
    eigenkapitalrenditeNachSteuern,
    
    // Zusatzinfos
    monatlicheBruttomiete: jahresmiete / 12,
    monatlicheNettoMiete: jahresNettoMiete / 12,
    monatlichCashflowNachSteuern: cashflowNachSteuern / 12
  };
};

/**
 * Break-Even Analyse
 */
export const berechneBreakEven = (immobilie) => {
  const kennzahlen = berechneKennzahlen(immobilie);
  const eigenkapital = parseNumber(immobilie.eigenkapital);
  const kaufpreis = parseNumber(immobilie.kaufpreis);
  const nebenkosten = parseNumber(immobilie.nebenkosten);
  
  // Break-Even Miete: Mindestmiete um Kosten zu decken
  const fixkosten = kennzahlen.zinskosten + kennzahlen.laufendeKosten + 
                    kennzahlen.verwaltung + kennzahlen.ruecklagen;
  const breakEvenMiete = fixkosten / (1 - (parseNumber(immobilie.leerstand) / 100));
  
  // Break-Even Zeitpunkt: Wann ist Eigenkapital durch Cashflow zurück?
  const jahreZurAmortisation = kennzahlen.cashflowNachSteuern > 0 
    ? eigenkapital / kennzahlen.cashflowNachSteuern 
    : Infinity;
  
  // Break-Even Kaufpreis: Maximaler Kaufpreis bei gewünschter Rendite
  const gewuenschteRendite = 6; // 6% als Standard
  const breakEvenKaufpreis = kennzahlen.jahresNettoMiete / (gewuenschteRendite / 100);
  
  // Break-Even mit Wertsteigerung
  const wertsteigerung = 2; // 2% p.a.
  const jahreZurAmortisationMitWertsteigerung = berechneAmortisationMitWertsteigerung(
    eigenkapital,
    kennzahlen.cashflowNachSteuern,
    kaufpreis + nebenkosten,
    wertsteigerung
  );

  return {
    breakEvenMiete,
    breakEvenMieteMonatlich: breakEvenMiete / 12,
    jahreZurAmortisation,
    breakEvenKaufpreis,
    differenzZumMarktpreis: breakEvenKaufpreis - kaufpreis,
    jahreZurAmortisationMitWertsteigerung,
    istRentabel: kennzahlen.eigenkapitalrenditeNachSteuern > gewuenschteRendite,
    gewuenschteRendite
  };
};

/**
 * Hilfsfunktion: Berechnet Amortisation mit Wertsteigerung
 */
const berechneAmortisationMitWertsteigerung = (eigenkapital, cashflow, immobilienwert, wertsteigerung) => {
  let jahre = 0;
  let kumulierterCashflow = 0;
  let aktuellerWert = immobilienwert;
  
  while (jahre < 100) {
    jahre++;
    kumulierterCashflow += cashflow;
    aktuellerWert *= (1 + wertsteigerung / 100);
    
    const gewinn = kumulierterCashflow + (aktuellerWert - immobilienwert);
    if (gewinn >= eigenkapital) {
      return jahre;
    }
  }
  
  return Infinity;
};

/**
 * Was-wäre-wenn Szenario-Berechnung
 */
export const berechneSzenario = (immobilie, szenarioParameter) => {
  const modifizierteImmobilie = {
    ...immobilie,
    ...szenarioParameter
  };
  
  const basisKennzahlen = berechneKennzahlen(immobilie);
  const szenarioKennzahlen = berechneKennzahlen(modifizierteImmobilie);
  
  return {
    basis: basisKennzahlen,
    szenario: szenarioKennzahlen,
    differenz: {
      cashflow: szenarioKennzahlen.cashflow - basisKennzahlen.cashflow,
      eigenkapitalrendite: szenarioKennzahlen.eigenkapitalrendite - basisKennzahlen.eigenkapitalrendite,
      cashflowNachSteuern: szenarioKennzahlen.cashflowNachSteuern - basisKennzahlen.cashflowNachSteuern,
      eigenkapitalrenditeNachSteuern: szenarioKennzahlen.eigenkapitalrenditeNachSteuern - basisKennzahlen.eigenkapitalrenditeNachSteuern
    },
    parameter: szenarioParameter
  };
};

/**
 * 10-Jahres Simulation mit Wertsteigerung und Tilgung
 */
export const simuliere10Jahre = (immobilie) => {
  const jahre = [];
  const kaufpreis = parseNumber(immobilie.kaufpreis);
  const nebenkosten = parseNumber(immobilie.nebenkosten);
  const eigenkapitalStart = parseNumber(immobilie.eigenkapital);
  
  let restschuld = kaufpreis + nebenkosten - eigenkapitalStart;
  let aktuelleImmobilie = { ...immobilie };
  
  const wertsteigerung = 2; // 2% p.a.
  const mietsteigerung = 2; // 2% p.a.
  
  for (let jahr = 1; jahr <= 10; jahr++) {
    const kennzahlen = berechneKennzahlen(aktuelleImmobilie);
    
    // Wertsteigerung
    const neuerWert = kaufpreis * Math.pow(1 + wertsteigerung / 100, jahr);
    
    // Restschuld reduzieren
    restschuld = Math.max(0, restschuld - kennzahlen.tilgungsBetrag);
    
    // Eigenkapital = Immobilienwert - Restschuld
    const eigenkapital = neuerWert - restschuld;
    
    // Kumulierter Cashflow
    const kumulierterCashflow = jahre.reduce((sum, j) => sum + j.cashflowNachSteuern, 0) + kennzahlen.cashflowNachSteuern;
    
    // Gesamtvermögen = Eigenkapital + kumulierter Cashflow
    const gesamtvermoegen = eigenkapital + kumulierterCashflow;
    
    // ROI
    const roi = eigenkapitalStart > 0 ? ((gesamtvermoegen - eigenkapitalStart) / eigenkapitalStart) * 100 : 0;
    
    jahre.push({
      jahr,
      immobilienwert: neuerWert,
      restschuld,
      eigenkapital,
      jahresmiete: kennzahlen.jahresBruttoMiete,
      cashflow: kennzahlen.cashflow,
      cashflowNachSteuern: kennzahlen.cashflowNachSteuern,
      kumulierterCashflow,
      gesamtvermoegen,
      roi,
      eigenkapitalrendite: kennzahlen.eigenkapitalrenditeNachSteuern
    });
    
    // Miete für nächstes Jahr erhöhen
    const neueJahresmiete = kennzahlen.jahresBruttoMiete * (1 + mietsteigerung / 100);
    aktuelleImmobilie = {
      ...aktuelleImmobilie,
      jahresmiete: neueJahresmiete.toString(),
      kaufpreis: neuerWert.toString()
    };
  }
  
  return jahre;
};

/**
 * Berechnet die Gesamtstatistiken über alle Immobilien
 */
export const berechnePortfolioStatistiken = (immobilien) => {
  if (!immobilien || immobilien.length === 0) {
    return {
      gesamtAnschaffungskosten: 0,
      gesamtEigenkapital: 0,
      gesamtFremdkapital: 0,
      gesamtJahresmiete: 0,
      gesamtCashflow: 0,
      gesamtCashflowNachSteuern: 0,
      durchschnittlicheBruttoRendite: 0,
      durchschnittlicheNettoRendite: 0,
      durchschnittlicheEKRendite: 0,
      durchschnittlicheEKRenditeNachSteuern: 0,
      anzahlImmobilien: 0
    };
  }

  let gesamtAnschaffungskosten = 0;
  let gesamtEigenkapital = 0;
  let gesamtFremdkapital = 0;
  let gesamtJahresmiete = 0;
  let gesamtCashflow = 0;
  let gesamtCashflowNachSteuern = 0;
  let summeBruttoRendite = 0;
  let summeNettoRendite = 0;
  let summeEKRendite = 0;
  let summeEKRenditeNachSteuern = 0;

  immobilien.forEach(immobilie => {
    const kennzahlen = berechneKennzahlen(immobilie);
    
    gesamtAnschaffungskosten += kennzahlen.anschaffungskosten;
    gesamtEigenkapital += kennzahlen.eigenkapital;
    gesamtFremdkapital += kennzahlen.fremdkapital;
    gesamtJahresmiete += kennzahlen.jahresBruttoMiete;
    gesamtCashflow += kennzahlen.cashflow;
    gesamtCashflowNachSteuern += kennzahlen.cashflowNachSteuern;
    summeBruttoRendite += kennzahlen.bruttoMietrendite;
    summeNettoRendite += kennzahlen.nettoMietrendite;
    summeEKRendite += kennzahlen.eigenkapitalrendite;
    summeEKRenditeNachSteuern += kennzahlen.eigenkapitalrenditeNachSteuern;
  });

  const anzahl = immobilien.length;

  return {
    gesamtAnschaffungskosten,
    gesamtEigenkapital,
    gesamtFremdkapital,
    gesamtJahresmiete,
    gesamtCashflow,
    gesamtCashflowNachSteuern,
    gesamtCashflowMonatlich: gesamtCashflow / 12,
    gesamtCashflowMonatlichNachSteuern: gesamtCashflowNachSteuern / 12,
    durchschnittlicheBruttoRendite: anzahl > 0 ? summeBruttoRendite / anzahl : 0,
    durchschnittlicheNettoRendite: anzahl > 0 ? summeNettoRendite / anzahl : 0,
    durchschnittlicheEKRendite: anzahl > 0 ? summeEKRendite / anzahl : 0,
    durchschnittlicheEKRenditeNachSteuern: anzahl > 0 ? summeEKRenditeNachSteuern / anzahl : 0,
    portfolioRendite: gesamtEigenkapital > 0 ? (gesamtCashflow / gesamtEigenkapital) * 100 : 0,
    portfolioRenditeNachSteuern: gesamtEigenkapital > 0 ? (gesamtCashflowNachSteuern / gesamtEigenkapital) * 100 : 0,
    eigenkapitalquote: gesamtAnschaffungskosten > 0 ? (gesamtEigenkapital / gesamtAnschaffungskosten) * 100 : 0,
    anzahlImmobilien: anzahl
  };
};

/**
 * Bewertet eine Kennzahl basierend auf Schwellwerten
 */
export const bewerteKennzahl = (kennzahl, wert) => {
  const schwellwerte = {
    bruttoMietrendite: { schlecht: 3.0, mittel: 4.5 },
    nettoMietrendite: { schlecht: 2.0, mittel: 3.0 },
    eigenkapitalrendite: { schlecht: 3.0, mittel: 6.0 },
    eigenkapitalrenditeNachSteuern: { schlecht: 2.5, mittel: 5.0 },
    dscr: { kritisch: 1.0, grenzwertig: 1.2 }
  };
  
  const schwelle = schwellwerte[kennzahl];
  if (!schwelle) return { bewertung: 'neutral', farbe: 'text-gray-400' };
  
  if (kennzahl === 'dscr') {
    if (wert < schwelle.kritisch) return { bewertung: 'kritisch', farbe: 'text-red-500' };
    if (wert < schwelle.grenzwertig) return { bewertung: 'grenzwertig', farbe: 'text-yellow-500' };
    return { bewertung: 'gut', farbe: 'text-green-500' };
  }
  
  if (wert < schwelle.schlecht) return { bewertung: 'schlecht', farbe: 'text-red-500' };
  if (wert < schwelle.mittel) return { bewertung: 'mittel', farbe: 'text-yellow-500' };
  return { bewertung: 'gut', farbe: 'text-green-500' };
};