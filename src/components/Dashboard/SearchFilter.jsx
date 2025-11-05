import React, { useState } from 'react';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

const SearchFilter = ({ onSearch, onFilter, onSort }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    minRendite: '',
    maxRendite: '',
    minKaufpreis: '',
    maxKaufpreis: '',
    positiverCashflow: false,
    tags: []
  });
  const [sortBy, setSortBy] = useState('erstellt_am');
  const [sortOrder, setSortOrder] = useState('desc');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSortChange = (field) => {
    const newOrder = sortBy === field && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortBy(field);
    setSortOrder(newOrder);
    onSort(field, newOrder);
  };

  const clearFilters = () => {
    const emptyFilters = {
      minRendite: '',
      maxRendite: '',
      minKaufpreis: '',
      maxKaufpreis: '',
      positiverCashflow: false,
      tags: []
    };
    setFilters(emptyFilters);
    setSearchTerm('');
    onFilter(emptyFilters);
    onSearch('');
  };

  const hasActiveFilters = () => {
    return searchTerm || 
           filters.minRendite || 
           filters.maxRendite || 
           filters.minKaufpreis || 
           filters.maxKaufpreis || 
           filters.positiverCashflow ||
           filters.tags.length > 0;
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Suche nach Name oder Adresse..."
            className="w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            showFilters ? 'bg-blue-600' : 'bg-slate-700 hover:bg-slate-600'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span>Filter</span>
          {hasActiveFilters() && (
            <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              !
            </span>
          )}
        </button>

        {hasActiveFilters() && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
            Clear
          </button>
        )}
      </div>

      {/* Sort Options */}
      <div className="flex gap-2 mb-4 overflow-x-auto">
        <span className="text-sm text-slate-400 py-2">Sortieren:</span>
        {[
          { field: 'name', label: 'Name' },
          { field: 'kaufpreis', label: 'Kaufpreis' },
          { field: 'eigenkapitalrendite', label: 'EK-Rendite' },
          { field: 'cashflow', label: 'Cashflow' },
          { field: 'erstellt_am', label: 'Datum' }
        ].map(({ field, label }) => (
          <button
            key={field}
            onClick={() => handleSortChange(field)}
            className={`px-3 py-1 rounded text-sm whitespace-nowrap transition-colors ${
              sortBy === field
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            {label}
            {sortBy === field && (
              <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
            )}
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t border-slate-700 pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-slate-400 mb-2">Min. Rendite (%)</label>
            <input
              type="number"
              value={filters.minRendite}
              onChange={(e) => handleFilterChange('minRendite', e.target.value)}
              placeholder="z.B. 5"
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Max. Rendite (%)</label>
            <input
              type="number"
              value={filters.maxRendite}
              onChange={(e) => handleFilterChange('maxRendite', e.target.value)}
              placeholder="z.B. 10"
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Min. Kaufpreis (CHF)</label>
            <input
              type="number"
              value={filters.minKaufpreis}
              onChange={(e) => handleFilterChange('minKaufpreis', e.target.value)}
              placeholder="z.B. 300000"
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Max. Kaufpreis (CHF)</label>
            <input
              type="number"
              value={filters.maxKaufpreis}
              onChange={(e) => handleFilterChange('maxKaufpreis', e.target.value)}
              placeholder="z.B. 800000"
              className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-white"
            />
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.positiverCashflow}
                onChange={(e) => handleFilterChange('positiverCashflow', e.target.checked)}
                className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-slate-300">Nur positive Cashflows</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;