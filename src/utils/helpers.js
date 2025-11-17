// Helper functions
export const formatDate = (date) => {
  if (!date) return '';

  const pad = (value) => String(value).padStart(2, '0');

  if (typeof date === 'string') {
    const isoMatch = date.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      const [, year, month, day] = isoMatch;
      return `${day}/${month}/${year}`;
    }

    const slashMatch = date.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashMatch) {
      const [, month, day, year] = slashMatch;
      return `${pad(day)}/${pad(month)}/${year}`;
    }
  }

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  const day = pad(parsedDate.getDate());
  const month = pad(parsedDate.getMonth() + 1);
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
};

export const parseDateInput = (value) => {
  if (!value) return '';

  const digits = value.replace(/\D/g, '');
  if (digits.length !== 8) return '';

  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4));

  if (
    Number.isNaN(day) ||
    Number.isNaN(month) ||
    Number.isNaN(year) ||
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900
  ) {
    return '';
  }

  const isoDate = new Date(year, month - 1, day);
  if (Number.isNaN(isoDate.getTime())) return '';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (isoDate > today) {
    return '';
  }

  const pad = (v) => String(v).padStart(2, '0');
  return `${isoDate.getFullYear()}-${pad(isoDate.getMonth() + 1)}-${pad(
    isoDate.getDate()
  )}`;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const truncate = (str, length = 50) => {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};
