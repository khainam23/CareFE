import React from 'react';

const ProfessionalInfo = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleChange = (e) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
      
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
          <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
          <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full input" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
          <select name="gender" value={formData.gender} onChange={handleChange} className="w-full input" required>
            <option value="">Chọn giới tính</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
          <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} className="w-full input" required />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành phố</label>
          <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full input" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quận/Huyện</label>
          <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full input" required />
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ cụ thể</label>
        <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full input" required />
      </div>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={prevStep} className="btn-secondary">Quay lại</button>
        <button type="submit" className="btn-primary">Tiếp tục</button>
      </div>
    </form>
  );
};

export default ProfessionalInfo;
