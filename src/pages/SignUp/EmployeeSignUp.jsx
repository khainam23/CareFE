export default function EmployeeSignUp({ onBack }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Submit form logic here
    console.log('Submit employee signup');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="p-5 space-y-8 bg-white rounded-2xl">
        {/* Account Information */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Thông tin tài khoản</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Email công ty</label>
              <input type="email" className="w-full p-2 border rounded-lg" placeholder="email@company.com" required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Mật khẩu</label>
              <input type="password" className="w-full p-2 border rounded-lg" placeholder="••••••••" required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Xác nhận mật khẩu</label>
              <input type="password" className="w-full p-2 border rounded-lg" placeholder="••••••••" required />
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Thông tin cá nhân</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Họ và tên</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="Nguyễn Văn A" required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Số điện thoại</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="0123456789" required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Số CMND/CCCD</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="123456789" required />
            </div>
          </div>
        </div>

        {/* Work Information */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Thông tin công việc</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Vị trí công việc</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="Nhân viên bán hàng" required />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Phòng ban</label>
              <select className="w-full p-2 border rounded-lg" required>
                <option value="">Chọn phòng ban</option>
                <option>Kinh doanh</option>
                <option>Kỹ thuật</option>
                <option>Hành chính</option>
              </select>
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium">Mã nhân viên</label>
              <input type="text" className="w-full p-2 border rounded-lg" placeholder="EMP001" required />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Quay lại
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-green-500 rounded-lg hover:bg-green-600"
          >
            Hoàn tất
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