import React from 'react';
import { Target, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { berechneBreakEven } from '../../services/calculationService';
import { formatCurrency, formatPercent } from '../../utils/formatters';

const BreakEvenAnalyse = ({ immobilie }) => {
  const breakEven = berechneBreakEven(immobilie);

  const rentabilitaetsKlasse = () => {
    if (!breakEven.istRentabel) return { text: 'Nicht rentabel', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    if (breakEven.jahreZurAmortisation < 10) return { text: 'Sehr rentabel', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    if (breakEven.jahreZurAmortisation < 20) return { text: 'Rentabel', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
    return { text: 'Langfristig rentabel', color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
  };

  const klasse = rentabilitaetsKlasse();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`${klasse.bg} border ${klasse.border} rounded-lg p-6`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Break-Even Analyse</h3>
            <p className={`text-lg font-semibold ${klasse.color}`}>{klasse.text}</p>
          </div>
          <Target className={`w-12 h-12 ${klasse.color}`} />
        </div>
      </div>

      {/* Main Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Break-Even Miete */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <h4 className="text-sm text-slate-400">Break-Even Miete</h4>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {formatCurrency(breakEven.breakEvenMieteMonatlich)}
          </p>
          <p className="text-xs text-slate-400">pro Monat</p>
          <p className="text-sm text-slate-300 mt-2">
            {formatCurrency(breakEven.breakEvenMiete)} / Jahr
          </p>
        </div>

        {/* Jahre zur Amortisation */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <Clock className="w-5 h-5 text-purple-400" />
            </div>
            <h4 className="text-sm text-slate-400">Amortisationszeit</h4>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {breakEven.jahreZurAmortisation === Infinity 
              ? '∞' 
              : Math.round(breakEven.jahreZurAmortisation)
            }
          </p>
          <p className="text-xs text-slate-400">Jahre (nur Cashflow)</p>
          <p className="text-sm text-slate-300 mt-2">
            {breakEven.jahreZurAmortisationMitWertsteigerung === Infinity 
              ? '∞' 
              : Math.round(breakEven.jahreZurAmortisationMitWertsteigerung)
            } Jahre (mit Wertsteigerung)
          </p>
        </div>

        {/* Break-Even Kaufpreis */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/10 rounded-lg">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <h4 className="text-sm text-slate-400">Break-Even Kaufpreis</h4>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {formatCurrency(breakEven.breakEvenKaufpreis)}
          </p>
          <p className="text-xs text-slate-400">bei {formatPercent(breakEven.gewuenschteRendite)} Rendite</p>
          <p className={`text-sm font-semibold mt-2 ${
            breakEven.differenzZumMarktpreis > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {breakEven.differenzZumMarktpreis > 0 ? '+' : ''}
            {formatCurrency(breakEven.differenzZumMarktpreis)}
          </p>
        </div>

        {/* Gewünschte Rendite */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-400" />
            </div>
            <h4 className="text-sm text-slate-400">Ziel-Rendite</h4>
          </div>
          <p className="text-2xl font-bold text-white mb-1">
            {formatPercent(breakEven.gewuenschteRendite)}
          </p>
          <p className="text-xs text-slate-400">Gewünschte EK-Rendite</p>
          <p className={`text-sm font-semibold mt-2 ${
            breakEven.istRentabel ? 'text-green-400' : 'text-red-400'
          }`}>
            {breakEven.istRentabel ? '✓ Erreicht' : '✗ Nicht erreicht'}
          </p>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <h4 className="font-semibold text-white mb-4">Detaillierte Analyse</h4>
        
        <div className="space-y-4">
          {/* Vergleich aktuelle vs Break-Even Miete */}
          <div className="bg-slate-750 rounded-lg p-4 border border-slate-600">
            <h5 className="text-sm font-semibold text-slate-300 mb-3">Mieten-Vergleich</h5>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Aktuelle Monatsmiete</p>
                <p className="text-lg font-semibold text-white">
                  {formatCurrency(parseFloat(immobilie.jahresmiete) / 12)}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Break-Even Monatsmiete</p>
                <p className="text-lg font-semibold text-blue-400">
                  {formatCurrency(breakEven.breakEvenMieteMonatlich)}
                </p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-600">
              <p className="text-sm text-slate-300">
                {parseFloat(immobilie.jahresmiete) / 12 > breakEven.breakEvenMieteMonatlich ? (
                  <span className="text-green-400">✓ Aktuelle Miete liegt über Break-Even</span>
                ) : (
                  <span className="text-red-400">⚠ Aktuelle Miete liegt unter Break-Even</span>
                )}
              </p>
            </div>
          </div>

          {/* Kaufpreis-Analyse */}
          <div className="bg-slate-750 rounded-lg p-4 border border-slate-600">
            <h5 className="text-sm font-semibold text-slate-300 mb-3">Kaufpreis-Bewertung</h5>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Tatsächlicher Kaufpreis:</span>
                <span className="text-white font-semibold">{formatCurrency(parseFloat(immobilie.kaufpreis))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Fair Value (bei 6% Rendite):</span>
                <span className="text-blue-400 font-semibold">{formatCurrency(breakEven.breakEvenKaufpreis)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-600">
                <span className="text-slate-400">Differenz:</span>
                <span className={`font-bold ${breakEven.differenzZumMarktpreis > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {breakEven.differenzZumMarktpreis > 0 ? 'Unter Fair Value' : 'Über Fair Value'}
                  <br />
                  <span className="text-xs">
                    ({breakEven.differenzZumMarktpreis > 0 ? '+' : ''}{formatCurrency(breakEven.differenzZumMarktpreis)})
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Empfehlungen */}
          <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4">
            <h5 className="text-sm font-semibold text-blue-300 mb-2 flex items-center gap-2">
              💡 Empfehlungen
            </h5>
            <ul className="text-sm text-blue-200 space-y-1">
              {breakEven.jahreZurAmortisation > 20 && (
                <li>• Langfristige Investition - Wertsteigerung entscheidend</li>
              )}
              {parseFloat(immobilie.jahresmiete) / 12 < breakEven.breakEvenMieteMonatlich && (
                <li>• Mieterhöhung prüfen um Break-Even zu erreichen</li>
              )}
              {breakEven.differenzZumMarktpreis < 0 && (
                <li>• Kaufpreis liegt über Fair Value - Verhandlung empfohlen</li>
              )}
              {breakEven.istRentabel && breakEven.jahreZurAmortisation < 15 && (
                <li>• Gute Investition mit attraktiver Amortisationszeit</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakEvenAnalyse;