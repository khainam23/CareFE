import { useState, useEffect } from 'react';
import { Star, Search, Filter, Trash2 } from 'lucide-react';
import axiosInstance from '@api/axiosConfig';
import Swal from 'sweetalert2';
import { useAuthStore } from '@store/authStore';

const ReviewsList = () => {
  const { hasRole } = useAuthStore();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('ALL');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/admin/reviews/list');
      if (response.data.success) {
        // Backend trả về array trực tiếp
        const reviewsData = response.data.data || [];
        setReviews(Array.isArray(reviewsData) ? reviewsData : []);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      Swal.fire('Lỗi', 'Không thể tải danh sách đánh giá', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const result = await Swal.fire({
      title: 'Xác nhận xóa đánh giá?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy',
    });

    if (result.isConfirmed) {
      try {
        const response = await axiosInstance.delete(`/api/admin/reviews/${reviewId}`);
        if (response.data.success) {
          Swal.fire('Thành công', 'Đã xóa đánh giá', 'success');
          fetchReviews();
        }
      } catch (error) {
        console.error('Failed to delete review:', error);
        Swal.fire('Lỗi', 'Không thể xóa đánh giá', 'error');
      }
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-chilled-gray-300'}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.caregiver?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = ratingFilter === 'ALL' || review.rating === parseInt(ratingFilter);
    return matchesSearch && matchesRating;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-charcoal-900 mb-2">Quản lý Đánh giá</h1>
        <p className="text-chilled-gray-500">Xem và quản lý tất cả đánh giá trong hệ thống</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chilled-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khách hàng, caregiver, nội dung..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-chilled-gray-400" size={20} />
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-chilled-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent appearance-none"
            >
              <option value="ALL">Tất cả đánh giá</option>
              <option value="5">5 sao</option>
              <option value="4">4 sao</option>
              <option value="3">3 sao</option>
              <option value="2">2 sao</option>
              <option value="1">1 sao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-chilled-gray-500">
            Không tìm thấy đánh giá nào
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div key={review.id} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-chilled-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-chilled-gray-600 mb-2">
                    <span className="font-medium text-charcoal-900">{review.customer?.fullName}</span>
                    <span>→</span>
                    <span className="font-medium text-charcoal-900">{review.caregiver?.fullName}</span>
                  </div>
                  <p className="text-chilled-gray-700 mb-3">{review.comment}</p>
                  {review.caregiverResponse && (
                    <div className="bg-chilled-gray-50 rounded-lg p-3 mt-3">
                      <div className="text-sm font-medium text-charcoal-900 mb-1">Phản hồi từ Caregiver:</div>
                      <p className="text-sm text-chilled-gray-700">{review.caregiverResponse}</p>
                      <div className="text-xs text-chilled-gray-500 mt-1">
                        {new Date(review.responseDate).toLocaleDateString('vi-VN')}
                      </div>
                    </div>
                  )}
                </div>
                {hasRole('ADMIN') && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="ml-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Xóa đánh giá"
                  >
                    <Trash2 size={20} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="text-sm text-chilled-gray-500 mb-1">Tổng đánh giá</div>
          <div className="text-2xl font-bold text-charcoal-900">{reviews.length}</div>
        </div>
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-chilled-gray-500 mb-1">{rating} sao</div>
            <div className="text-2xl font-bold text-yellow-600">
              {reviews.filter((r) => r.rating === rating).length}
            </div>
          </div>
        ))}
      </div>

      {/* Average Rating */}
      <div className="mt-4 bg-white rounded-lg shadow-sm p-6">
        <div className="text-center">
          <div className="text-sm text-chilled-gray-500 mb-2">Đánh giá trung bình</div>
          <div className="text-4xl font-bold text-charcoal-900 mb-2">
            {reviews.length > 0
              ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
              : '0.0'}
          </div>
          <div className="flex justify-center">{renderStars(Math.round(reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length))}</div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsList;
