import React from 'react';
import ImmobilienCard from './ImmobilienCard';

const ImmobilienListe = ({ immobilien, onEdit, onDelete }) => {
  if (!immobilien || immobilien.length === 0) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="text-6xl mb-4">🏢</div>
          <h3 className="text-xl font-semibold text-white mb-2">
            Noch keine Immobilien
          </h3>
          <p className="text-slate-400">
            Füge deine erste Immobilie hinzu, um mit der Berechnung zu beginnen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {immobilien.map((immobilie) => (
        <ImmobilienCard
          key={immobilie.id}
          immobilie={immobilie}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ImmobilienListe;