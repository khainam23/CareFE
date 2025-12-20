import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Clock, AlertCircle, Download, Search, Filter, Calendar } from 'lucide-react';
import { caregiverService } from '@/services/caregiverService';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const PaymentHistory = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await caregiverService.getPayments();
      if (response.success && response.data) {
        setPayments(response.data);
      }
    } catch (err) {
      console.error('Error fetching payments:', err);
      setPayments([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = (payment) => {
    const doc = new jsPDF();

    // Helper to remove accents for PDF compatibility (since we don't have custom fonts loaded)
    const removeAccents = (str) => {
      if (!str) return '';
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D");
    };

    // Header
    doc.setFontSize(22);
    doc.setTextColor(0, 128, 128); // Teal color
    doc.text("HOA DON THANH TOAN", 105, 20, { align: "center" });
    
    // Company Info (Mock)
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Care Service Platform", 105, 28, { align: "center" });
    doc.text("Website: www.care-service.com", 105, 33, { align: "center" });

    // Invoice Details
    doc.setFontSize(12);
    doc.setTextColor(0);
    
    const startY = 50;
    doc.text(`Ma giao dich: ${payment.transactionId || payment.id}`, 20, startY);
    doc.text(`Ngay: ${formatDate(payment.paidAt || payment.createdAt)}`, 20, startY + 10);
    // doc.text(`Khach hang: ${removeAccents(payment.customerName)}`, 20, startY + 20);
    doc.text(`Trang thai: ${payment.status === 'COMPLETED' ? 'DA THANH TOAN' : removeAccents(payment.status)}`, 20, startY + 30);

    // Table
    autoTable(doc, {
      startY: startY + 45,
      head: [['Dich vu', 'So luong', 'Don gia', 'Thanh tien']],
      body: [
        [
          removeAccents(payment.serviceName || payment.notes), 
          '1', 
          formatCurrency(payment.amount).replace(/[^0-9.,]/g, '') + ' VND', 
          formatCurrency(payment.amount).replace(/[^0-9.,]/g, '') + ' VND'
        ]
      ],
      theme: 'grid',
      headStyles: { fillColor: [0, 128, 128] },
    });

    // Total
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Tong cong: ${formatCurrency(payment.amount).replace(/[^0-9.,]/g, '')} VND`, 140, finalY, { align: "right" }); // Align right doesn't work well with x coordinate as end, need to adjust

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(150);
    doc.text("Cam on quy khach da su dung dich vu!", 105, 280, { align: "center" });

    doc.save(`invoice_${payment.transactionId || payment.id}.pdf`);
  };

  // Calculate statistics
  const allPayments = payments;
  
  const mapStatus = (status) => {
    const statusMap = {
      'COMPLETED': 'Đã thanh toán',
      'PENDING': 'Đang xử lý',
      'FAILED': 'Thất bại',
      'PROCESSING': 'Đang xử lý'
    };
    return statusMap[status] || status;
  };

  const stats = {
    totalEarnings: allPayments
      .filter(p => mapStatus(p.status) === 'Đã thanh toán')
      .reduce((sum, p) => sum + (p.amount || 0), 0),
    totalPending: allPayments
      .filter(p => mapStatus(p.status) === 'Đang xử lý')
      .reduce((sum, p) => sum + (p.amount || 0), 0),
    totalTransactions: allPayments.length,
  };

  // Filter payments
  const getFilteredPayments = () => {
    let filtered = allPayments;

    if (activeTab === 'paid') {
      filtered = filtered.filter(p => mapStatus(p.status) === 'Đã thanh toán');
    } else if (activeTab === 'pending') {
      filtered = filtered.filter(p => mapStatus(p.status) === 'Đang xử lý');
    } else if (activeTab === 'failed') {
      filtered = filtered.filter(p => mapStatus(p.status) === 'Thất bại');
    }

    if (searchTerm) {
      filtered = filtered.filter(p =>
        (p.description || p.notes || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.transactionId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.bookingCode || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const mappedStatus = mapStatus(status);
    switch (mappedStatus) {
      case 'Đã thanh toán':
        return 'bg-green-100 text-green-700';
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-700';
      case 'Thất bại':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };



  const filteredPayments = getFilteredPayments();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header with statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">Tổng thu nhập</span>
              <span className="block text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.totalEarnings)}
              </span>
              <span className="text-xs text-gray-500 mt-1">(Đã thanh toán)</span>
            </div>
            <TrendingUp size={32} className="text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">Đang chờ thanh toán</span>
              <span className="block text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(stats.totalPending)}
              </span>
              <span className="text-xs text-gray-500 mt-1">({allPayments.filter(p => mapStatus(p.status) === 'Đang xử lý').length} giao dịch)</span>
            </div>
            <Clock size={32} className="text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium text-gray-600">Tổng giao dịch</span>
              <span className="block text-3xl font-bold text-gray-900 mt-2">{stats.totalTransactions}</span>
              <span className="text-xs text-gray-500 mt-1">giao dịch</span>
            </div>
            <DollarSign size={32} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mô tả, ID giao dịch hoặc hóa đơn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-teal-500 text-teal-500 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
            <Filter size={18} />
            Lọc
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-teal-500 text-teal-500 rounded-lg font-semibold hover:bg-teal-50 transition-colors">
            <Calendar size={18} />
            Khoảng ngày
          </button>
        </div>
      </div>

      {/* Tabs for filtering */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tất cả ({allPayments.length})
          </button>
          <button
            onClick={() => setActiveTab('paid')}
            className={`py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'paid'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Đã thanh toán ({allPayments.filter(p => mapStatus(p.status) === 'Đã thanh toán').length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'pending'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Đang xử lý ({allPayments.filter(p => mapStatus(p.status) === 'Đang xử lý').length})
          </button>
          <button
            onClick={() => setActiveTab('failed')}
            className={`py-4 px-6 font-semibold transition-colors whitespace-nowrap ${
              activeTab === 'failed'
                ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Thất bại ({allPayments.filter(p => mapStatus(p.status) === 'Thất bại').length})
          </button>
        </div>

        {/* Payment List */}
        <div className="p-6 space-y-4">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <div
                key={payment.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{payment.notes || payment.description || 'Thanh toán dịch vụ'}</h4>
                    <p className="text-sm text-gray-600 mt-1">ID: {payment.transactionId || payment.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                    {mapStatus(payment.status)}
                  </span>
                </div>

                {/* Payment Details Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <span className="text-xs font-semibold text-gray-600">Ngày giao dịch</span>
                    <p className="text-sm text-gray-900 font-medium mt-1">{formatDate(payment.paidAt || payment.createdAt)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600">Phương thức thanh toán</span>
                    <p className="text-sm text-gray-900 font-medium mt-1">{payment.paymentMethod || 'Chuyển khoản'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600">Mã đơn</span>
                    <p className="text-sm text-gray-900 font-medium mt-1">{payment.bookingCode || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-600">Số hóa đơn</span>
                    <p className="text-sm text-gray-900 font-medium mt-1">{payment.invoiceNumber || payment.transactionId || 'N/A'}</p>
                  </div>
                </div>

                {/* Amount and Actions */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <div>
                    <span className="text-sm text-gray-600">Số tiền</span>
                    <p className="text-2xl font-bold text-teal-600 mt-1">{formatCurrency(payment.amount || 0)}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleDownloadInvoice(payment)}
                      className="flex items-center gap-2 bg-white border-2 border-gray-300 text-gray-600 py-2 px-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Download size={16} />
                      Tải hóa đơn
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <AlertCircle size={32} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 font-medium">Không tìm thấy giao dịch nào</p>
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary Card */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg shadow-md p-6 ">
        <h3 className="text-lg font-semibold mb-4">Tóm tắt thanh toán</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <span className="text-sm opacity-90">Tổng thu nhập (năm nay)</span>
            <p className="text-2xl font-bold mt-2">
              {formatCurrency(stats.totalEarnings)}
            </p>
          </div>
          <div>
            <span className="text-sm opacity-90">Trung bình mỗi tháng</span>
            <p className="text-2xl font-bold mt-2">
              {formatCurrency(Math.round(stats.totalEarnings / 6))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;