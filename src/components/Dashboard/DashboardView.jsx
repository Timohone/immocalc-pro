import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import ImmobilienListe from './ImmobilienListe';
import StatistikKarten from './StatistikKarten';
import ImmobilieForm from '../Forms/ImmobilieForm';
import SearchFilter from './SearchFilter';
import { usePortfolioKennzahlen } from '../../hooks/useKennzahlen';
import { berechneKennzahlen } from '../../services/calculationService';

const DashboardView = ({ 
  immobilien, 
  onAddImmobilie, 
  onUpdateImmobilie, 
  onDeleteImmobilie 
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingImmobilie, setEditingImmobilie] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('erstellt_am');
  const [sortOrder, setSortOrder] = useState('desc');

  const { portfolioStats } = usePortfolioKennzahlen(immobilien);

  const handleEdit = (immobilie) => {
    setEditingImmobilie(immobilie);
    setShowForm(true);
  };

  const handleSave = async (formData) => {
    if (editingImmobilie) {
      await onUpdateImmobilie(editingImmobilie.id, formData);
    } else {
      await onAddImmobilie(formData);
    }
    
    setShowForm(false);
    setEditingImmobilie(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingImmobilie(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Möchtest du diese Immobilie wirklich löschen?')) {
      await onDeleteImmobilie(id);
    }
  };

  // Filter & Sort Logic
  const getFilteredAndSortedImmobilien = () => {
    let filtered = [...immobilien];

    // Search
    if (searchTerm) {
      filtered = filtered.filter(immo => 
        immo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (immo.adresse && immo.adresse.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filters
    if (filters.minRendite || filters.maxRendite || filters.minKaufpreis || filters.maxKaufpreis || filters.positiverCashflow) {
      filtered = filtered.filter(immo => {
        const kennzahlen = berechneKennzahlen(immo);
        const kaufpreis = parseFloat(immo.kaufpreis) || 0;

        if (filters.minRendite && kennzahlen.eigenkapitalrendite < parseFloat(filters.minRendite)) return false;
        if (filters.maxRendite && kennzahlen.eigenkapitalrendite > parseFloat(filters.maxRendite)) return false;
        if (filters.minKaufpreis && kaufpreis < parseFloat(filters.minKaufpreis)) return false;
        if (filters.maxKaufpreis && kaufpreis > parseFloat(filters.maxKaufpreis)) return false;
        if (filters.positiverCashflow && kennzahlen.cashflow < 0) return false;

        return true;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let valueA, valueB;

      if (sortBy === 'name' || sortBy === 'adresse') {
        valueA = a[sortBy] || '';
        valueB = b[sortBy] || '';
        return sortOrder === 'asc' 
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (sortBy === 'erstellt_am') {
        valueA = new Date(a.erstelltAm || 0);
        valueB = new Date(b.erstelltAm || 0);
        return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
      }

      // Kennzahlen-basierte Sortierung
      const kennzahlenA = berechneKennzahlen(a);
      const kennzahlenB = berechneKennzahlen(b);

      if (sortBy === 'kaufpreis') {
        valueA = parseFloat(a.kaufpreis) || 0;
        valueB = parseFloat(b.kaufpreis) || 0;
      } else if (sortBy === 'eigenkapitalrendite') {
        valueA = kennzahlenA.eigenkapitalrendite;
        valueB = kennzahlenB.eigenkapitalrendite;
      } else if (sortBy === 'cashflow') {
        valueA = kennzahlenA.cashflow;
        valueB = kennzahlenB.cashflow;
      } else {
        valueA = 0;
        valueB = 0;
      }

      return sortOrder === 'asc' ? valueA - valueB : valueB - valueA;
    });

    return filtered;
  };

  const filteredImmobilien = getFilteredAndSortedImmobilien();

  return (
    <div className="space-y-6">
      {/* Portfolio Statistiken */}
      {immobilien.length > 0 && (
        <StatistikKarten portfolioStats={portfolioStats} />
      )}

      {/* Search & Filter */}
      {immobilien.length > 0 && (
        <SearchFilter
          onSearch={setSearchTerm}
          onFilter={setFilters}
          onSort={(field, order) => {
            setSortBy(field);
            setSortOrder(order);
          }}
        />
      )}

      {/* Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white">
            {immobilien.length > 0 ? 'Deine Immobilien' : 'Portfolio'}
          </h2>
          {filteredImmobilien.length !== immobilien.length && (
            <p className="text-sm text-slate-400 mt-1">
              {filteredImmobilien.length} von {immobilien.length} Immobilien
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setEditingImmobilie(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Neue Immobilie
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <ImmobilieForm
          immobilie={editingImmobilie}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}

      {/* Immobilien Liste */}
      <ImmobilienListe
        immobilien={filteredImmobilien}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default DashboardView;