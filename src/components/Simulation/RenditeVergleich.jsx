import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { usePortfolioKennzahlen } from '../../hooks/useKennzahlen';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { TrendingUp, TrendingDown, Award } from 'lucide-react';

const RenditeVergleich = ({ immobilien }) => {
  const { immobilienMitKennzahlen, getTopPerformer, portfolioStats } = usePortfolioKennzahlen(immobilien);

  if (!immobilien || immobilien.length === 0) {
    return null;
  }

  // Top 3 Performers
  const topPerformer = getTopPerformer('eigenkapitalrendite', 3);

  // Pie Chart Data für Eigenkapital-Verteilung
  const pieData = immobilienMitKennzahlen.map((immo, index) => ({
    name: immo.name?.substring(0, 15) || 'Unbenannt',
    value: immo.kennzahlen.eigenkapital,
    rendite: immo.kennzahlen.eigenkapitalrendite
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  // Custom tooltip for pie chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 shadow-lg">
          <p className="text-white font-semibold mb-1">{data.name}</p>
          <p className="text-sm text-slate-300">
            Eigenkapital: {formatCurrency(data.value)}
          </p>
          <p className="text-sm text-green-400">
            Rendite: {formatPercent(data.payload.rendite)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Top Performer Cards */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-yellow-400" />
          Top Performer (Eigenkapitalrendite)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPerformer.map((immo, index) => {
            const medals = ['🥇', '🥈', '🥉'];
            const k = immo.kennzahlen;
            
            return (
              <div 
                key={immo.id}
                className="bg-slate-750 rounded-lg p-4 border border-slate-600"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-2xl">{medals[index]}</span>
                  <div className={`px-2 py-1 rounded text-xs font-semibold ${
                    k.eigenkapitalrendite >= 10 ? 'bg-green-500/20 text-green-400' :
                    k.eigenkapitalrendite >= 6 ? 'bg-blue-500/20 text-blue-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {formatPercent(k.eigenkapitalrendite)}
                  </div>
                </div>
                
                <h4 className="text-white font-semibold mb-2">{immo.name}</h4>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Cashflow:</span>
                    <span className={k.cashflow >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {formatCurrency(k.cashflow)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Netto-Rendite:</span>
                    <span className="text-white">{formatPercent(k.nettoMietrendite)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DSCR:</span>
                    <span className={
                      k.dscr >= 1.5 ? 'text-green-400' :
                      k.dscr >= 1.2 ? 'text-yellow-400' : 'text-red-400'
                    }>
                      {k.dscr.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portfolio Zusammenfassung & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Eigenkapital-Verteilung */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Eigenkapital-Verteilung
          </h3>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
                iconType="circle"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Portfolio Kennzahlen */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Portfolio Kennzahlen
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-slate-750 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-400" />
                <span className="text-slate-300">Gesamt-Cashflow p.a.</span>
              </div>
              <span className={`font-semibold ${
                portfolioStats.gesamtCashflow >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(portfolioStats.gesamtCashflow)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-750 rounded-lg">
              <span className="text-slate-300">Monatlicher Cashflow</span>
              <span className={`font-semibold ${
                portfolioStats.gesamtCashflowMonatlich >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {formatCurrency(portfolioStats.gesamtCashflowMonatlich)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-750 rounded-lg">
              <span className="text-slate-300">Portfolio-Rendite (EK)</span>
              <span className="text-blue-400 font-semibold">
                {formatPercent(portfolioStats.portfolioRendite)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-750 rounded-lg">
              <span className="text-slate-300">Ø Brutto-Rendite</span>
              <span className="text-white font-semibold">
                {formatPercent(portfolioStats.durchschnittlicheBruttoRendite)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-750 rounded-lg">
              <span className="text-slate-300">Ø Netto-Rendite</span>
              <span className="text-white font-semibold">
                {formatPercent(portfolioStats.durchschnittlicheNettoRendite)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-750 rounded-lg">
              <span className="text-slate-300">Eigenkapitalquote</span>
              <span className="text-white font-semibold">
                {formatPercent(portfolioStats.eigenkapitalquote)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RenditeVergleich;