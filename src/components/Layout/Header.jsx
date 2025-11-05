import React from 'react';
import { Building, Download, Upload, Trash2 } from 'lucide-react';

const Header = ({ 
  anzahlImmobilien, 
  onExport, 
  onImport, 
  onReset,
  onBackup 
}) => {
  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        onImport(file);
      }
    };
    input.click();
  };

  return (
    <div className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building className="w-8 h-8 text-blue-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">ImmoCal Pro</h1>
              <p className="text-sm text-slate-400">Schweizer Immobilien Rendite Rechner</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right mr-4">
              <p className="text-sm text-slate-400">Portfolio</p>
              <p className="text-xl font-bold text-white">{anzahlImmobilien} Immobilien</p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={onBackup}
                className="flex items-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm"
                title="Backup erstellen"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Backup</span>
              </button>
              
              <button
                onClick={onExport}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors text-sm"
                title="Daten exportieren"
              >
                <Download className="w-4 h-4" />
                <span className="hidden md:inline">Export</span>
              </button>
              
              <button
                onClick={handleImportClick}
                className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors text-sm"
                title="Daten importieren"
              >
                <Upload className="w-4 h-4" />
                <span className="hidden md:inline">Import</span>
              </button>
              
              {anzahlImmobilien > 0 && (
                <button
                  onClick={onReset}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors text-sm"
                  title="Alle Daten löschen"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden md:inline">Reset</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;