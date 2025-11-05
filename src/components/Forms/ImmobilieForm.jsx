import React, { useState, useEffect } from 'react';
import { X, Save, Home, MapPin, Sparkles } from 'lucide-react';
import FormInput from './FormInput';
import FormSection from './FormSection';
import SteuerSection from './SteuerSection';
import { DEFAULT_IMMOBILIE, IMMOBILIEN_TYPEN } from '../../utils/constants';
import { validateImmobilieForm } from '../../utils/validators';
import { berechneKennzahlen } from '../../services/calculationService';
import { loadSettings, calculateAutoFillValues } from '../../services/settingsService';

const ImmobilieForm = ({ immobilie = null, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...DEFAULT_IMMOBILIE,
    steuersatz: '',
    abschreibungProzent: '2.5',
    abschreibungJahre: '40',
    notizen: ''
  });
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [kennzahlenPreview, setKennzahlenPreview] = useState(null);
  const [settings, setSettings] = useState(null);
  const [autoFilledFields, setAutoFilledFields] = useState(new Set());

  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
  }, []);

  useEffect(() => {
    if (immobilie) {
      setFormData({
        ...DEFAULT_IMMOBILIE,
        ...immobilie,
        steuersatz: immobilie.steuersatz || '',
        abschreibungProzent: immobilie.abschreibungProzent || '2.5',
        abschreibungJahre: immobilie.abschreibungJahre || '40',
        notizen: immobilie.notizen || ''
      });
      setAutoFilledFields(new Set());
    } else {
      setFormData({
        ...DEFAULT_IMMOBILIE,
        steuersatz: '',
        abschreibungProzent: '2.5',
        abschreibungJahre: '40',
        notizen: ''
      });
      setAutoFilledFields(new Set());
    }
  }, [immobilie]);

  // Auto-Fill bei Kaufpreis-Änderung
  useEffect(() => {
    if (!settings || !settings.autoFillEnabled || !formData.kaufpreis || immobilie) {
      return;
    }

    const kaufpreis = parseFloat(formData.kaufpreis);
    if (kaufpreis > 0) {
      const autoValues = calculateAutoFillValues(kaufpreis, settings);
      
      // Nur Felder auto-füllen die leer sind oder bereits auto-gefüllt wurden
      const newFormData = { ...formData };
      const newAutoFilled = new Set(autoFilledFields);
      
      Object.keys(autoValues).forEach(key => {
        if (!formData[key] || formData[key] === '' || autoFilledFields.has(key)) {
          newFormData[key] = autoValues[key];
          newAutoFilled.add(key);
        }
      });
      
      setFormData(newFormData);
      setAutoFilledFields(newAutoFilled);
    }
  }, [formData.kaufpreis, settings, immobilie]);

  // Live-Preview der Kennzahlen
  useEffect(() => {
    if (formData.kaufpreis && formData.eigenkapital && formData.jahresmiete) {
      try {
        const kennzahlen = berechneKennzahlen(formData);
        setKennzahlenPreview(kennzahlen);
      } catch (error) {
        setKennzahlenPreview(null);
      }
    }
  }, [formData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Wenn User manuell ändert, entferne aus autoFilledFields
    if (autoFilledFields.has(name) && type !== 'checkbox') {
      const newAutoFilled = new Set(autoFilledFields);
      newAutoFilled.delete(name);
      setAutoFilledFields(newAutoFilled);
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleAutoFillNow = () => {
    if (!settings || !formData.kaufpreis) return;
    
    const kaufpreis = parseFloat(formData.kaufpreis);
    if (kaufpreis > 0) {
      const autoValues = calculateAutoFillValues(kaufpreis, settings);
      setFormData(prev => ({
        ...prev,
        ...autoValues
      }));
      setAutoFilledFields(new Set(Object.keys(autoValues)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = validateImmobilieForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    
    setIsSaving(true);
    try {
      await onSave(formData);
      setFormData({
        ...DEFAULT_IMMOBILIE,
        steuersatz: '',
        abschreibungProzent: '2.5',
        abschreibungJahre: '40',
        notizen: ''
      });
      setErrors({});
      setAutoFilledFields(new Set());
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      ...DEFAULT_IMMOBILIE,
      steuersatz: '',
      abschreibungProzent: '2.5',
      abschreibungJahre: '40',
      notizen: ''
    });
    setErrors({});
    setAutoFilledFields(new Set());
    onCancel();
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">
          {immobilie ? 'Immobilie bearbeiten' : 'Neue Immobilie hinzufügen'}
        </h3>
        <button
          onClick={handleCancel}
          className="text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Auto-Fill Info */}
      {settings?.autoFillEnabled && !immobilie && autoFilledFields.size > 0 && (
        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700/50 rounded-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-blue-300 font-semibold mb-1">
                Auto-Fill aktiviert
              </p>
              <p className="text-xs text-blue-200">
                {autoFilledFields.size} Felder wurden automatisch basierend auf dem Kaufpreis ausgefüllt. 
                Du kannst alle Werte jederzeit manuell anpassen.
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Objekt-Details */}
        <FormSection title="Objekt-Details" color="blue">
          <FormInput
            label="Name der Immobilie"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="z.B. Mehrfamilienhaus Zürich"
            required
            error={errors.name}
          />
          
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-200">
              Immobilientyp
            </label>
            <select
              name="typ"
              value={formData.typ}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Typ wählen --</option>
              {IMMOBILIEN_TYPEN.map(typ => (
                <option key={typ} value={typ}>{typ}</option>
              ))}
            </select>
          </div>

          <FormInput
            label="Anzahl Zimmer"
            name="anzahlZimmer"
            type="number"
            value={formData.anzahlZimmer}
            onChange={handleChange}
            placeholder="z.B. 3.5"
            step="0.5"
          />

          <FormInput
            label="Wohnfläche"
            name="quadratmeter"
            type="number"
            value={formData.quadratmeter}
            onChange={handleChange}
            placeholder="85"
            suffix="m²"
          />

          <FormInput
            label="Baujahr"
            name="baujahr"
            type="number"
            value={formData.baujahr}
            onChange={handleChange}
            placeholder="1995"
          />

          <FormInput
            label="Stockwerk"
            name="stockwerk"
            value={formData.stockwerk}
            onChange={handleChange}
            placeholder="z.B. 2.OG oder EG"
          />
        </FormSection>

        {/* Adresse */}
        <FormSection title="Adresse" color="green">
          <FormInput
            label="Strasse & Hausnummer"
            name="strasse"
            value={formData.strasse}
            onChange={handleChange}
            placeholder="Musterstrasse 123"
          />
          
          <FormInput
            label="PLZ"
            name="plz"
            value={formData.plz}
            onChange={handleChange}
            placeholder="8000"
          />
          
          <FormInput
            label="Ort"
            name="ort"
            value={formData.ort}
            onChange={handleChange}
            placeholder="Zürich"
          />
        </FormSection>

        {/* Ausstattung */}
        <div className="bg-slate-750 rounded-lg p-4 border border-slate-600">
          <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Home className="w-4 h-4 text-blue-400" />
            Ausstattung & Extras
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="balkon"
                checked={formData.balkon}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Balkon</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="garten"
                checked={formData.garten}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Garten</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="lift"
                checked={formData.lift}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Lift</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="keller"
                checked={formData.keller}
                onChange={handleChange}
                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Keller</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Anzahl Parkplätze"
              name="parkplaetze"
              type="number"
              value={formData.parkplaetze}
              onChange={handleChange}
              placeholder="0"
            />

            <FormInput
              label="Letzte Renovation"
              name="renovation"
              value={formData.renovation}
              onChange={handleChange}
              placeholder="z.B. 2020 - Küche & Bad"
            />
          </div>
        </div>

        {/* Kaufdaten mit Auto-Fill Button */}
        <FormSection title="Kaufdaten" color="green">
          <div className="md:col-span-3 flex items-end gap-2">
            <div className="flex-1">
              <FormInput
                label="Kaufpreis"
                name="kaufpreis"
                type="number"
                value={formData.kaufpreis}
                onChange={handleChange}
                placeholder="448000"
                suffix="CHF"
                required
                error={errors.kaufpreis}
                hint={autoFilledFields.size === 0 ? "Weitere Felder werden automatisch berechnet" : ""}
              />
            </div>
            {!immobilie && formData.kaufpreis && (
              <button
                type="button"
                onClick={handleAutoFillNow}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors flex items-center gap-2 mb-1"
                title="Alle Felder neu berechnen"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden md:inline">Auto-Fill</span>
              </button>
            )}
          </div>

          <FormInput
            label="Nebenkosten"
            name="nebenkosten"
            type="number"
            value={formData.nebenkosten}
            onChange={handleChange}
            placeholder="36000"
            suffix="CHF"
            hint={autoFilledFields.has('nebenkosten') ? '✨ Automatisch berechnet' : 'Grundbuchgebühren, Notar, etc.'}
          />
          <FormInput
            label="Eigenkapital"
            name="eigenkapital"
            type="number"
            value={formData.eigenkapital}
            onChange={handleChange}
            placeholder="100000"
            suffix="CHF"
            required
            error={errors.eigenkapital}
            hint={autoFilledFields.has('eigenkapital') ? '✨ Automatisch berechnet' : ''}
          />
        </FormSection>

        {/* Finanzierung */}
        <FormSection title="Finanzierung" color="purple">
          <FormInput
            label="Zinssatz"
            name="zinssatz"
            type="number"
            value={formData.zinssatz}
            onChange={handleChange}
            placeholder="2.50"
            suffix="%"
            hint={autoFilledFields.has('zinssatz') ? '✨ Aus Einstellungen' : 'Jährlicher Zinssatz'}
          />
          <FormInput
            label="Tilgung"
            name="tilgung"
            type="number"
            value={formData.tilgung}
            onChange={handleChange}
            placeholder="1.00"
            suffix="%"
            hint={autoFilledFields.has('tilgung') ? '✨ Aus Einstellungen' : 'Jährliche Tilgungsrate'}
          />
        </FormSection>

        {/* Mieteinnahmen */}
        <FormSection title="Mieteinnahmen" color="green">
          <FormInput
            label="Jahresmiete (Brutto)"
            name="jahresmiete"
            type="number"
            value={formData.jahresmiete}
            onChange={handleChange}
            placeholder="26400"
            suffix="CHF"
            required
            error={errors.jahresmiete}
            hint={autoFilledFields.has('jahresmiete') ? '✨ Geschätzt (anpassen empfohlen!)' : ''}
          />
          <FormInput
            label="Monatliche Bruttomiete"
            name="monatlicheBruttomiete"
            type="number"
            value={formData.monatlicheBruttomiete}
            onChange={handleChange}
            placeholder="2200"
            suffix="CHF"
            hint={autoFilledFields.has('monatlicheBruttomiete') ? '✨ Automatisch berechnet' : 'Optional, zur Info'}
          />
        </FormSection>

        {/* Laufende Kosten */}
        <FormSection title="Laufende Kosten" color="orange">
          <FormInput
            label="Laufende Kosten/Jahr"
            name="laufendeKosten"
            type="number"
            value={formData.laufendeKosten}
            onChange={handleChange}
            placeholder="3000"
            suffix="CHF"
            hint={autoFilledFields.has('laufendeKosten') ? '✨ Automatisch berechnet' : 'Betriebskosten, Instandhaltung'}
          />
          <FormInput
            label="Verwaltung/Jahr"
            name="verwaltung"
            type="number"
            value={formData.verwaltung}
            onChange={handleChange}
            placeholder="1000"
            suffix="CHF"
            hint={autoFilledFields.has('verwaltung') ? '✨ Automatisch berechnet' : ''}
          />
          <FormInput
            label="Rücklagen/Jahr"
            name="ruecklagen"
            type="number"
            value={formData.ruecklagen}
            onChange={handleChange}
            placeholder="1000"
            suffix="CHF"
            hint={autoFilledFields.has('ruecklagen') ? '✨ Automatisch berechnet' : 'Für zukünftige Renovierungen'}
          />
          <FormInput
            label="Leerstand"
            name="leerstand"
            type="number"
            value={formData.leerstand}
            onChange={handleChange}
            placeholder="2.00"
            suffix="%"
            hint={autoFilledFields.has('leerstand') ? '✨ Aus Einstellungen' : 'Erwarteter Leerstand pro Jahr'}
          />
        </FormSection>

        {/* Steuerliche Berechnung */}
        <SteuerSection 
          formData={formData} 
          onChange={handleChange}
          kennzahlen={kennzahlenPreview}
          autoFilledFields={autoFilledFields}
        />

        {/* Notizen */}
        <div className="bg-slate-750 rounded-lg p-4 border border-slate-600">
          <label className="block text-sm font-medium mb-2 text-slate-200">
            Notizen (Optional)
          </label>
          <textarea
            name="notizen"
            value={formData.notizen}
            onChange={handleChange}
            placeholder="Persönliche Notizen zur Immobilie..."
            rows={3}
            className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end pt-6 border-t border-slate-700">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Speichere...' : 'Speichern'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ImmobilieForm;