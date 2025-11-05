import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import FormInput from './FormInput';
import FormSection from './FormSection';
import SteuerSection from './SteuerSection';
import { DEFAULT_IMMOBILIE } from '../../utils/constants';
import { validateImmobilieForm } from '../../utils/validators';
import { berechneKennzahlen } from '../../services/calculationService';

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

  useEffect(() => {
    if (immobilie) {
      setFormData({
        ...immobilie,
        steuersatz: immobilie.steuersatz || '',
        abschreibungProzent: immobilie.abschreibungProzent || '2.5',
        abschreibungJahre: immobilie.abschreibungJahre || '40',
        notizen: immobilie.notizen || ''
      });
    } else {
      setFormData({
        ...DEFAULT_IMMOBILIE,
        steuersatz: '',
        abschreibungProzent: '2.5',
        abschreibungJahre: '40',
        notizen: ''
      });
    }
  }, [immobilie]);

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
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
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

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basis-Informationen */}
        <FormSection title="Basis-Informationen" color="blue">
          <FormInput
            label="Name der Immobilie"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="z.B. Mehrfamilienhaus Zürich"
            required
            error={errors.name}
          />
          <FormInput
            label="Adresse"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            placeholder="z.B. Musterstrasse 123, 8000 Zürich"
          />
        </FormSection>

        {/* Kaufdaten */}
        <FormSection title="Kaufdaten" color="green">
          <FormInput
            label="Kaufpreis"
            name="kaufpreis"
            type="number"
            value={formData.kaufpreis}
            onChange={handleChange}
            placeholder="480000"
            suffix="CHF"
            required
            error={errors.kaufpreis}
            hint="Reiner Kaufpreis ohne Nebenkosten"
          />
          <FormInput
            label="Nebenkosten"
            name="nebenkosten"
            type="number"
            value={formData.nebenkosten}
            onChange={handleChange}
            placeholder="36000"
            suffix="CHF"
            hint="Grundbuchgebühren, Notar, etc."
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
            placeholder="3.00"
            suffix="%"
            hint="Jährlicher Zinssatz"
          />
          <FormInput
            label="Tilgung"
            name="tilgung"
            type="number"
            value={formData.tilgung}
            onChange={handleChange}
            placeholder="1.00"
            suffix="%"
            hint="Jährliche Tilgungsrate"
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
          />
          <FormInput
            label="Monatliche Bruttomiete"
            name="monatlicheBruttomiete"
            type="number"
            value={formData.monatlicheBruttomiete}
            onChange={handleChange}
            placeholder="2200"
            suffix="CHF"
            hint="Optional, zur Info"
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
            hint="Betriebskosten, Instandhaltung"
          />
          <FormInput
            label="Verwaltung/Jahr"
            name="verwaltung"
            type="number"
            value={formData.verwaltung}
            onChange={handleChange}
            placeholder="1000"
            suffix="CHF"
          />
          <FormInput
            label="Rücklagen/Jahr"
            name="ruecklagen"
            type="number"
            value={formData.ruecklagen}
            onChange={handleChange}
            placeholder="1000"
            suffix="CHF"
            hint="Für zukünftige Renovierungen"
          />
          <FormInput
            label="Leerstand"
            name="leerstand"
            type="number"
            value={formData.leerstand}
            onChange={handleChange}
            placeholder="2.00"
            suffix="%"
            hint="Erwarteter Leerstand pro Jahr"
          />
        </FormSection>

        {/* NEUE SEKTION: Steuerliche Berechnung */}
        <SteuerSection 
          formData={formData} 
          onChange={handleChange}
          kennzahlen={kennzahlenPreview}
        />

        {/* NEUE SEKTION: Notizen */}
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