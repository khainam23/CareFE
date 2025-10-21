const EMPLOYEE_STEPS = [
  { id: 1, title: 'Thông tin tài khoản', description: 'Email và mật khẩu' },
  { id: 2, title: 'Thông tin cá nhân', description: 'Tên, số điện thoại' },
  { id: 3, title: 'Thông tin công việc', description: 'Vị trí, phòng ban' },
];

export default function EmployeeSignUp({ currentStep, onNextStep, onPrevStep, onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < EMPLOYEE_STEPS.length) {
      onNextStep();
    } else {
      // Submit form logic here
      console.log('Submit employee signup');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Stepper */}
      <div className="mb-8">
        <div className="flex justify-between">
          {EMPLOYEE_STEPS.map((step) => (
            <div key={step.id} className="flex-1">
              <div
                className={`p-3 rounded-lg text-center ${
                  currentStep >= step.id ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                <p className="font-semibold">{step.title}</p>
                <p className="text-sm">{step.description}</p>
              </div>
              {step.id < EMPLOYEE_STEPS.length && (
                <div className={`h-1 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && <Step1Employee />}
        {currentStep === 2 && <Step2Employee />}
        {currentStep === 3 && <Step3Employee />}

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
            className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            {currentStep === EMPLOYEE_STEPS.length ? 'Hoàn tất' : 'Tiếp theo'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Step1Employee() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Email công ty</label>
        <input type="email" className="w-full p-2 border rounded-lg" placeholder="email@company.com" />
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

function Step2Employee() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Họ và tên</label>
        <input type="text" className="w-full p-2 border rounded-lg" placeholder="Nguyễn Văn A" />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Số điện thoại</label>
        <input type="text" className="w-full p-2 border rounded-lg" placeholder="0123456789" />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Số CMND/CCCD</label>
        <input type="text" className="w-full p-2 border rounded-lg" placeholder="123456789" />
      </div>
    </div>
  );
}

function Step3Employee() {
  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-2 text-sm font-medium">Vị trí công việc</label>
        <input type="text" className="w-full p-2 border rounded-lg" placeholder="Nhân viên bán hàng" />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Phòng ban</label>
        <select className="w-full p-2 border rounded-lg">
          <option>Chọn phòng ban</option>
          <option>Kinh doanh</option>
          <option>Kỹ thuật</option>
          <option>Hành chính</option>
        </select>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium">Mã nhân viên</label>
        <input type="text" className="w-full p-2 border rounded-lg" placeholder="EMP001" />
      </div>
    </div>
  );
}