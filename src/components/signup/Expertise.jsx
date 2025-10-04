import React from 'react';

const EXPERTISE_OPTIONS = [
  'Chăm sóc người cao tuổi',
  'Chăm sóc người bệnh',
  'Chăm sóc trẻ em',
  'Chăm sóc sau sinh',
  'Vật lý trị liệu',
  'Tư vấn dinh dưỡng',
];

const Expertise = ({ nextStep, prevStep, updateFormData, formData }) => {
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let newExpertise = [...formData.expertise];
    if (checked) {
      newExpertise.push(value);
    } else {
      newExpertise = newExpertise.filter((item) => item !== value);
    }
    updateFormData({ expertise: newExpertise });
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Hoàn thành thông tin chuyên môn của bạn</h2>
      <p className="text-gray-500 mb-6">Chọn các lĩnh vực bạn có chuyên môn</p>

      <div className="space-y-4">
        {EXPERTISE_OPTIONS.map((option) => (
          <label key={option} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="checkbox"
              value={option}
              checked={formData.expertise.includes(option)}
              onChange={handleCheckboxChange}
              className="h-5 w-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
            />
            <span className="ml-4 text-gray-700">{option}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-between mt-8">
        <button type="button" onClick={prevStep} className="btn-secondary">Quay lại</button>
        <button type="button" onClick={nextStep} className="btn-primary">Tiếp tục</button>
      </div>
    </div>
  );
};

export default Expertise;
