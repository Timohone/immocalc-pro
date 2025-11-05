import { useMemo } from 'react';
import { 
  berechneKennzahlen, 
  berechnePortfolioStatistiken,
  simuliere10Jahre,
  bewerteKennzahl 
} from '../services/calculationService';

/**
 * Custom Hook für Kennzahlen-Berechnungen
 * Cached Berechnungen mit useMemo für Performance
 */
export const useKennzahlen = (immobilie) => {
  /**
   * Berechnet alle Kennzahlen für eine Immobilie
   */
  const kennzahlen = useMemo(() => {
    if (!immobilie) return null;
    return berechneKennzahlen(immobilie);
  }, [immobilie]);

  /**
   * Bewertet die Kennzahlen
   */
  const bewertungen = useMemo(() => {
    if (!kennzahlen) return null;
    
    return {
      bruttoMietrendite: bewerteKennzahl('bruttoMietrendite', kennzahlen.bruttoMietrendite),
      nettoMietrendite: bewerteKennzahl('nettoMietrendite', kennzahlen.nettoMietrendite),
      eigenkapitalrendite: bewerteKennzahl('eigenkapitalrendite', kennzahlen.eigenkapitalrendite),
      dscr: bewerteKennzahl('dscr', kennzahlen.dscr)
    };
  }, [kennzahlen]);

  return {
    kennzahlen,
    bewertungen
  };
};

/**
 * Custom Hook für Portfolio-Statistiken
 */
export const usePortfolioKennzahlen = (immobilien) => {
  /**
   * Berechnet Portfolio-Statistiken
   */
  const portfolioStats = useMemo(() => {
    if (!immobilien || immobilien.length === 0) return null;
    return berechnePortfolioStatistiken(immobilien);
  }, [immobilien]);

  /**
   * Berechnet Kennzahlen für jede Immobilie
   */
  const immobilienMitKennzahlen = useMemo(() => {
    if (!immobilien || immobilien.length === 0) return [];
    
    return immobilien.map(immobilie => ({
      ...immobilie,
      kennzahlen: berechneKennzahlen(immobilie)
    }));
  }, [immobilien]);

  /**
   * Sortiert Immobilien nach verschiedenen Kriterien
   */
  const getSortedImmobilien = (sortBy = 'name', order = 'asc') => {
    const sorted = [...immobilienMitKennzahlen].sort((a, b) => {
      let valueA, valueB;
      
      if (sortBy === 'name' || sortBy === 'adresse') {
        valueA = a[sortBy] || '';
        valueB = b[sortBy] || '';
        return order === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      
      // Für Kennzahlen
      if (a.kennzahlen && b.kennzahlen) {
        valueA = a.kennzahlen[sortBy] || 0;
        valueB = b.kennzahlen[sortBy] || 0;
      } else {
        valueA = 0;
        valueB = 0;
      }
      
      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });
    
    return sorted;
  };

  /**
   * Findet Top-Performer nach Kennzahl
   */
  const getTopPerformer = (kennzahl, limit = 3) => {
    return getSortedImmobilien(kennzahl, 'desc').slice(0, limit);
  };

  /**
   * Findet Immobilien mit negativem Cashflow
   */
  const getNegativeCashflowImmobilien = () => {
    return immobilienMitKennzahlen.filter(
      i => i.kennzahlen && i.kennzahlen.cashflow < 0
    );
  };

  /**
   * Findet Immobilien mit kritischem DSCR (< 1.0)
   */
  const getKritischeDSCRImmobilien = () => {
    return immobilienMitKennzahlen.filter(
      i => i.kennzahlen && i.kennzahlen.dscr < 1.0
    );
  };

  return {
    portfolioStats,
    immobilienMitKennzahlen,
    getSortedImmobilien,
    getTopPerformer,
    getNegativeCashflowImmobilien,
    getKritischeDSCRImmobilien
  };
};

/**
 * Custom Hook für Simulations-Berechnungen
 */
export const useSimulation = (immobilie, jahre = 10, mietsteigerung = 2, wertsteigerung = 2) => {
  /**
   * Berechnet Simulation
   */
  const simulation = useMemo(() => {
    if (!immobilie) return null;
    return simuliere10Jahre(immobilie, jahre, mietsteigerung, wertsteigerung);
  }, [immobilie, jahre, mietsteigerung, wertsteigerung]);

  /**
   * Berechnet Zusammenfassung der Simulation
   */
  const simulationSummary = useMemo(() => {
    if (!simulation || simulation.length === 0) return null;
    
    const letzterEintrag = simulation[simulation.length - 1];
    const ersterEintrag = simulation[0];
    
    const gesamtCashflow = simulation.reduce((sum, e) => sum + e.cashflow, 0);
    const gesamtWertsteigerung = letzterEintrag.immobilienwert - parseFloat(immobilie.kaufpreis || 0);
    const gesamtEigenkapitalZuwachs = letzterEintrag.eigenkapital - parseFloat(immobilie.eigenkapital || 0);
    const roi = parseFloat(immobilie.eigenkapital) > 0 
      ? ((gesamtCashflow + gesamtWertsteigerung) / parseFloat(immobilie.eigenkapital)) * 100 
      : 0;
    
    return {
      gesamtCashflow,
      gesamtWertsteigerung,
      gesamtEigenkapitalZuwachs,
      roi,
      endImmobilienwert: letzterEintrag.immobilienwert,
      endRestschuld: letzterEintrag.restschuld,
      endEigenkapital: letzterEintrag.eigenkapital
    };
  }, [simulation, immobilie]);

  /**
   * Bereitet Chart-Daten vor
   */
  const chartData = useMemo(() => {
    if (!simulation) return [];
    
    return simulation.map(entry => ({
      jahr: `Jahr ${entry.jahr}`,
      immobilienwert: Math.round(entry.immobilienwert),
      eigenkapital: Math.round(entry.eigenkapital),
      restschuld: Math.round(entry.restschuld),
      cashflow: Math.round(entry.cashflow),
      kumulierterCashflow: Math.round(entry.kumulierterCashflow)
    }));
  }, [simulation]);

  return {
    simulation,
    simulationSummary,
    chartData
  };
};