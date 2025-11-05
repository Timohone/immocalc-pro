import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { usePortfolioKennzahlen } from '../../hooks/useKennzahlen';
import { formatCurrency } from '../../utils/formatters';

const CashflowChart = ({ immobilien }) => {
  const { immobilienMitKennzahlen } = usePortfolioKennzahlen(immobilien);

  if (!immobilien || immobilien.length === 0) {
    return null;
  }

  // Prepare chart data
  const chartData = immobilienMitKennzahlen.map(immo => ({
    name: immo.name?.substring(0, 20) || 'Unbenannt',
    cashflow: Math.round(immo.kennzahlen.cashflow),
    jahresmiete: Math.round(immo.kennzahlen.jahresBruttoMiete),
    kosten: Math.round(
      immo.kennzahlen.jahresBruttoMiete - immo.kennzahlen.jahresNettoMiete + immo.kennzahlen.zinskosten
    )
  }));

  // Custom tooltip
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

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Cashflow-Übersicht</h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ color: '#94a3b8' }}
            iconType="square"
          />
          <Bar 
            dataKey="jahresmiete" 
            name="Jahresmiete"
            fill="#10b981" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="kosten" 
            name="Kosten"
            fill="#ef4444" 
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="cashflow" 
            name="Cashflow"
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.cashflow >= 0 ? '#10b981' : '#ef4444'} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CashflowChart;