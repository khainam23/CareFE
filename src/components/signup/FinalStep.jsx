import React from 'react';

const FinalStep = ({ prevStep, formData }) => {
  const handleSubmit = () => {
    console.log('Form submitted:', formData);
    alert('Đăng ký thành công!');
  };

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Hoàn tất đăng ký</h2>
      <p className="text-gray-600 mb-8">Cảm ơn bạn đã hoàn thành thông tin. Chúng tôi sẽ xem xét và liên hệ với bạn sớm nhất.</p>
      
      <div className="flex justify-center gap-4">
        <button type="button" onClick={prevStep} className="btn-secondary">Quay lại</button>
        <button type="button" onClick={handleSubmit} className="btn-primary">Hoàn tất</button>
      </div>
    </div>
  );
};

export default FinalStep;
