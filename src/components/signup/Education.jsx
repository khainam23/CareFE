import React from 'react';

const Education = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleChange = (e) => {
    updateFormData({ education: e.target.value });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Thông tin khóa học & đào tạo</h2>
      <p className="text-gray-500 mb-6">Mô tả ngắn gọn về quá trình học tập và các chứng chỉ bạn có.</p>
      
      <textarea
        name="education"
        value={formData.education}
        onChange={handleChange}
        className="w-full h-40 p-3 border rounded-lg focus:ring-teal-500 focus:border-teal-500"
        placeholder="Ví dụ: Tốt nghiệp Đại học Y Dược TP.HCM, Chứng chỉ hành nghề điều dưỡng..."
      ></textarea>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={prevStep} className="btn-secondary">Quay lại</button>
        <button type="button" onClick={nextStep} className="btn-primary">Tiếp tục</button>
      </div>
    </div>
  );
};

export default Education;
