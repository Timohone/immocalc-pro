import React, { useState } from 'react';
import { ArrowUpDown, AlertTriangle } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { usePortfolioKennzahlen } from '../../hooks/useKennzahlen';

const KennzahlenTable = ({ immobilien }) => {
  const { immobilienMitKennzahlen } = usePortfolioKennzahlen(immobilien);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  if (!immobilien || immobilien.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 text-center">
        <p className="text-slate-400">Keine Immobilien für die Simulation vorhanden.</p>
      </div>
    );
  }

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedImmobilien = [...immobilienMitKennzahlen].sort((a, b) => {
    let valueA, valueB;

    if (sortBy === 'name') {
      valueA = a.name || '';
      valueB = b.name || '';
      return sortOrder === 'asc' 
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    valueA = a.kennzahlen?.[sortBy] || 0;
    valueB = b.kennzahlen?.[sortBy] || 0;
    
    return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
  });

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-blue-400 transition-colors"
    >
      {label}
      <ArrowUpDown className="w-3 h-3" />
    </button>
  );

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-750 border-b border-slate-700">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                <SortButton field="name" label="Immobilie" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                <SortButton field="anschaffungskosten" label="Anschaffung" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                <SortButton field="eigenkapital" label="Eigenkapital" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                <SortButton field="jahresBruttoMiete" label="Jahresmiete" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                <SortButton field="cashflow" label="Cashflow p.a." />
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                <SortButton field="bruttoMietrendite" label="Brutto %" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                <SortButton field="nettoMietrendite" label="Netto %" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                <SortButton field="eigenkapitalrendite" label="EK-Rendite %" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                <SortButton field="dscr" label="DSCR" />
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {sortedImmobilien.map((immobilie) => {
              const k = immobilie.kennzahlen;
              const cashflowPositive = k.cashflow >= 0;
              const dscrKritisch = k.dscr < 1.0;
              const dscrGrenzwertig = k.dscr >= 1.0 && k.dscr < 1.2;

              return (
                <tr key={immobilie.id} className="hover:bg-slate-750 transition-colors">
                  <td className="px-4 py-3 text-sm text-white font-medium">
                    <div className="flex items-center gap-2">
                      {immobilie.name}
                      {dscrKritisch && (
                        <AlertTriangle className="w-4 h-4 text-red-400" title="Kritischer DSCR" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right">
                    {formatCurrency(k.anschaffungskosten)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right">
                    {formatCurrency(k.eigenkapital)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right">
                    {formatCurrency(k.jahresBruttoMiete)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold ${
                    cashflowPositive ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(k.cashflow)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right">
                    {formatPercent(k.bruttoMietrendite)}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300 text-right">
                    {formatPercent(k.nettoMietrendite)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold ${
                    k.eigenkapitalrendite >= 6 ? 'text-green-400' : 
                    k.eigenkapitalrendite >= 3 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formatPercent(k.eigenkapitalrendite)}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-semibold ${
                    dscrKritisch ? 'text-red-400' :
                    dscrGrenzwertig ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {k.dscr.toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KennzahlenTable;