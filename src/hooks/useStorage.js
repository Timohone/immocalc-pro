import { useState, useEffect } from 'react';
import * as storageService from '../services/storageService';

/**
 * Custom Hook für Storage Operations
 * Bietet einfachen Zugriff auf Storage-Funktionen mit Loading States
 */
export const useStorage = () => {
  const [isAvailable, setIsAvailable] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Prüfe Storage-Verfügbarkeit beim Mount
  useEffect(() => {
    const checkAvailability = async () => {
      const available = await storageService.isStorageAvailable();
      setIsAvailable(available);
    };
    checkAvailability();
  }, []);

  /**
   * Wrapper für Storage-Operationen mit Error Handling
   */
  const withErrorHandling = async (operation, errorMessage) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await operation();
      return result;
    } catch (err) {
      console.error(errorMessage, err);
      setError(err.message || errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Lädt alle Immobilien
   */
  const loadAll = async () => {
    return withErrorHandling(
      () => storageService.loadAllImmobilien(),
      'Fehler beim Laden der Immobilien'
    );
  };

  /**
   * Lädt eine einzelne Immobilie
   */
  const loadOne = async (id) => {
    return withErrorHandling(
      () => storageService.loadImmobilie(id),
      `Fehler beim Laden der Immobilie ${id}`
    );
  };

  /**
   * Speichert eine Immobilie
   */
  const save = async (immobilie) => {
    return withErrorHandling(
      () => storageService.saveImmobilie(immobilie),
      'Fehler beim Speichern der Immobilie'
    );
  };

  /**
   * Löscht eine Immobilie
   */
  const remove = async (id) => {
    return withErrorHandling(
      () => storageService.deleteImmobilie(id),
      `Fehler beim Löschen der Immobilie ${id}`
    );
  };

  /**
   * Löscht alle Immobilien
   */
  const removeAll = async () => {
    return withErrorHandling(
      () => storageService.deleteAllImmobilien(),
      'Fehler beim Löschen aller Immobilien'
    );
  };

  /**
   * Exportiert alle Immobilien als JSON
   */
  const exportData = async () => {
    return withErrorHandling(
      () => storageService.exportImmobilien(),
      'Fehler beim Exportieren der Daten'
    );
  };

  /**
   * Importiert Immobilien aus JSON
   */
  const importData = async (jsonString) => {
    return withErrorHandling(
      () => storageService.importImmobilien(jsonString),
      'Fehler beim Importieren der Daten'
    );
  };

  /**
   * Erstellt ein Backup
   */
  const backup = async () => {
    return withErrorHandling(
      () => storageService.createBackup(),
      'Fehler beim Erstellen des Backups'
    );
  };

  /**
   * Stellt Backup wieder her
   */
  const restore = async (file) => {
    return withErrorHandling(
      () => storageService.restoreBackup(file),
      'Fehler beim Wiederherstellen des Backups'
    );
  };

  return {
    isAvailable,
    isLoading,
    error,
    loadAll,
    loadOne,
    save,
    remove,
    removeAll,
    exportData,
    importData,
    backup,
    restore
  };
};