import React from 'react';
import { Building, TrendingUp, Settings } from 'lucide-react';

const TABS = {
  DASHBOARD: 'dashboard',
  SIMULATION: 'simulation',
  SETTINGS: 'settings'
};

const Navigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    {
      id: TABS.DASHBOARD,
      label: 'Dashboard',
      icon: Building,
      description: 'Immobilien verwalten'
    },
    {
      id: TABS.SIMULATION,
      label: 'Simulation',
      icon: TrendingUp,
      description: 'Portfolio analysieren'
    },
    {
      id: TABS.SETTINGS,
      label: 'Einstellungen',
      icon: Settings,
      description: 'Standard-Werte konfigurieren'
    }
  ];

  return (
    <div className="bg-slate-800 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`px-6 py-3 font-medium transition-all relative ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-750'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;