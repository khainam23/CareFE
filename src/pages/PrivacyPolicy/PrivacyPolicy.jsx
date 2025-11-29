import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-8 text-blue-500 hover:text-blue-600"
        >
          <ArrowLeft size={20} />
          Quay lại
        </button>

        <div className="bg-white rounded-lg shadow p-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Chính Sách Quyền Riêng Tư LifeEase</h1>
          <p className="text-gray-600 mb-8">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>

          <div className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Giới Thiệu</h2>
              <p className="text-gray-700 leading-relaxed">
                LifeEase ("Chúng tôi", "Công ty" hoặc "Tôi") cam kết bảo vệ quyền riêng tư của bạn. Chính sách Quyền Riêng Tư này giải thích cách chúng tôi thu thập, sử dụng, tiết lộ và bảo vệ thông tin của bạn.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Thông Tin Chúng Tôi Thu Thập</h2>
              <p className="text-gray-700 leading-relaxed font-semibold mt-4 mb-2">2.1 Thông Tin Bạn Cung Cấp</p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>Thông tin đăng ký tài khoản (tên, email, số điện thoại)</li>
                <li>Thông tin cá nhân (ngày sinh, địa chỉ, giới tính)</li>
                <li>Thông tin thanh toán (số tài khoản ngân hàng, thông tin thẻ tín dụng)</li>
                <li>Thông tin về người cần chăm sóc (họ tên, tuổi, tình trạng sức khỏe)</li>
                <li>Tin nhắn và giao tiếp trên nền tảng</li>
              </ul>

              <p className="text-gray-700 leading-relaxed font-semibold mt-4 mb-2">2.2 Thông Tin Được Thu Thập Tự Động</p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed space-y-2">
                <li>Thông tin về thiết bị (loại trình duyệt, hệ điều hành, địa chỉ IP)</li>
                <li>Dữ liệu sử dụng nền tảng (các trang bạn truy cập, thời gian truy cập)</li>
                <li>Cookie và công nghệ theo dõi tương tự</li>
                <li>Thông tin vị trí (nếu bạn cho phép)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi sử dụng thông tin được thu thập cho các mục đích sau:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-3 space-y-2">
                <li>Cung cấp, duy trì và cải thiện dịch vụ</li>
                <li>Xác nhận danh tính và xác thực tài khoản</li>
                <li>Xử lý thanh toán và giao dịch</li>
                <li>Gửi thông báo và cập nhật dịch vụ</li>
                <li>Hỗ trợ khách hàng và trả lời câu hỏi</li>
                <li>Phân tích xu hướng sử dụng và cải thiện trải nghiệm người dùng</li>
                <li>Phát hiện và ngăn chặn gian lận và hoạt động bất hợp pháp</li>
                <li>Tuân thủ các yêu cầu pháp lý</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Chia Sẻ Thông Tin</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi có thể chia sẻ thông tin của bạn với:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-3 space-y-2">
                <li><strong>Các nhà cung cấp dịch vụ</strong>: Người được bạn chọn để cung cấp dịch vụ chăm sóc</li>
                <li><strong>Đối tác thanh toán</strong>: Để xử lý thanh toán an toàn</li>
                <li><strong>Nhà cung cấp dịch vụ bên thứ ba</strong>: Để hỗ trợ các hoạt động của chúng tôi (lưu trữ, phân tích)</li>
                <li><strong>Cơ quan thực thi pháp luật</strong>: Khi được yêu cầu bởi luật pháp</li>
                <li><strong>Các bên được chỉ định</strong>: Trong trường hợp sáp nhập hoặc bán công ty</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Bảo Vệ Dữ Liệu</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi sử dụng các biện pháp bảo mật công nghệ cao để bảo vệ thông tin của bạn:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-3 space-y-2">
                <li>Mã hóa SSL/TLS cho tất cả các giao dịch</li>
                <li>Mật khẩu được mã hóa với hashing mạnh</li>
                <li>Kiểm soát truy cập hạn chế đối với dữ liệu nhạy cảm</li>
                <li>Tường lửa và hệ thống phát hiện xâm nhập</li>
                <li>Kiểm toán bảo mật định kỳ</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Mặc dù chúng tôi cố gắng bảo vệ thông tin của bạn, không có phương pháp truyền tải hoặc lưu trữ điện tử nào hoàn toàn an toàn 100%.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Quyền Của Bạn</h2>
              <p className="text-gray-700 leading-relaxed">
                Bạn có quyền:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-3 space-y-2">
                <li>Truy cập dữ liệu cá nhân của bạn được lưu trữ bởi chúng tôi</li>
                <li>Yêu cầu sửa đổi thông tin không chính xác</li>
                <li>Yêu cầu xóa dữ liệu cá nhân (ngoại trừ thông tin cần thiết để tuân thủ pháp luật)</li>
                <li>Từ chối xử lý cho mục đích tiếp thị</li>
                <li>Rút lại sự đồng ý của bạn bất cứ lúc nào</li>
                <li>Yêu cầu một bản sao các dữ liệu cá nhân của bạn ở định dạng có cấu trúc, phổ biến và có thể đọc được</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Cookie</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi sử dụng cookie để:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-3 space-y-2">
                <li>Nhớ tùy chọn của bạn</li>
                <li>Theo dõi hành vi sử dụng nền tảng</li>
                <li>Cải thiện trải nghiệm người dùng</li>
                <li>Phân tích hiệu suất nền tảng</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-3">
                Bạn có thể kiểm soát cookie thông qua cài đặt trình duyệt. Tuy nhiên, việc vô hiệu hóa cookie có thể ảnh hưởng đến các tính năng nhất định của nền tảng.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Thời Gian Lưu Giữ Dữ Liệu</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi lưu giữ dữ liệu cá nhân của bạn miễn là tài khoản của bạn hoạt động hoặc khi cần thiết để cung cấp dịch vụ. Bạn có thể yêu cầu xóa dữ liệu của mình bất cứ lúc nào. Tuy nhiên, chúng tôi có thể lưu giữ dữ liệu nếu được yêu cầu bởi luật pháp hoặc cho mục đích kiểm tra.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Liên Hệ Của Bên Thứ Ba</h2>
              <p className="text-gray-700 leading-relaxed">
                Nền tảng của chúng tôi có thể chứa liên kết đến các trang web của bên thứ ba. Chúng tôi không chịu trách nhiệm cho chính sách quyền riêng tư của những trang web này. Chúng tôi khuyến khích bạn xem xét chính sách quyền riêng tư của bất kỳ trang web nào mà bạn truy cập.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Bản Tin và Truyền Thông</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi có thể gửi cho bạn bản tin và thông báo tiếp thị. Bạn có thể hủy đăng ký bất cứ lúc nào bằng cách nhấp vào liên kết "Hủy đăng ký" trong bất kỳ email tiếp thị nào.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Thay Đổi Chính Sách Này</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi có thể cập nhật Chính sách Quyền Riêng Tư này bất cứ lúc nào. Những thay đổi sẽ có hiệu lực ngay lập tức. Việc tiếp tục sử dụng nền tảng của chúng tôi biểu thị sự chấp nhận các thay đổi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Luật Áp Dụng</h2>
              <p className="text-gray-700 leading-relaxed">
                Chính sách này được điều chỉnh bởi luật pháp của Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam. Bất kỳ tranh chấp nào sẽ được giải quyết theo luật pháp Việt Nam.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Liên Hệ Với Chúng Tôi</h2>
              <p className="text-gray-700 leading-relaxed">
                Nếu bạn có bất kỳ câu hỏi về Chính sách Quyền Riêng Tư này hoặc cách chúng tôi xử lý dữ liệu của bạn, vui lòng liên hệ với chúng tôi:
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Email: privacy@lifeease.vn<br />
                Điện thoại: 1900-xxxx<br />
                Địa chỉ: [Địa chỉ công ty]<br />
                <br />
                <strong>Người Đứng Đầu Dữ Liệu:</strong><br />
                Email: dpo@lifeease.vn
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
