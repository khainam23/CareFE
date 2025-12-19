// Validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  // Vietnamese phone number format: 0xxxxxxxxx or +84xxxxxxxxx
  const phoneRegex = /^(\+84|0)[0-9]{9}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateFullName = (fullName) => {
  return fullName && fullName.trim().length >= 2 && fullName.trim().length <= 100;
};

export const validateIdCard = (idCard) => {
  // Vietnamese ID card: 9-12 digits
  const idCardRegex = /^[0-9]{9,12}$/;
  return idCardRegex.test(idCard);
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

// Form validation for customer registration
export const validateCustomerForm = (formData) => {
  const errors = {};
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }
  
  if (!validatePassword(formData.password)) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  
  if (!validateFullName(formData.fullName)) {
    errors.fullName = 'Họ tên phải từ 2-100 ký tự';
  }
  
  if (!validatePhone(formData.phoneNumber)) {
    errors.phoneNumber = 'Số điện thoại không hợp lệ';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Form validation for caregiver registration
export const validateCaregiverForm = (formData) => {
  const errors = {};
  
  if (!validateEmail(formData.email)) {
    errors.email = 'Email không hợp lệ';
  }
  
  if (!validatePassword(formData.password)) {
    errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
  }
  
  if (!validateFullName(formData.fullName)) {
    errors.fullName = 'Họ tên phải từ 2-100 ký tự';
  }
  
  if (!validatePhone(formData.phoneNumber)) {
    errors.phoneNumber = 'Số điện thoại không hợp lệ';
  }
  
  if (!validateRequired(formData.address)) {
    errors.address = 'Địa chỉ không được để trống';
  }
  
  if (!validateIdCard(formData.idCardNumber)) {
    errors.idCardNumber = 'Số CMND/CCCD phải có 9-12 chữ số';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCaregiverStep = (step, formData) => {
  const errors = {};

  switch (step) {
    case 1:
      if (!validateFullName(formData.fullName)) {
        errors.fullName = 'Họ tên phải từ 2-100 ký tự';
      }
      if (!validateIdCard(formData.idCardNumber)) {
        errors.idCardNumber = 'Số CMND/CCCD phải có 9-12 chữ số';
      }
      break;

    case 2:
      if (!validatePassword(formData.password)) {
        errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
      }
      break;

    case 3:
      if (!validateEmail(formData.email)) {
        errors.email = 'Email không hợp lệ';
      }
      if (!validatePhone(formData.phoneNumber)) {
        errors.phoneNumber = 'Số điện thoại không hợp lệ';
      }
      break;

    case 4:
      if (!validateRequired(formData.address)) {
        errors.address = 'Địa chỉ không được để trống';
      }
      break;

    case 5:
      break;

    default:
      break;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateFullName,
  validateIdCard,
  validateRequired,
  validateCustomerForm,
  validateCaregiverForm,
  validateCaregiverStep
};