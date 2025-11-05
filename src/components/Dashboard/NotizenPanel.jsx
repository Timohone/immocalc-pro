import React, { useState } from 'react';
import { MessageSquare, Save, X, Plus } from 'lucide-react';

const NotizenPanel = ({ immobilie, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notizen, setNotizen] = useState(immobilie.notizen || '');

  const handleSave = async () => {
    await onSave({ ...immobilie, notizen });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setNotizen(immobilie.notizen || '');
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-400" />
          <h3 className="font-semibold text-white">Notizen</h3>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm transition-colors"
          >
            {notizen ? 'Bearbeiten' : 'Hinzufügen'}
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <textarea
            value={notizen}
            onChange={(e) => setNotizen(e.target.value)}
            placeholder="Notizen zur Immobilie hinzufügen..."
            rows={6}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded transition-colors"
            >
              <X className="w-4 h-4" />
              Abbrechen
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors"
            >
              <Save className="w-4 h-4" />
              Speichern
            </button>
          </div>
        </div>
      ) : (
        <div className="text-slate-300">
          {notizen ? (
            <p className="whitespace-pre-wrap">{notizen}</p>
          ) : (
            <p className="text-slate-500 italic">Keine Notizen vorhanden</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotizenPanel;