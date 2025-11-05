import React from 'react';

const FormInput = ({ 
  label, 
  name, 
  type = 'text', 
  value, 
  onChange, 
  placeholder,
  required = false,
  error = null,
  suffix = null,
  hint = null
}) => {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-slate-200">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      
      <div className="relative">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          step={type === 'number' ? '0.01' : undefined}
          className={`w-full bg-slate-700 border rounded px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error ? 'border-red-500' : 'border-slate-600'
          } ${suffix ? 'pr-12' : ''}`}
        />
        
        {suffix && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">
            {suffix}
          </div>
        )}
      </div>
      
      {hint && !error && (
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}
    </div>
  );
};

export default FormInput;