import React from 'react';

const FormSection = ({ title, children, color = 'blue' }) => {
  const colorClasses = {
    blue: 'text-blue-400 border-blue-400',
    green: 'text-green-400 border-green-400',
    purple: 'text-purple-400 border-purple-400',
    orange: 'text-orange-400 border-orange-400'
  };

  return (
    <div className="mb-6">
      <div className={`flex items-center gap-2 mb-4 pb-2 border-b ${colorClasses[color]}`}>
        <h4 className="font-semibold">{title}</h4>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
    </div>
  );
};

export default FormSection;