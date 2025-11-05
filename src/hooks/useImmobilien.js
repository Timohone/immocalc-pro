import { useState, useEffect, useCallback } from 'react';
import { useStorage } from './useStorage';
import { DEFAULT_IMMOBILIE } from '../utils/constants';

/**
 * Custom Hook für Immobilien-Verwaltung
 * Verwaltet den kompletten State und CRUD-Operationen für Immobilien
 */
export const useImmobilien = () => {
  const [immobilien, setImmobilien] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const storage = useStorage();

  /**
   * Lädt alle Immobilien beim Mount
   */
  useEffect(() => {
    loadImmobilien();
  }, []);

  /**
   * Lädt alle Immobilien aus dem Storage
   */
  const loadImmobilien = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await storage.loadAll();
      setImmobilien(data);
    } catch (err) {
      setError('Fehler beim Laden der Immobilien');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [storage]);

  /**
   * Fügt eine neue Immobilie hinzu
   */
  const addImmobilie = useCallback(async (immobilieData) => {
    try {
      const neueImmobilie = {
        ...DEFAULT_IMMOBILIE,
        ...immobilieData,
        id: `immo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        erstelltAm: new Date().toISOString()
      };

      await storage.save(neueImmobilie);
      await loadImmobilien();
      return neueImmobilie;
    } catch (err) {
      setError('Fehler beim Hinzufügen der Immobilie');
      console.error(err);
      throw err;
    }
  }, [storage, loadImmobilien]);

  /**
   * Aktualisiert eine bestehende Immobilie
   */
  const updateImmobilie = useCallback(async (id, immobilieData) => {
    try {
      const existingImmobilie = immobilien.find(i => i.id === id);
      if (!existingImmobilie) {
        throw new Error('Immobilie nicht gefunden');
      }

      const updatedImmobilie = {
        ...existingImmobilie,
        ...immobilieData,
        id, // ID darf nicht überschrieben werden
        aktualisiertAm: new Date().toISOString()
      };

      await storage.save(updatedImmobilie);
      await loadImmobilien();
      return updatedImmobilie;
    } catch (err) {
      setError('Fehler beim Aktualisieren der Immobilie');
      console.error(err);
      throw err;
    }
  }, [immobilien, storage, loadImmobilien]);

  /**
   * Löscht eine Immobilie
   */
  const deleteImmobilie = useCallback(async (id) => {
    try {
      await storage.remove(id);
      await loadImmobilien();
    } catch (err) {
      setError('Fehler beim Löschen der Immobilie');
      console.error(err);
      throw err;
    }
  }, [storage, loadImmobilien]);

  /**
   * Löscht alle Immobilien
   */
  const deleteAllImmobilien = useCallback(async () => {
    try {
      await storage.removeAll();
      await loadImmobilien();
    } catch (err) {
      setError('Fehler beim Löschen aller Immobilien');
      console.error(err);
      throw err;
    }
  }, [storage, loadImmobilien]);

  /**
   * Findet eine Immobilie nach ID
   */
  const getImmobilieById = useCallback((id) => {
    return immobilien.find(i => i.id === id);
  }, [immobilien]);

  /**
   * Exportiert alle Immobilien
   */
  const exportImmobilien = useCallback(async () => {
    try {
      const jsonString = await storage.exportData();
      
      // Download als Datei
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `immobilien_export_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      setError('Fehler beim Exportieren der Immobilien');
      console.error(err);
      throw err;
    }
  }, [storage]);

  /**
   * Importiert Immobilien aus Datei
   */
  const importImmobilien = useCallback(async (file) => {
    try {
      const text = await file.text();
      const count = await storage.importData(text);
      await loadImmobilien();
      return count;
    } catch (err) {
      setError('Fehler beim Importieren der Immobilien');
      console.error(err);
      throw err;
    }
  }, [storage, loadImmobilien]);

  /**
   * Erstellt ein Backup
   */
  const createBackup = useCallback(async () => {
    try {
      const blob = await storage.backup();
      
      // Download als Datei
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `immobilien_backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      return true;
    } catch (err) {
      setError('Fehler beim Erstellen des Backups');
      console.error(err);
      throw err;
    }
  }, [storage]);

  /**
   * Stellt Backup wieder her
   */
  const restoreBackup = useCallback(async (file) => {
    try {
      const count = await storage.restore(file);
      await loadImmobilien();
      return count;
    } catch (err) {
      setError('Fehler beim Wiederherstellen des Backups');
      console.error(err);
      throw err;
    }
  }, [storage, loadImmobilien]);

  return {
    immobilien,
    loading,
    error,
    addImmobilie,
    updateImmobilie,
    deleteImmobilie,
    deleteAllImmobilien,
    getImmobilieById,
    reloadImmobilien: loadImmobilien,
    exportImmobilien,
    importImmobilien,
    createBackup,
    restoreBackup
  };
};