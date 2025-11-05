import React from 'react';
import { Calculator, Info } from 'lucide-react';
import FormInput from './FormInput';

const SteuerSection = ({ formData, onChange, kennzahlen }) => {
  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Steuerliche Berechnung</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormInput
          label="Persönlicher Steuersatz"
          name="steuersatz"
          type="number"
          value={formData.steuersatz}
          onChange={onChange}
          placeholder="30"
          suffix="%"
          hint="Dein Grenzsteuersatz"
        />

        <FormInput
          label="Abschreibung"
          name="abschreibungProzent"
          type="number"
          value={formData.abschreibungProzent}
          onChange={onChange}
          placeholder="2.5"
          suffix="%"
          hint="Standard: 2.5% p.a."
        />

        <FormInput
          label="Abschreibungsdauer"
          name="abschreibungJahre"
          type="number"
          value={formData.abschreibungJahre}
          onChange={onChange}
          placeholder="40"
          suffix="Jahre"
          hint="Standard: 40 Jahre"
        />
      </div>

      {/* Steuerliche Kennzahlen Preview */}
      {kennzahlen && formData.steuersatz && (
        <div className="mt-6 bg-slate-750 rounded-lg p-4 border border-slate-600">
          <h4 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Steuerliche Auswirkungen (Vorschau)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-slate-400 mb-1">Abschreibungsbetrag p.a.</p>
              <p className="text-white font-semibold">
                {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(kennzahlen.abschreibungsBetrag || 0)}
              </p>
            </div>

            <div>
              <p className="text-slate-400 mb-1">Steuerliches Ergebnis</p>
              <p className={`font-semibold ${(kennzahlen.steuerlichesErgebnis || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(kennzahlen.steuerlichesErgebnis || 0)}
              </p>
            </div>

            <div>
              <p className="text-slate-400 mb-1">Steuerlast p.a.</p>
              <p className="text-orange-400 font-semibold">
                {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(kennzahlen.steuerlast || 0)}
              </p>
            </div>

            <div>
              <p className="text-slate-400 mb-1">Cashflow nach Steuern</p>
              <p className={`font-semibold ${(kennzahlen.cashflowNachSteuern || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {new Intl.NumberFormat('de-CH', { style: 'currency', currency: 'CHF' }).format(kennzahlen.cashflowNachSteuern || 0)}
              </p>
            </div>

            <div className="md:col-span-2">
              <p className="text-slate-400 mb-1">EK-Rendite nach Steuern</p>
              <p className={`text-lg font-bold ${(kennzahlen.eigenkapitalrenditeNachSteuern || 0) >= 5 ? 'text-green-400' : 'text-yellow-400'}`}>
                {(kennzahlen.eigenkapitalrenditeNachSteuern || 0).toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700/50 rounded">
            <p className="text-xs text-blue-300">
              💡 <strong>Tipp:</strong> Abschreibungen reduzieren dein steuerpflichtiges Einkommen und 
              verbessern so die Nettorendite deiner Immobilie.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SteuerSection;