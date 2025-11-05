import React, { useState } from 'react';
import { Edit2, Trash2, MapPin, TrendingUp, TrendingDown, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatPercent } from '../../utils/formatters';
import { useKennzahlen } from '../../hooks/useKennzahlen';

const ImmobilienCard = ({ immobilie, onEdit, onDelete }) => {
  const { kennzahlen, bewertungen } = useKennzahlen(immobilie);
  const [showDetails, setShowDetails] = useState(false);

  if (!kennzahlen) return null;

  const cashflowPositive = kennzahlen.cashflow >= 0;
  const hasNotizen = immobilie.notizen && immobilie.notizen.trim().length > 0;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-all overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">
              {immobilie.name || 'Unbenannte Immobilie'}
            </h3>
            {immobilie.adresse && (
              <div className="flex items-center gap-1 text-sm text-slate-400">
                <MapPin className="w-3 h-3" />
                <span>{immobilie.adresse}</span>
              </div>
            )}
            {hasNotizen && (
              <div className="flex items-center gap-1 text-xs text-blue-400 mt-1">
                <MessageSquare className="w-3 h-3" />
                <span>Notizen vorhanden</span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(immobilie)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-blue-400"
              title="Bearbeiten"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(immobilie.id)}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-slate-400 hover:text-red-400"
              title="Löschen"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Kennzahlen Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-slate-400 mb-1">Kaufpreis</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(parseFloat(immobilie.kaufpreis))}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Eigenkapital</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(kennzahlen.eigenkapital)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Jahresmiete</p>
          <p className="text-sm font-semibold text-white">
            {formatCurrency(kennzahlen.jahresBruttoMiete)}
          </p>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Cashflow p.a.</p>
          <div className="flex items-center gap-1">
            {cashflowPositive ? (
              <TrendingUp className="w-3 h-3 text-green-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
            <p className={`text-sm font-semibold ${cashflowPositive ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(kennzahlen.cashflow)}
            </p>
          </div>
        </div>
      </div>

      {/* Renditen */}
      <div className="p-4 border-t border-slate-700 bg-slate-750">
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-xs text-slate-400 mb-1">Brutto</p>
            <p className={`text-sm font-semibold ${bewertungen?.bruttoMietrendite?.farbe || 'text-white'}`}>
              {formatPercent(kennzahlen.bruttoMietrendite)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-slate-400 mb-1">Netto</p>
            <p className={`text-sm font-semibold ${bewertungen?.nettoMietrendite?.farbe || 'text-white'}`}>
              {formatPercent(kennzahlen.nettoMietrendite)}
            </p>
          </div>
          
          <div>
            <p className="text-xs text-slate-400 mb-1">EK</p>
            <p className={`text-sm font-semibold ${bewertungen?.eigenkapitalrendite?.farbe || 'text-white'}`}>
              {formatPercent(kennzahlen.eigenkapitalrendite)}
            </p>
          </div>
        </div>
      </div>

      {/* Steuer Info (wenn vorhanden) */}
      {immobilie.steuersatz && (
        <div className="px-4 py-2 border-t border-slate-700 bg-purple-900/10">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Cashflow nach Steuern:</span>
            <span className={`font-semibold ${kennzahlen.cashflowNachSteuern >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(kennzahlen.cashflowNachSteuern)}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-slate-400">EK-Rendite n.St.:</span>
            <span className="text-purple-400 font-semibold">
              {formatPercent(kennzahlen.eigenkapitalrenditeNachSteuern)}
            </span>
          </div>
        </div>
      )}

      {/* DSCR Warning */}
      {kennzahlen.dscr < 1.2 && (
        <div className="px-4 py-2 bg-yellow-900/20 border-t border-yellow-700/50">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-yellow-400 font-medium">⚠️ DSCR: {kennzahlen.dscr.toFixed(2)}</span>
            <span className="text-slate-400">Niedrige Deckungsrate</span>
          </div>
        </div>
      )}

      {/* Notizen Preview (collapsible) */}
      {hasNotizen && (
        <>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-2 bg-slate-750 hover:bg-slate-700 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300 transition-colors"
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="w-3 h-3" />
              Notizen anzeigen
            </span>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          
          {showDetails && (
            <div className="px-4 py-3 bg-slate-750 border-t border-slate-700">
              <p className="text-xs text-slate-300 whitespace-pre-wrap">
                {immobilie.notizen.length > 150 
                  ? immobilie.notizen.substring(0, 150) + '...' 
                  : immobilie.notizen
                }
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImmobilienCard;