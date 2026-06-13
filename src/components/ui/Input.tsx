import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, ...props }) => {
    return (
        <div className="w-full space-y-1.5">
            {label && <label className="text-sm font-semibold text-gray-700">{label}</label>}
            <input
                className={`w-full px-4 py-2.5 bg-white border rounded-lg outline-none transition-all
          ${error ? 'border-red-500 focus:ring-red-100' : 'border-gray-200 focus:border-[#0d6efd] focus:ring-4 focus:ring-blue-50'}
          ${className}`}
                {...props}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
};