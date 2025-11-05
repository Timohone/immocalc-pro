import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Zap, AlertTriangle } from 'lucide-react';
import { berechneSzenario } from '../../services/calculationService';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { SZENARIO_TEMPLATES } from '../../utils/constants';

const SzenarienRechner = ({ immobilie }) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [customParameter, setCustomParameter] = useState({});
  const [ergebnis, setErgebnis] = useState(null);

  const applyTemplate = (template) => {
    setSelectedTemplate(template);
    const params = {};
    
    Object.entries(template.parameter).forEach(([key, value]) => {
      if (typeof value === 'string' && value.includes('%')) {
        const percent = parseFloat(value);
        const baseValue = parseFloat(immobilie[key]) || 0;
        params[key] = (baseValue * (1 + percent / 100)).toString();
      } else if (typeof value === 'string' && value.includes('+')) {
        const add = parseFloat(value.replace('+', ''));
        const baseValue = parseFloat(immobilie[key]) || 0;
        params[key] = (baseValue + add).toString();
      } else {
        params[key] = value;
      }
    });
    
    setCustomParameter(params);
    berechnen(params);
  };

  const berechnen = (params) => {
    const result = berechneSzenario(immobilie, params);
    setErgebnis(result);
  };

  const handleCustomChange = (key, value) => {
    const newParams = { ...customParameter, [key]: value };
    setCustomParameter(newParams);
    berechnen(newParams);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Was-wäre-wenn Szenarien</h3>
        
        {/* Template Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {Object.entries(SZENARIO_TEMPLATES).map(([key, template]) => (
            <button
              key={key}
              onClick={() => applyTemplate(template)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedTemplate?.name === template.name
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-750 hover:border-slate-500'
              }`}
            >
              <h4 className="font-semibold text-white mb-1">{template.name}</h4>
              <p className="text-xs text-slate-400">{template.beschreibung}</p>
            </button>
          ))}
        </div>

        {/* Custom Parameters */}
        {ergebnis && (
          <div className="bg-slate-750 rounded-lg p-4 border border-slate-600">
            <h4 className="text-sm font-semibold text-white mb-3">Parameter anpassen</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Jahresmiete (CHF)</label>
                <input
                  type="number"
                  value={customParameter.jahresmiete || immobilie.jahresmiete}
                  onChange={(e) => handleCustomChange('jahresmiete', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Zinssatz (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={customParameter.zinssatz || immobilie.zinssatz}
                  onChange={(e) => handleCustomChange('zinssatz', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Laufende Kosten (CHF)</label>
                <input
                  type="number"
                  value={customParameter.laufendeKosten || immobilie.laufendeKosten}
                  onChange={(e) => handleCustomChange('laufendeKosten', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white text-sm"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      {ergebnis && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basis vs Szenario */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-400" />
              Vergleich: Basis vs. Szenario
            </h4>
            
            <div className="space-y-4">
              {[
                { label: 'Cashflow p.a.', key: 'cashflow' },
                { label: 'Cashflow nach Steuern', key: 'cashflowNachSteuern' },
                { label: 'EK-Rendite', key: 'eigenkapitalrendite' },
                { label: 'EK-Rendite nach Steuern', key: 'eigenkapitalrenditeNachSteuern' }
              ].map(({ label, key }) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-slate-400 text-sm">{label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-white font-semibold">
                      {key.includes('Rendite') 
                        ? formatPercent(ergebnis.basis[key])
                        : formatCurrency(ergebnis.basis[key])
                      }
                    </span>
                    <span className="text-slate-500">→</span>
                    <span className={`font-semibold ${
                      ergebnis.szenario[key] >= ergebnis.basis[key]
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}>
                      {key.includes('Rendite') 
                        ? formatPercent(ergebnis.szenario[key])
                        : formatCurrency(ergebnis.szenario[key])
                      }
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Differenz */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              {ergebnis.differenz.cashflow >= 0 ? (
                <TrendingUp className="w-5 h-5 text-green-400" />
              ) : (
                <TrendingDown className="w-5 h-5 text-red-400" />
              )}
              Auswirkungen
            </h4>
            
            <div className="space-y-4">
              {[
                { label: 'Cashflow Differenz', key: 'cashflow' },
                { label: 'Cashflow n. Steuern Diff.', key: 'cashflowNachSteuern' },
                { label: 'EK-Rendite Differenz', key: 'eigenkapitalrendite' },
                { label: 'EK-Rendite n. Steuern Diff.', key: 'eigenkapitalrenditeNachSteuern' }
              ].map(({ label, key }) => {
                const diff = ergebnis.differenz[key];
                const isPositive = diff >= 0;
                
                return (
                  <div key={key} className="p-3 bg-slate-750 rounded border border-slate-600">
                    <p className="text-xs text-slate-400 mb-1">{label}</p>
                    <p className={`text-lg font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                      {isPositive ? '+' : ''}
                      {key.includes('Rendite') 
                        ? formatPercent(diff)
                        : formatCurrency(diff)
                      }
                    </p>
                  </div>
                );
              })}
            </div>

            {ergebnis.differenz.cashflowNachSteuern < -5000 && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-700/50 rounded flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">
                  <strong>Warnung:</strong> Dieses Szenario führt zu einem deutlich negativen Cashflow!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SzenarienRechner;