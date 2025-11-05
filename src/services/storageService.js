const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

/**
 * Lädt alle Immobilien vom Backend
 * @returns {Promise<Array>} - Array aller Immobilien
 */
export const loadAllImmobilien = async () => {
  try {
    const response = await fetch(`${API_URL}/immobilien`);
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const immobilien = await response.json();
    return immobilien;
    
  } catch (error) {
    console.error('Fehler beim Laden der Immobilien:', error);
    throw new Error('Fehler beim Laden der Immobilien: ' + error.message);
  }
};

/**
 * Lädt eine einzelne Immobilie
 * @param {string} id - Die ID der Immobilie
 * @returns {Promise<Object|null>} - Die Immobilie oder null
 */
export const loadImmobilie = async (id) => {
  try {
    const response = await fetch(`${API_URL}/immobilien/${id}`);
    
    if (response.status === 404) {
      return null;
    }
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const immobilie = await response.json();
    return immobilie;
    
  } catch (error) {
    console.error(`Fehler beim Laden der Immobilie ${id}:`, error);
    return null;
  }
};

/**
 * Speichert eine Immobilie (erstellt neu oder aktualisiert)
 * @param {object} immobilie - Die zu speichernde Immobilie
 * @returns {Promise<boolean>} - true bei Erfolg
 */
export const saveImmobilie = async (immobilie) => {
  try {
    let isUpdate = false;
    
    // Prüfe ob Immobilie bereits existiert (wenn ID vorhanden)
    if (immobilie.id) {
      const existing = await loadImmobilie(immobilie.id);
      isUpdate = existing !== null;
    }
    
    const url = isUpdate 
      ? `${API_URL}/immobilien/${immobilie.id}`
      : `${API_URL}/immobilien`;
    
    const method = isUpdate ? 'PUT' : 'POST';
    
    console.log(`${method} Request für Immobilie:`, immobilie.name, immobilie.id);
    
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(immobilie)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server Response:', errorText);
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const savedImmobilie = await response.json();
    console.log('Erfolgreich gespeichert:', savedImmobilie.id);
    
    return true;
    
  } catch (error) {
    console.error('Fehler beim Speichern der Immobilie:', error);
    throw new Error('Speichern fehlgeschlagen: ' + error.message);
  }
};

/**
 * Löscht eine Immobilie
 * @param {string} id - Die ID der zu löschenden Immobilie
 * @returns {Promise<boolean>} - true bei Erfolg
 */
export const deleteImmobilie = async (id) => {
  try {
    const response = await fetch(`${API_URL}/immobilien/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    return true;
    
  } catch (error) {
    console.error(`Fehler beim Löschen der Immobilie ${id}:`, error);
    throw new Error('Löschen fehlgeschlagen: ' + error.message);
  }
};

/**
 * Löscht alle Immobilien (für Reset-Funktion)
 * @returns {Promise<boolean>} - true bei Erfolg
 */
export const deleteAllImmobilien = async () => {
  try {
    const response = await fetch(`${API_URL}/immobilien`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    return true;
    
  } catch (error) {
    console.error('Fehler beim Löschen aller Immobilien:', error);
    throw new Error('Löschen aller Immobilien fehlgeschlagen: ' + error.message);
  }
};

/**
 * Exportiert alle Immobilien als JSON
 * @returns {Promise<string>} - JSON String aller Immobilien
 */
export const exportImmobilien = async () => {
  try {
    const immobilien = await loadAllImmobilien();
    return JSON.stringify(immobilien, null, 2);
  } catch (error) {
    console.error('Fehler beim Exportieren:', error);
    throw new Error('Export fehlgeschlagen: ' + error.message);
  }
};

/**
 * Importiert Immobilien aus JSON
 * @param {string} jsonString - JSON String mit Immobilien
 * @returns {Promise<number>} - Anzahl importierter Immobilien
 */
export const importImmobilien = async (jsonString) => {
  try {
    const immobilien = JSON.parse(jsonString);
    
    if (!Array.isArray(immobilien)) {
      throw new Error('Ungültiges Format: Erwarte Array von Immobilien');
    }
    
    const response = await fetch(`${API_URL}/immobilien/import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ immobilien })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    
    const result = await response.json();
    return result.immobilien.length;
    
  } catch (error) {
    console.error('Fehler beim Importieren:', error);
    throw new Error('Import fehlgeschlagen: ' + error.message);
  }
};

/**
 * Prüft ob Backend verfügbar ist
 * @returns {Promise<boolean>} - true wenn verfügbar
 */
export const isStorageAvailable = async () => {
  try {
    const response = await fetch(`${API_URL.replace('/api', '')}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend nicht verfügbar:', error);
    return false;
  }
};

/**
 * Erstellt ein Backup aller Daten
 * @returns {Promise<Blob>} - Backup als Blob
 */
export const createBackup = async () => {
  try {
    const jsonString = await exportImmobilien();
    const blob = new Blob([jsonString], { type: 'application/json' });
    return blob;
  } catch (error) {
    console.error('Fehler beim Erstellen des Backups:', error);
    throw new Error('Backup fehlgeschlagen: ' + error.message);
  }
};

/**
 * Stellt Daten aus einem Backup wieder her
 * @param {File} file - Backup-Datei
 * @returns {Promise<number>} - Anzahl wiederhergestellter Immobilien
 */
export const restoreBackup = async (file) => {
  try {
    const text = await file.text();
    return await importImmobilien(text);
  } catch (error) {
    console.error('Fehler beim Wiederherstellen des Backups:', error);
    throw new Error('Wiederherstellung fehlgeschlagen: ' + error.message);
  }
};