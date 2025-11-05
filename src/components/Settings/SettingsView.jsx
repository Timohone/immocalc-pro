import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, DollarSign, TrendingUp, Home, Calculator, Info } from 'lucide-react';
import { loadSettings, saveSettings, resetSettings, calculatePreviewValues, DEFAULT_SETTINGS } from '../../services/settingsService';
import { formatCurrency, formatPercent } from '../../utils/formatters';

const SettingsView = () => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [previewKaufpreis, setPreviewKaufpreis] = useState('448000');
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loaded = loadSettings();
    setSettings(loaded);
  }, []);

  const handleChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleSave = () => {
    saveSettings(settings);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Möchtest du wirklich alle Einstellungen auf die Standardwerte zurücksetzen?')) {
      const defaults = resetSettings();
      setSettings(defaults);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const previewValues = calculatePreviewValues(previewKaufpreis, settings);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Einstellungen</h2>
        </div>
        <p className="text-slate-400">
          Konfiguriere die Standard-Werte für neue Immobilien. Diese Werte werden automatisch ausgefüllt, 
          können aber bei jeder Immobilie individuell überschrieben werden.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-500/10 border border-green-500 rounded-lg p-4">
          <p className="text-green-400 font-semibold">✓ Einstellungen erfolgreich gespeichert!</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Einstellungen */}
        <div className="space-y-6">
          {/* Nebenkosten & Finanzierung */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-green-400" />
              <h3 className="text-lg font-semibold text-white">Kaufdaten & Finanzierung</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Nebenkosten (% vom Kaufpreis)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.nebenkostenProzent}
                    onChange={(e) => handleChange('nebenkostenProzent', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Grundbuch, Notar, Handänderungssteuer</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Eigenkapital (% vom Kaufpreis)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="1"
                    value={settings.eigenkapitalProzent}
                    onChange={(e) => handleChange('eigenkapitalProzent', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Mindestens 20% in der Schweiz</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Hypothekar-Zinssatz (% p.a.)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.zinssatz}
                    onChange={(e) => handleChange('zinssatz', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Aktueller Marktzins ca. 2.0-3.0%</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Tilgung (% p.a.)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.tilgung}
                    onChange={(e) => handleChange('tilgung', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Standard 1% pro Jahr</p>
              </div>
            </div>
          </div>

          {/* Laufende Kosten */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <Home className="w-5 h-5 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Laufende Kosten</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Laufende Kosten (% vom Kaufpreis p.a.)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.laufendeKostenProzent}
                    onChange={(e) => handleChange('laufendeKostenProzent', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Betrieb, Unterhalt, Instandhaltung</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Verwaltung (% der Jahresmiete)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.verwaltungProzent}
                    onChange={(e) => handleChange('verwaltungProzent', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Hausverwaltung, Buchhaltung</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Rücklagen (% vom Kaufpreis p.a.)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.ruecklagenProzent}
                    onChange={(e) => handleChange('ruecklagenProzent', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Für Renovationen und Reparaturen</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Leerstand (% p.a.)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.leerstandProzent}
                    onChange={(e) => handleChange('leerstandProzent', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Erwartete Leerstands-Quote</p>
              </div>
            </div>
          </div>

          {/* Mietberechnung & Steuern */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-white">Mietberechnung & Steuern</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Geschätzte Brutto-Rendite (% p.a.)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.bruttorenditeProzent}
                    onChange={(e) => handleChange('bruttorenditeProzent', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Zur Schätzung der Jahresmiete</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Persönlicher Steuersatz (%)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="1"
                    value={settings.steuersatz}
                    onChange={(e) => handleChange('steuersatz', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Dein Grenzsteuersatz (Bund + Kanton)</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Abschreibung (% p.a.)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={settings.abschreibungProzent}
                    onChange={(e) => handleChange('abschreibungProzent', e.target.value)}
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                  />
                  <span className="text-slate-400 text-sm">%</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">Standard 2.5% linear</p>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">
                  Abschreibungsdauer (Jahre)
                </label>
                <input
                  type="number"
                  step="1"
                  value={settings.abschreibungJahre}
                  onChange={(e) => handleChange('abschreibungJahre', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
                />
                <p className="text-xs text-slate-500 mt-1">Standard 40 Jahre</p>
              </div>
            </div>
          </div>

          {/* Auto-Fill Toggle */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoFillEnabled}
                onChange={(e) => setSettings(prev => ({ ...prev, autoFillEnabled: e.target.checked }))}
                className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-white font-semibold">Auto-Fill aktivieren</span>
                <p className="text-xs text-slate-400 mt-1">
                  Felder werden automatisch mit berechneten Werten ausgefüllt (können jederzeit überschrieben werden)
                </p>
              </div>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors font-semibold"
            >
              <Save className="w-5 h-5" />
              Speichern
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-lg transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Zurücksetzen
            </button>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 sticky top-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Live-Vorschau</h3>
            </div>

            <div className="mb-4">
              <label className="block text-sm text-slate-400 mb-2">
                Beispiel-Kaufpreis
              </label>
              <input
                type="number"
                value={previewKaufpreis}
                onChange={(e) => setPreviewKaufpreis(e.target.value)}
                placeholder="448000"
                className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
              />
            </div>

            <div className="bg-slate-750 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">Berechnete Werte:</h4>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Kaufpreis:</span>
                <span className="text-white font-semibold">{formatCurrency(previewValues.kaufpreis)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Nebenkosten:</span>
                <span className="text-green-400 font-semibold">{formatCurrency(parseFloat(previewValues.nebenkosten))}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Gesamtinvestition:</span>
                <span className="text-white font-semibold">{formatCurrency(previewValues.gesamtinvestition)}</span>
              </div>
              
              <div className="border-t border-slate-600 pt-3 mt-3"></div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Eigenkapital:</span>
                <span className="text-blue-400 font-semibold">{formatCurrency(parseFloat(previewValues.eigenkapital))}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Fremdkapital:</span>
                <span className="text-orange-400 font-semibold">{formatCurrency(previewValues.fremdkapital)}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Zinssatz:</span>
                <span className="text-white">{formatPercent(parseFloat(previewValues.zinssatz))}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Zinskosten p.a.:</span>
                <span className="text-red-400 font-semibold">{formatCurrency(parseFloat(previewValues.zinskosten))}</span>
              </div>
              
              <div className="border-t border-slate-600 pt-3 mt-3"></div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Geschätzte Jahresmiete:</span>
                <span className="text-green-400 font-semibold">{formatCurrency(parseFloat(previewValues.jahresmiete))}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Monatliche Miete:</span>
                <span className="text-white">{formatCurrency(parseFloat(previewValues.monatlicheBruttomiete))}</span>
              </div>
              
              <div className="border-t border-slate-600 pt-3 mt-3"></div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Laufende Kosten p.a.:</span>
                <span className="text-white">{formatCurrency(parseFloat(previewValues.laufendeKosten))}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Verwaltung p.a.:</span>
                <span className="text-white">{formatCurrency(parseFloat(previewValues.verwaltung))}</span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Rücklagen p.a.:</span>
                <span className="text-white">{formatCurrency(parseFloat(previewValues.ruecklagen))}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/50 rounded flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-300">
                Diese Werte werden automatisch in neue Immobilien eingefügt, 
                können aber jederzeit manuell angepasst werden.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;