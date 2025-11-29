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
  const baseClasses = 'py-3 rounded-lg font-semibold transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed';
  
  // Get button classes based on toggleable state
  const getButtonClasses = () => {
    if (isToggleable) {
      // Toggle styles
      if (isActive) {
        return 'bg-gray-800 text-white hover:bg-gray-900';
      } else {
        return 'bg-gray-200 text-gray-700 hover:bg-gray-300';
      }
    } else {
      // Variant styles
      const variants = {
        primary: 'bg-gray-800 text-white hover:bg-gray-900',
        secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
        outline: 'border border-gray-800 text-gray-800 hover:bg-gray-100 bg-transparent',
      };
      return variants[variant] || variants.primary;
    }
  };

  const variantClass = getButtonClasses();

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
