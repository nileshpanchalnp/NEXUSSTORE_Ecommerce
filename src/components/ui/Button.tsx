import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', fullWidth, className, ...props }) => {
  const base = "px-6 py-2.5 rounded-lg font-medium transition-all duration-200 active:scale-95 disabled:opacity-50";
  const variants = {
    primary: "bg-[#0d6efd] text-white hover:bg-blue-700",
    secondary: "bg-[#ffc107] text-black hover:bg-yellow-500",
    outline: "border-2 border-[#0d6efd] text-[#0d6efd] hover:bg-blue-50"
  };
  
  return (
    <button 
      className={`${base} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};