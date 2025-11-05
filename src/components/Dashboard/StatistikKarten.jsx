import React from 'react';
import { Building, DollarSign, TrendingUp, PieChart } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/formatters';

const StatistikKarten = ({ portfolioStats }) => {
  if (!portfolioStats) return null;

  const karten = [
    {
      titel: 'Gesamtinvestitionen',
      wert: formatCurrency(portfolioStats.gesamtAnschaffungskosten),
      icon: Building,
      farbe: 'blue',
      zusatz: `${portfolioStats.anzahlImmobilien} Immobilien`
    },
    {
      titel: 'Eigenkapital',
      wert: formatCurrency(portfolioStats.gesamtEigenkapital),
      icon: PieChart,
      farbe: 'green',
      zusatz: `${formatPercent(portfolioStats.eigenkapitalquote)} Quote`
    },
    {
      titel: 'Jahres-Cashflow',
      wert: formatCurrency(portfolioStats.gesamtCashflow),
      icon: DollarSign,
      farbe: portfolioStats.gesamtCashflow >= 0 ? 'green' : 'red',
      zusatz: `${formatCurrency(portfolioStats.gesamtCashflowMonatlich)}/Monat`
    },
    {
      titel: 'Portfolio-Rendite',
      wert: formatPercent(portfolioStats.portfolioRendite),
      icon: TrendingUp,
      farbe: portfolioStats.portfolioRendite >= 5 ? 'green' : 'yellow',
      zusatz: `Ø ${formatPercent(portfolioStats.durchschnittlicheEKRendite)} EK-Rendite`
    }
  ];

  const farbKlassen = {
    blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    green: 'bg-green-500/10 text-green-400 border-green-500/20',
    red: 'bg-red-500/10 text-red-400 border-red-500/20',
    yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {karten.map((karte, index) => {
        const Icon = karte.icon;
        return (
          <div
            key={index}
            className="bg-slate-800 rounded-lg border border-slate-700 p-4 hover:border-slate-600 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <p className="text-sm text-slate-400">{karte.titel}</p>
              <div className={`p-2 rounded-lg border ${farbKlassen[karte.farbe]}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            
            <p className="text-2xl font-bold text-white mb-1">
              {karte.wert}
            </p>
            
            <p className="text-xs text-slate-400">
              {karte.zusatz}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatistikKarten;