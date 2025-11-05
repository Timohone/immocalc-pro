import React, { useState } from 'react';
import Header from './components/Layout/Header';
import Navigation from './components/Layout/Navigation';
import DashboardView from './components/Dashboard/DashboardView';
import SimulationView from './components/Simulation/SimulationView';
import { useImmobilien } from './hooks/useImmobilien';
import { TABS } from './utils/constants';

function App() {
  const [activeTab, setActiveTab] = useState(TABS.DASHBOARD);
  
  const {
    immobilien,
    loading,
    error,
    addImmobilie,
    updateImmobilie,
    deleteImmobilie,
    deleteAllImmobilien,
    exportImmobilien,
    importImmobilien,
    createBackup
  } = useImmobilien();

  // Handler für Export
  const handleExport = async () => {
    try {
      await exportImmobilien();
      alert('Export erfolgreich! Die Datei wurde heruntergeladen.');
    } catch (err) {
      alert('Fehler beim Exportieren: ' + err.message);
    }
  };

  // Handler für Import
  const handleImport = async (file) => {
    try {
      const count = await importImmobilien(file);
      alert(`${count} Immobilien erfolgreich importiert!`);
    } catch (err) {
      alert('Fehler beim Importieren: ' + err.message);
    }
  };

  // Handler für Reset
  const handleReset = async () => {
    if (window.confirm('Möchtest du wirklich ALLE Immobilien löschen? Diese Aktion kann nicht rückgängig gemacht werden!')) {
      try {
        await deleteAllImmobilien();
        alert('Alle Immobilien wurden gelöscht.');
      } catch (err) {
        alert('Fehler beim Löschen: ' + err.message);
      }
    }
  };

  // Handler für Backup
  const handleBackup = async () => {
    try {
      await createBackup();
      alert('Backup erfolgreich erstellt! Die Datei wurde heruntergeladen.');
    } catch (err) {
      alert('Fehler beim Erstellen des Backups: ' + err.message);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Lade Daten...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 max-w-md">
          <h2 className="text-red-400 font-semibold text-lg mb-2">Fehler</h2>
          <p className="text-white">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Neu laden
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <Header
        anzahlImmobilien={immobilien.length}
        onExport={handleExport}
        onImport={handleImport}
        onReset={handleReset}
        onBackup={handleBackup}
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === TABS.DASHBOARD && (
          <DashboardView
            immobilien={immobilien}
            onAddImmobilie={addImmobilie}
            onUpdateImmobilie={updateImmobilie}
            onDeleteImmobilie={deleteImmobilie}
          />
        )}

        {activeTab === TABS.SIMULATION && (
          <SimulationView immobilien={immobilien} />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <p>ImmoCal Pro - Schweizer Immobilien Rendite Rechner</p>
            <p>© 2024 - Made with ❤️ for Swiss Real Estate</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;