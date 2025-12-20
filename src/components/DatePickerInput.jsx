import { forwardRef, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { format, parseISO } from 'date-fns';
import { vi } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';

const DISPLAY_FORMAT = 'dd/MM/yyyy';
const STORAGE_FORMAT = 'yyyy-MM-dd';

const DateInput = forwardRef(({ value, onClick, placeholder = 'dd/mm/yyyy', className, disabled, onChange }, ref) => (
  <input
    ref={ref}
    onClick={onClick}
    value={value}
    placeholder={placeholder}
    disabled={disabled}
    className={className}
    onChange={onChange}
  />
));

DateInput.displayName = 'DateInput';

const normalizeValue = (value) => {
  if (!value) return null;

  if (typeof value === 'string') {
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      return parseISO(value);
    }
    const parts = value.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }
  }

  const dateObj = new Date(value);
  return Number.isNaN(dateObj.getTime()) ? null : dateObj;
};

const DatePickerInput = ({
  value,
  onChange,
  className = '',
  disabled = false,
  maxDate,
  ...props
}) => {
  const selected = useMemo(() => normalizeValue(value), [value]);

  const handleDateChange = (date) => {
    if (!date || Number.isNaN(date.getTime())) {
      onChange('');
    } else {
      onChange(format(date, STORAGE_FORMAT));
    }
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    const normalized = normalizeValue(inputValue);
    
    if (normalized && !Number.isNaN(normalized.getTime())) {
      handleDateChange(normalized);
    } else if (inputValue === '') {
      onChange('');
    }
  };

  return (
    <DatePicker
      locale={vi}
      selected={selected}
      dateFormat={DISPLAY_FORMAT}
      placeholderText="dd/mm/yyyy"
      onChange={handleDateChange}
      customInput={<DateInput className={className} disabled={disabled} onChange={handleInputChange} />}
      disabled={disabled}
      maxDate={maxDate}
      showPopperArrow={false}
      calendarStartDay={1}
      {...props}
    />
  );
};

export default DatePickerInput;

