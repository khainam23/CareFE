import { useEffect, useRef, useState } from 'react';
import { formatDate, parseDateInput } from '@/utils/helpers';

const formatDisplayValue = (value) => {
  if (!value) return '';

  const digits = value.replace(/\D/g, '').slice(0, 8);
  const parts = [];

  if (digits.length > 0) {
    parts.push(digits.slice(0, Math.min(2, digits.length)));
  }
  if (digits.length > 2) {
    parts.push(digits.slice(2, Math.min(4, digits.length)));
  }
  if (digits.length > 4) {
    parts.push(digits.slice(4, 8));
  }

  return parts.join('/');
};

const DateInput = ({
  value,
  onChange,
  name,
  placeholder = 'dd/mm/yyyy',
  className = '',
  disabled = false,
  onBlur,
  onFocus,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState(() =>
    value ? formatDate(value) : ''
  );
  const lastValidValueRef = useRef(value || '');

  useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value ? formatDate(value) : '');
    }
    lastValidValueRef.current = value || '';
  }, [value, isFocused]);

  const emitChange = (nextValue) => {
    if (typeof onChange !== 'function') return;

    onChange({
      target: {
        name,
        value: nextValue,
      },
    });
  };

  const handleChange = (event) => {
    if (disabled) return;

    const formattedValue = formatDisplayValue(event.target.value);
    setIsFocused(true);
    setDisplayValue(formattedValue);

    if (!formattedValue) {
      lastValidValueRef.current = '';
      emitChange('');
      return;
    }

    const isoValue = parseDateInput(formattedValue);
    if (isoValue) {
      lastValidValueRef.current = isoValue;
      emitChange(isoValue);
    }
  };

  const handleFocus = (event) => {
    setIsFocused(true);
    onFocus?.(event);
  };

  const handleBlur = (event) => {
    setIsFocused(false);

    const isoValue = parseDateInput(displayValue);
    if (!displayValue) {
      emitChange('');
    } else if (!isoValue) {
      const fallbackValue = lastValidValueRef.current
        ? formatDate(lastValidValueRef.current)
        : '';
      setDisplayValue(fallbackValue);
    } else {
      lastValidValueRef.current = isoValue;
      emitChange(isoValue);
    }

    onBlur?.(event);
  };

  return (
    <input
      type="text"
      name={name}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      disabled={disabled}
      inputMode="numeric"
      maxLength={10}
      className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      {...rest}
    />
  );
};

export default DateInput;

