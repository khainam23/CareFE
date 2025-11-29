import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
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
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Điều Khoản Dịch Vụ LifeEase</h1>
          <p className="text-gray-600 mb-8">Cập nhật lần cuối: {new Date().toLocaleDateString('vi-VN')}</p>

          <div className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Chấp Nhận Điều Khoản</h2>
              <p className="text-gray-700 leading-relaxed">
                Bằng cách truy cập và sử dụng nền tảng LifeEase, bạn đồng ý bị ràng buộc bởi các điều khoản và điều kiện này. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Mô Tả Dịch Vụ</h2>
              <p className="text-gray-700 leading-relaxed">
                LifeEase là một nền tảng kết nối những người cần chăm sóc với những chuyên viên chăm sóc chuyên nghiệp. Dịch vụ của chúng tôi cho phép người dùng:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-3 space-y-2">
                <li>Tìm kiếm và liên hệ với các chuyên viên chăm sóc</li>
                <li>Đặt và quản lý các dịch vụ chăm sóc</li>
                <li>Giao tiếp với người cung cấp dịch vụ</li>
                <li>Đánh giá và xem xét các dịch vụ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Tài Khoản Người Dùng</h2>
              <p className="text-gray-700 leading-relaxed">
                Bạn chịu trách nhiệm duy trì tính bảo mật của tài khoản của mình. Bạn phải:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-3 space-y-2">
                <li>Cung cấp thông tin chính xác, đầy đủ và hiện tại</li>
                <li>Bảo vệ mật khẩu của bạn và không chia sẻ với bất kỳ ai</li>
                <li>Thông báo cho chúng tôi ngay lập tức về bất kỳ truy cập trái phép nào</li>
                <li>Chấp nhận trách nhiệm cho tất cả hoạt động xảy ra dưới tài khoản của bạn</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Hành Vi Người Dùng</h2>
              <p className="text-gray-700 leading-relaxed">
                Bạn đồng ý không sử dụng dịch vụ của chúng tôi để:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-3 space-y-2">
                <li>Tạo ra nội dung bất hợp pháp, lừa đảo hoặc có hại</li>
                <li>Qu骚扰, đe dọa hoặc gây phiền toái cho người khác</li>
                <li>Xâm phạm quyền sở hữu trí tuệ của bất kỳ ai</li>
                <li>Phát tán thông tin cá nhân của người khác mà không có sự đồng ý</li>
                <li>Sử dụng bot hoặc công cụ tự động để truy cập dịch vụ</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Thanh Toán và Giá Cả</h2>
              <p className="text-gray-700 leading-relaxed">
                Tất cả các giá tiền được hiển thị trên nền tảng của chúng tôi là bằng đồng Việt Nam (VND). Bạn đồng ý thanh toán tất cả các khoản phí theo giá được niêm yết. Chúng tôi bảo lưu quyền thay đổi giá bất cứ lúc nào với thông báo trước 30 ngày.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Chính Sách Hủy và Hoàn Tiền</h2>
              <p className="text-gray-700 leading-relaxed">
                Chính sách hủy và hoàn tiền sẽ được hiển thị rõ ràng khi bạn đặt dịch vụ. Nói chung:
              </p>
              <ul className="list-disc list-inside text-gray-700 leading-relaxed mt-3 space-y-2">
                <li>Hủy trước 48 giờ: Hoàn lại toàn bộ tiền</li>
                <li>Hủy từ 24-48 giờ: Hoàn lại 50% tiền</li>
                <li>Hủy trong 24 giờ: Không hoàn tiền</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Trách Nhiệm Pháp Lý</h2>
              <p className="text-gray-700 leading-relaxed">
                LifeEase cung cấp nền tảng này "nguyên trạng" mà không có bất kỳ bảo hành nào. Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên, đặc biệt hoặc hậu quả phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Quyền Sở Hữu Trí Tuệ</h2>
              <p className="text-gray-700 leading-relaxed">
                Tất cả nội dung trên nền tảng LifeEase, bao gồm text, graphics, logos, hình ảnh và phần mềm, là tài sản của LifeEase hoặc các nhà cấp phép của chúng tôi. Bạn không được phép sao chép, sửa đổi hoặc phân phối bất kỳ nội dung nào mà không có sự cho phép rõ ràng.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Kết Thúc Dịch Vụ</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi bảo lưu quyền kết thúc hoặc tạm ngưng tài khoản của bạn bất cứ lúc nào nếu bạn vi phạm các điều khoản này hoặc tham gia vào hành vi gây hại.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Thay Đổi Điều Khoản</h2>
              <p className="text-gray-700 leading-relaxed">
                Chúng tôi có thể cập nhật các điều khoản này bất cứ lúc nào. Những thay đổi sẽ có hiệu lực ngay lập tức khi được đăng trên trang web. Việc tiếp tục sử dụng dịch vụ của chúng tôi biểu thị sự chấp nhận các điều khoản đã sửa đổi.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Luật Áp Dụng</h2>
              <p className="text-gray-700 leading-relaxed">
                Các điều khoản này được điều chỉnh bởi và được giải thích theo luật pháp của Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam. Bất kỳ tranh chấp nào phát sinh từ hoặc liên quan đến các điều khoản này sẽ được giải quyết độc quyền tại các tòa án có thẩm quyền ở Việt Nam.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Liên Hệ</h2>
              <p className="text-gray-700 leading-relaxed">
                Nếu bạn có bất kỳ câu hỏi nào về các điều khoản này, vui lòng liên hệ với chúng tôi tại:
              </p>
              <p className="text-gray-700 leading-relaxed mt-3">
                Email: support@lifeease.vn<br />
                Điện thoại: 1900-xxxx<br />
                Địa chỉ: [Địa chỉ công ty]
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
