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
    <div className="w-full max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="flex justify-center mb-8 align-center">
        <div className="flex items-center gap-2">
          {CUSTOMER_STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step.id}
              </div>
              {index < CUSTOMER_STEPS.length - 1 && (
                <div className={`w-12 h-1 mx-2 ${currentStep > step.id ? 'bg-blue-500' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content - All sections visible */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Basic Info */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[0].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">{CUSTOMER_STEPS[0].description}</p>
          <Step1Customer />
        </div>

        {/* Section 2: Personal Info */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[1].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">{CUSTOMER_STEPS[1].description}</p>
          <Step2Customer />
        </div>

        {/* Section 3: Address */}
        <div className="p-6 bg-white border-2 border-gray-200 rounded-lg">
          <h2 className="pb-2 mb-4 text-lg font-semibold border-b border-gray-300">
            {CUSTOMER_STEPS[2].title}
          </h2>
          <p className="mb-4 text-sm text-gray-600">{CUSTOMER_STEPS[2].description}</p>
          <Step3Customer />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="px-6 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Hoàn tất
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