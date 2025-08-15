
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseClasses = "font-bold py-2 px-4 rounded-lg shadow-md transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
  
  const variantClasses = {
    primary: 'bg-yellow-600 hover:bg-yellow-500 text-gray-900 border-b-4 border-yellow-800 hover:border-yellow-600',
    secondary: 'bg-gray-600 hover:bg-gray-500 text-white border-b-4 border-gray-800 hover:border-gray-600',
    danger: 'bg-red-700 hover:bg-red-600 text-white border-b-4 border-red-900 hover:border-red-700',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default Button;