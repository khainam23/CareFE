const CUSTOMER_STEPS = [
  { id: 1, title: 'Thông tin cơ bản', description: 'Nhập email và mật khẩu' },
  { id: 2, title: 'Thông tin cá nhân', description: 'Nhập tên, số điện thoại' },
  { id: 3, title: 'Địa chỉ', description: 'Nhập địa chỉ giao hàng' },
];

export default function CustomerSignUp({ currentStep, onNextStep, onPrevStep, onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < CUSTOMER_STEPS.length) {
      onNextStep();
    } else {
      // Submit form logic here
      console.log('Submit customer signup');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex justify-between">
          {CUSTOMER_STEPS.map((step) => (
            <div key={step.id} className="flex-1">
              <div
                className={`p-3 rounded-lg text-center ${
                  currentStep >= step.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <p className="font-semibold">{step.title}</p>
                <p className="text-sm">{step.description}</p>
              </div>
              {step.id < CUSTOMER_STEPS.length && (
                <div className={`h-1 ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && <Step1Customer />}
        {currentStep === 2 && <Step2Customer />}
        {currentStep === 3 && <Step3Customer />}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Quay lại
          </button>
          {currentStep > 1 && (
            <button
              type="button"
              onClick={onPrevStep}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Trước
            </button>
          )}
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            {currentStep === CUSTOMER_STEPS.length ? 'Hoàn tất' : 'Tiếp theo'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Step1Customer() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Email</label>
        <input type="email" className="w-full p-2 border rounded-lg" placeholder="email@example.com" />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Mật khẩu</label>
        <input type="password" className="w-full p-2 border rounded-lg" placeholder="••••••••" />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Xác nhận mật khẩu</label>
        <input type="password" className="w-full p-2 border rounded-lg" placeholder="••••••••" />
      </div>
    </div>
  );
}

function Step2Customer() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Họ và tên</label>
        <input type="text" className="w-full p-2 border rounded-lg" placeholder="Nguyễn Văn A" />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Số điện thoại</label>
        <input type="tel" className="w-full p-2 border rounded-lg" placeholder="0123456789" />
      </div>
    </div>
  );
}

function Step3Customer() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Địa chỉ</label>
        <input type="text" className="w-full p-2 border rounded-lg" placeholder="123 Đường ABC" />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Thành phố</label>
        <input type="text" className="w-full p-2 border rounded-lg" placeholder="Hà Nội" />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Mã bưu điện</label>
        <input type="text" className="w-full p-2 border rounded-lg" placeholder="100000" />
      </div>
    </div>
  );
}