import React, { useState } from 'react';
import { TrendingUp, Target, Calculator, GitCompare, BarChart3 } from 'lucide-react';
import KennzahlenTable from './KennzahlenTable';
import CashflowChart from './CashflowChart';
import RenditeVergleich from './RenditeVergleich';
import SzenarienRechner from './SzenarienRechner';
import BreakEvenAnalyse from './BreakEvenAnalyse';
import ZehnjahresSimulation from './ZehnjahresSimulation';
import VergleichsAnsicht from './VergleichsAnsicht';

const SimulationView = ({ immobilien }) => {
  const [activeSubTab, setActiveSubTab] = useState('uebersicht');
  const [selectedImmobilie, setSelectedImmobilie] = useState(null);

  if (!immobilien || immobilien.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Keine Daten für Simulation
          </h3>
          <p className="text-slate-400">
            Füge Immobilien im Dashboard hinzu, um die Simulation und Analyse zu nutzen.
          </p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'uebersicht', label: 'Übersicht', icon: TrendingUp },
    { id: 'szenarien', label: 'Szenarien', icon: Calculator },
    { id: 'breakeven', label: 'Break-Even', icon: Target },
    { id: '10jahre', label: '10-Jahres-Prognose', icon: BarChart3 },
    { id: 'vergleich', label: 'Vergleich', icon: GitCompare }
  ];

  return (
    <div className="space-y-6">
      {/* Sub Navigation */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-2">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  activeSubTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Immobilien-Auswahl für Einzelanalysen */}
      {(activeSubTab === 'szenarien' || activeSubTab === 'breakeven' || activeSubTab === '10jahre') && (
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Immobilie auswählen
          </label>
          <select
            value={selectedImmobilie?.id || ''}
            onChange={(e) => {
              const immo = immobilien.find(i => i.id === e.target.value);
              setSelectedImmobilie(immo);
            }}
            className="w-full md:w-96 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Immobilie wählen --</option>
            {immobilien.map((immo) => (
              <option key={immo.id} value={immo.id}>
                {immo.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Content */}
      {activeSubTab === 'uebersicht' && (
        <div className="space-y-6">
          <RenditeVergleich immobilien={immobilien} />
          <CashflowChart immobilien={immobilien} />
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Detaillierte Kennzahlen
            </h3>
            <KennzahlenTable immobilien={immobilien} />
          </div>
        </div>
      )}

      {activeSubTab === 'szenarien' && (
        <>
          {selectedImmobilie ? (
            <SzenarienRechner immobilie={selectedImmobilie} />
          ) : (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
              <Calculator className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                Bitte wähle eine Immobilie aus, um Szenarien zu berechnen.
              </p>
            </div>
          )}
        </>
      )}

      {activeSubTab === 'breakeven' && (
        <>
          {selectedImmobilie ? (
            <BreakEvenAnalyse immobilie={selectedImmobilie} />
          ) : (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
              <Target className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                Bitte wähle eine Immobilie aus für die Break-Even Analyse.
              </p>
            </div>
          )}
        </>
      )}

      {activeSubTab === '10jahre' && (
        <>
          {selectedImmobilie ? (
            <ZehnjahresSimulation immobilie={selectedImmobilie} />
          ) : (
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
              <BarChart3 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">
                Bitte wähle eine Immobilie aus für die 10-Jahres-Prognose.
              </p>
            </div>
          )}
        </>
      )}

      {activeSubTab === 'vergleich' && (
        <VergleichsAnsicht immobilien={immobilien} />
      )}
    </div>
  );
};

export default SimulationView;