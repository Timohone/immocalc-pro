import React, { useState } from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, DollarSign, PiggyBank } from 'lucide-react';
import { simuliere10Jahre } from '../../services/calculationService';
import { formatCurrency, formatPercent } from '../../utils/formatters';

const ZehnjahresSimulation = ({ immobilie }) => {
  const [simulation] = useState(() => simuliere10Jahre(immobilie));
  const [chartType, setChartType] = useState('vermoegen');

  const letzterEintrag = simulation[simulation.length - 1];
  const ersterEintrag = simulation[0];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const chartConfigs = {
    vermoegen: {
      title: 'Vermögensentwicklung',
      data: simulation.map(s => ({
        jahr: `Jahr ${s.jahr}`,
        'Immobilienwert': Math.round(s.immobilienwert),
        'Eigenkapital': Math.round(s.eigenkapital),
        'Kum. Cashflow': Math.round(s.kumulierterCashflow)
      })),
      lines: [
        { dataKey: 'Immobilienwert', color: '#3b82f6' },
        { dataKey: 'Eigenkapital', color: '#10b981' },
        { dataKey: 'Kum. Cashflow', color: '#f59e0b' }
      ]
    },
    cashflow: {
      title: 'Cashflow-Entwicklung',
      data: simulation.map(s => ({
        jahr: `Jahr ${s.jahr}`,
        'Cashflow': Math.round(s.cashflow),
        'Cashflow n. Steuern': Math.round(s.cashflowNachSteuern)
      })),
      lines: [
        { dataKey: 'Cashflow', color: '#3b82f6' },
        { dataKey: 'Cashflow n. Steuern', color: '#10b981' }
      ]
    },
    schulden: {
      title: 'Schuldenabbau',
      data: simulation.map(s => ({
        jahr: `Jahr ${s.jahr}`,
        'Restschuld': Math.round(s.restschuld),
        'Eigenkapital': Math.round(s.eigenkapital)
      })),
      lines: [
        { dataKey: 'Restschuld', color: '#ef4444' },
        { dataKey: 'Eigenkapital', color: '#10b981' }
      ]
    }
  };

  const config = chartConfigs[chartType];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h4 className="text-sm text-slate-400">Gesamtrendite (10 Jahre)</h4>
          </div>
          <p className="text-3xl font-bold text-green-400 mb-1">
            {formatPercent(letzterEintrag.roi)}
          </p>
          <p className="text-xs text-slate-400">
            Return on Investment
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="text-sm text-slate-400">Gesamtvermögen</h4>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {formatCurrency(letzterEintrag.gesamtvermoegen)}
          </p>
          <p className="text-xs text-green-400">
            +{formatCurrency(letzterEintrag.gesamtvermoegen - parseFloat(immobilie.eigenkapital))}
          </p>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <PiggyBank className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="text-sm text-slate-400">Kum. Cashflow (nach Steuern)</h4>
          </div>
          <p className="text-3xl font-bold text-white mb-1">
            {formatCurrency(letzterEintrag.kumulierterCashflow)}
          </p>
          <p className="text-xs text-slate-400">
            {formatCurrency(letzterEintrag.kumulierterCashflow / 10)} / Jahr ⌀
          </p>
        </div>
      </div>

      {/* Chart */}
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
          <LineChart data={config.data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis 
              dataKey="jahr" 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
            />
            <YAxis 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ color: '#94a3b8' }}
              iconType="line"
            />
            {config.lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                stroke={line.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-750 border-b border-slate-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase">Jahr</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Immobilienwert</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Restschuld</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Eigenkapital</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Cashflow n.St.</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">Kum. CF</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {simulation.map((jahr) => (
                <tr key={jahr.jahr} className="hover:bg-slate-750 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">Jahr {jahr.jahr}</td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right">
                    {formatCurrency(jahr.immobilienwert)}
                  </td>
                  <td className="px-4 py-3 text-sm text-red-400 text-right">
                    {formatCurrency(jahr.restschuld)}
                  </td>
                  <td className="px-4 py-3 text-sm text-green-400 text-right">
                    {formatCurrency(jahr.eigenkapital)}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-400 text-right">
                    {formatCurrency(jahr.cashflowNachSteuern)}
                  </td>
                  <td className="px-4 py-3 text-sm text-purple-400 text-right">
                    {formatCurrency(jahr.kumulierterCashflow)}
                  </td>
                  <td className="px-4 py-3 text-sm text-white text-right font-semibold">
                    {formatPercent(jahr.roi)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ZehnjahresSimulation;