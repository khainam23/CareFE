import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  isActive = false,
  isToggleable = false,
  toggleMode = 'independent', // 'independent' | 'selection'
  ...props 
}) => {
  const baseClasses = 'w-full py-3 rounded-lg font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Toggle styles
  const getToggleClasses = () => {
    if (!isToggleable) return '';
    
    if (isActive) {
      return 'bg-primary-600 text-white hover:bg-primary-700';
    } else {
      return 'bg-chilled-gray-100 text-chilled-gray-700 hover:bg-chilled-gray-200';
    }
  };

  // Variant styles (only apply if not toggleable)
  const variants = {
    primary: isToggleable ? '' : 'bg-primary-500 text-white hover:bg-primary-600',
    secondary: isToggleable ? '' : 'bg-white border border-chilled-gray-300 text-chilled-gray-700 hover:bg-chilled-gray-50',
    outline: isToggleable ? '' : 'border border-primary-500 text-primary-500 hover:bg-primary-50',
  };

  const variantClass = isToggleable ? getToggleClasses() : variants[variant];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
