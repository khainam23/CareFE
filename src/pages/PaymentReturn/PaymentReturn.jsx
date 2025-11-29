import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from '@/components/common';

function PaymentReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const responseCode = searchParams.get('vnp_ResponseCode');
    const txnRef = searchParams.get('vnp_TxnRef');
    const amount = searchParams.get('vnp_Amount');
    const bankCode = searchParams.get('vnp_BankCode');
    const orderInfo = searchParams.get('vnp_OrderInfo');

    const paymentData = {
      responseCode,
      transactionId: txnRef,
      amount: amount ? (parseInt(amount) / 100).toLocaleString() : '0',
      bankCode,
      orderInfo
    };

    setPaymentInfo(paymentData);

    if (responseCode === '00') {
      setStatus('success');
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-8 text-center">
        {status === 'processing' && (
          <>
            <div className="mb-6">
              <Loader className="w-16 h-16 text-teal-500 mx-auto animate-spin" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Đang xử lý...</h1>
            <p className="text-gray-600">Vui lòng chờ trong khi chúng tôi xác nhận thanh toán của bạn</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="mb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h1>
            <p className="text-gray-600 mb-6">
              Cảm ơn bạn! Thanh toán của bạn đã được xử lý thành công.
            </p>
            
            {paymentInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-semibold text-gray-900">{paymentInfo.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Số tiền:</span>
                    <span className="font-semibold text-gray-900">{paymentInfo.amount}đ</span>
                  </div>
                  {paymentInfo.bankCode && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ngân hàng:</span>
                      <span className="font-semibold text-gray-900">{paymentInfo.bankCode}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-6">
              Một email xác nhận đã được gửi đến email của bạn. Vui lòng kiểm tra email để biết thêm chi tiết đặt lịch.
            </p>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/customer-info')}
              >
                Xem lịch đặt của tôi
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/')}
              >
                Quay về trang chủ
              </Button>
            </div>
          </>
        )}

        {status === 'failed' && (
          <>
            <div className="mb-6">
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại!</h1>
            <p className="text-gray-600 mb-6">
              Rất tiếc, giao dịch thanh toán của bạn không thành công. Vui lòng thử lại.
            </p>

            {paymentInfo && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã giao dịch:</span>
                    <span className="font-semibold text-gray-900">{paymentInfo.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mã lỗi:</span>
                    <span className="font-semibold text-red-600">{paymentInfo.responseCode}</span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-600 mb-6">
              Vui lòng kiểm tra thông tin thanh toán của bạn và thử lại, hoặc liên hệ với chúng tôi nếu bạn cần hỗ trợ.
            </p>

            <div className="space-y-3">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate('/find-caregiver')}
              >
                Quay lại để thử lại
              </Button>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate('/support')}
              >
                Liên hệ hỗ trợ
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default PaymentReturn;
