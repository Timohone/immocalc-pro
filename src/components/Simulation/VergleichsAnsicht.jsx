import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { berechneKennzahlen } from '../../services/calculationService';

const VergleichsAnsicht = ({ immobilien }) => {
  const [selectedImmobilien, setSelectedImmobilien] = useState([]);
  const [chartType, setChartType] = useState('renditen');

  const toggleImmobilie = (id) => {
    if (selectedImmobilien.includes(id)) {
      setSelectedImmobilien(selectedImmobilien.filter(i => i !== id));
    } else if (selectedImmobilien.length < 4) {
      setSelectedImmobilien([...selectedImmobilien, id]);
    }
  };

  const vergleichsDaten = selectedImmobilien.map(id => {
    const immo = immobilien.find(i => i.id === id);
    const kennzahlen = berechneKennzahlen(immo);
    return {
      id: immo.id,
      name: immo.name,
      ...kennzahlen
    };
  });

  const chartConfigs = {
    renditen: {
      title: 'Renditen-Vergleich',
      data: vergleichsDaten.map(d => ({
        name: d.name.substring(0, 20),
        'Brutto': parseFloat(d.bruttoMietrendite.toFixed(2)),
        'Netto': parseFloat(d.nettoMietrendite.toFixed(2)),
        'EK': parseFloat(d.eigenkapitalrendite.toFixed(2)),
        'EK n.St.': parseFloat(d.eigenkapitalrenditeNachSteuern.toFixed(2))
      })),
      bars: [
        { dataKey: 'Brutto', color: '#3b82f6' },
        { dataKey: 'Netto', color: '#10b981' },
        { dataKey: 'EK', color: '#f59e0b' },
        { dataKey: 'EK n.St.', color: '#8b5cf6' }
      ]
    },
    cashflow: {
      title: 'Cashflow-Vergleich',
      data: vergleichsDaten.map(d => ({
        name: d.name.substring(0, 20),
        'Cashflow': Math.round(d.cashflow),
        'Nach Steuern': Math.round(d.cashflowNachSteuern)
      })),
      bars: [
        { dataKey: 'Cashflow', color: '#3b82f6' },
        { dataKey: 'Nach Steuern', color: '#10b981' }
      ]
    },
    kosten: {
      title: 'Kosten-Vergleich',
      data: vergleichsDaten.map(d => ({
        name: d.name.substring(0, 20),
        'Zinsen': Math.round(d.zinskosten),
        'Laufend': Math.round(d.laufendeKosten),
        'Verwaltung': Math.round(d.verwaltung),
        'Rücklagen': Math.round(d.ruecklagen)
      })),
      bars: [
        { dataKey: 'Zinsen', color: '#ef4444' },
        { dataKey: 'Laufend', color: '#f59e0b' },
        { dataKey: 'Verwaltung', color: '#8b5cf6' },
        { dataKey: 'Rücklagen', color: '#06b6d4' }
      ]
    }
  };

  const radarData = [
    { 
      kategorie: 'Brutto-Rendite',
      ...Object.fromEntries(vergleichsDaten.map(d => [d.name.substring(0, 15), d.bruttoMietrendite]))
    },
    { 
      kategorie: 'Netto-Rendite',
      ...Object.fromEntries(vergleichsDaten.map(d => [d.name.substring(0, 15), d.nettoMietrendite]))
    },
    { 
      kategorie: 'EK-Rendite',
      ...Object.fromEntries(vergleichsDaten.map(d => [d.name.substring(0, 15), d.eigenkapitalrendite]))
    },
    { 
      kategorie: 'DSCR',
      ...Object.fromEntries(vergleichsDaten.map(d => [d.name.substring(0, 15), d.dscr * 10]))
    }
  ];

  const config = chartConfigs[chartType];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  return (
    <div className="space-y-6">
      {/* Selection */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Immobilien auswählen (max. 4)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {immobilien.map((immo) => {
            const isSelected = selectedImmobilien.includes(immo.id);
            const isDisabled = !isSelected && selectedImmobilien.length >= 4;
            
            return (
              <button
                key={immo.id}
                onClick={() => !isDisabled && toggleImmobilie(immo.id)}
                disabled={isDisabled}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'border-blue-500 bg-blue-500/10'
                    : isDisabled
                    ? 'border-slate-700 bg-slate-750 opacity-50 cursor-not-allowed'
                    : 'border-slate-600 bg-slate-750 hover:border-slate-500'
                }`}
              >
                <h4 className="font-semibold text-white text-sm">{immo.name}</h4>
                <p className="text-xs text-slate-400 mt-1">{immo.adresse}</p>
                {isSelected && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">
                    Ausgewählt
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedImmobilien.length > 0 && (
        <>
          {/* Charts */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">{config.title}</h3>
              
              <div className="flex gap-2">
                {Object.keys(chartConfigs).map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      chartType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    {chartConfigs[type].title}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={config.data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <YAxis 
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }}
                  labelStyle={{ color: '#ffffff' }}
                />
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
                {config.bars.map((bar) => (
                  <Bar
                    key={bar.dataKey}
                    dataKey={bar.dataKey}
                    fill={bar.color}
                    radius={[4, 4, 0, 0]}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Radar Chart */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Performance Radar</h3>
            
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis 
                  dataKey="kategorie" 
                  tick={{ fill: '#94a3b8', fontSize: 12 }}
                />
                <PolarRadiusAxis stroke="#334155" />
                {vergleichsDaten.map((immo, index) => (
                  <Radar
                    key={immo.id}
                    name={immo.name.substring(0, 15)}
                    dataKey={immo.name.substring(0, 15)}
                    stroke={colors[index]}
                    fill={colors[index]}
                    fillOpacity={0.3}
                  />
                ))}
                <Legend wrapperStyle={{ color: '#94a3b8' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Comparison Table */}
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-750 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Kennzahl</th>
                    {vergleichsDaten.map((immo) => (
                      <th key={immo.id} className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">
                        {immo.name.substring(0, 20)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700">
                  {[
                    { label: 'Anschaffungskosten', key: 'anschaffungskosten', format: 'currency' },
                    { label: 'Eigenkapital', key: 'eigenkapital', format: 'currency' },
                    { label: 'Brutto-Rendite', key: 'bruttoMietrendite', format: 'percent' },
                    { label: 'Netto-Rendite', key: 'nettoMietrendite', format: 'percent' },
                    { label: 'EK-Rendite', key: 'eigenkapitalrendite', format: 'percent' },
                    { label: 'EK-Rendite n.St.', key: 'eigenkapitalrenditeNachSteuern', format: 'percent' },
                    { label: 'Cashflow p.a.', key: 'cashflow', format: 'currency' },
                    { label: 'Cashflow n.St.', key: 'cashflowNachSteuern', format: 'currency' },
                    { label: 'DSCR', key: 'dscr', format: 'number' }
                  ].map((row) => (
                    <tr key={row.key} className="hover:bg-slate-750 transition-colors">
                      <td className="px-4 py-3 text-sm text-white font-medium">{row.label}</td>
                      {vergleichsDaten.map((immo) => {
                        const value = immo[row.key];
                        const formatted = row.format === 'currency' 
                          ? formatCurrency(value)
                          : row.format === 'percent'
                          ? formatPercent(value)
                          : value.toFixed(2);
                        
                        return (
                          <td key={immo.id} className="px-4 py-3 text-sm text-slate-300 text-right">
                            {formatted}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VergleichsAnsicht;