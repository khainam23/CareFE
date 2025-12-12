import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, MapPin, Clock, Calendar, Award, Phone, Mail, ArrowLeft, MessageCircle, User, FileText, Briefcase } from 'lucide-react';
import { publicService } from '@/services/publicService';
import { customerService } from '@/services/customerService';
import { Button, BookingModal } from '@/components/common';
import { useAuthStore } from '@/store/authStore';
import Swal from 'sweetalert2';

function CaregiverDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [caregiver, setCaregiver] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchCaregiverData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch caregiver details
        const caregiverResponse = await publicService.getCaregiverDetail(id);
        console.log('Caregiver Detail:', caregiverResponse);
        
        if (caregiverResponse.success && caregiverResponse.data) {
          setCaregiver(caregiverResponse.data);
        } else if (caregiverResponse.data) {
          setCaregiver(caregiverResponse.data);
        } else {
          setCaregiver(caregiverResponse);
        }

        // Fetch reviews
        try {
          const reviewsResponse = await publicService.getCaregiverReviews(id);
          console.log('Reviews:', reviewsResponse);
          
          if (reviewsResponse.success && reviewsResponse.data) {
            setReviews(Array.isArray(reviewsResponse.data) ? reviewsResponse.data : []);
          } else if (Array.isArray(reviewsResponse)) {
            setReviews(reviewsResponse);
          } else if (Array.isArray(reviewsResponse.data)) {
            setReviews(reviewsResponse.data);
          } else {
            setReviews([]);
          }
        } catch (reviewError) {
          console.error('Error fetching reviews:', reviewError);
          setReviews([]);
        }
      } catch (err) {
        console.error('Error fetching caregiver:', err);
        const errorMsg = err?.message || err?.error || 'Không thể tải thông tin bảo mẫu';
        setError(errorMsg);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCaregiverData();
    }
  }, [id]);

  const StarRating = ({ rating, size = 20, showNumber = true }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
      {showNumber && <span className="text-lg font-semibold ml-2">{rating.toFixed(1)}</span>}
    </div>
  );

  const handleBooking = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/caregivers/${id}` } });
      return;
    }

    // Check if user has customer role (handle both ROLE_CUSTOMER and customer)
    const hasCustomerRole = user?.roles?.some(role => 
      role === 'ROLE_CUSTOMER' || role === 'customer' || role.toLowerCase().includes('customer')
    );

    if (!hasCustomerRole) {
      alert('Chỉ khách hàng mới có thể đặt lịch dịch vụ');
      return;
    }

    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      const formattedData = {
        serviceId: bookingData.serviceId,
        caregiverId: bookingData.caregiverId,
        scheduledStartTime: `${bookingData.startDate}T${bookingData.startTime}:00`,
        scheduledEndTime: `${bookingData.endDate}T${bookingData.endTime}:00`,
        location: bookingData.location || '',
        customerNote: bookingData.notes || '',
      };

      console.log('Sending booking data:', formattedData);
      const response = await customerService.createBooking(formattedData);
      console.log('Booking created response:', response);
      
      const bookingId = response.data?.id || response.id;
      console.log('Extracted bookingId:', bookingId);

      if (!bookingId) {
        throw new Error('Không tìm được ID booking từ response. Response: ' + JSON.stringify(response));
      }

      console.log('Creating payment for booking ID:', bookingId);
      const paymentResponse = await customerService.createPayment({
        bookingId,
        paymentMethod: 'SYSTEM'
      });
      console.log('Payment response:', paymentResponse);

      if (paymentResponse.success || paymentResponse.data) {
        await Swal.fire({
          icon: 'success',
          title: 'Thành công',
          text: 'Đặt lịch và thanh toán thành công!',
          confirmButtonColor: '#14b8a6'
        });
        setIsBookingModalOpen(false);
      } else {
        throw new Error('Thanh toán không thành công');
      }
    } catch (err) {
      console.error('Booking error:', err);
      let errorMessage = err?.message || 'Có lỗi xảy ra khi đặt lịch';
      
      if (err?.data && typeof err.data === 'object') {
        const validationErrors = Object.entries(err.data)
          .map(([field, message]) => `${field}: ${message}`)
          .join(', ');
        if (validationErrors) {
          errorMessage += ` - ${validationErrors}`;
        }
      }
      
      console.error('Error details:', err);
      await Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: errorMessage,
        confirmButtonColor: '#ef4444'
      });
    }
  };

  const ReviewCard = ({ review }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">{review.customerName || 'Khách hàng'}</h4>
          <StarRating rating={review.rating || 0} size={16} showNumber={false} />
        </div>
        <span className="text-sm text-gray-500">
          {review.createdAt ? new Date(review.createdAt).toLocaleDateString('vi-VN') : ''}
        </span>
      </div>
      <p className="text-gray-700">{review.comment || 'Không có nhận xét'}</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-500 text-lg">Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (error || !caregiver) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl mb-4">{error || 'Không tìm thấy thông tin bảo mẫu'}</p>
          <Button onClick={() => navigate(-1)} variant="primary">
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: User },
    { id: 'about', label: 'Giới thiệu', icon: FileText },
    { id: 'skills', label: 'Kỹ năng & Chứng chỉ', icon: Briefcase },
    { id: 'reviews', label: 'Đánh giá', icon: Star },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-48 h-48 bg-gradient-to-br from-teal-100 to-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-8xl text-gray-400">👤</span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {caregiver.fullName || 'N/A'}
                </h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <StarRating rating={caregiver.averageRating || 0} />
                  <span className="text-gray-500">({caregiver.totalReviews || 0} đánh giá)</span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin size={20} className="text-teal-500" />
                    <span>{caregiver.address || 'N/A'}</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-700">
                    <Award size={20} className="text-teal-500" />
                    <span>{caregiver.yearsOfExperience || 0}+ năm kinh nghiệm</span>
                  </div>

                  {caregiver.phoneNumber && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Phone size={20} className="text-teal-500" />
                      <span>{caregiver.phoneNumber}</span>
                    </div>
                  )}

                  {caregiver.email && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail size={20} className="text-teal-500" />
                      <span>{caregiver.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
            <p className="text-gray-700 leading-relaxed">
              {caregiver.bio || 'Chưa có thông tin giới thiệu'}
            </p>
          </div>
        );

      case 'skills':
        return (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Kỹ năng & Chứng chỉ</h2>
            
            {caregiver.skills && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Kỹ năng</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(caregiver.skills) ? caregiver.skills : caregiver.skills.split(',')).map((skill, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-teal-50 text-teal-700 rounded-full text-sm font-medium"
                    >
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {caregiver.certifications && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Chứng chỉ</h3>
                <div className="flex flex-wrap gap-2">
                  {(Array.isArray(caregiver.certifications) ? caregiver.certifications : caregiver.certifications.split(',')).map((cert, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                    >
                      {cert.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {!caregiver.skills && !caregiver.certifications && (
              <p className="text-gray-500 text-center py-8">Chưa có thông tin kỹ năng và chứng chỉ</p>
            )}
          </div>
        );

      case 'reviews':
        return (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Đánh giá ({reviews.length})
            </h2>
            
            {reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Chưa có đánh giá nào</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review, index) => (
                  <ReviewCard key={review.id || index} review={review} />
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Quay lại</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content with Tabs */}
          <div className="lg:col-span-2">
            {/* Tabs Navigation */}
            <div className="bg-white rounded-t-lg shadow-sm border-b">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'text-teal-600 border-b-2 border-teal-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="mt-0">
              {renderTabContent()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Thông tin giá</h3>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Giá theo giờ</p>
                <p className="text-4xl font-bold text-teal-600">
                  {(caregiver.hourlyRate || 0).toLocaleString()}đ
                </p>
                <p className="text-sm text-gray-500 mt-1">/ giờ</p>
              </div>

              <div className="border-t pt-6 mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Thời gian làm việc</h4>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-teal-500" />
                    <span>Linh hoạt theo lịch</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <Button variant="primary" className="w-full" onClick={handleBooking}>
                  Đặt lịch ngay
                </Button>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="text-xs text-gray-500 text-center">
                  Bằng cách đặt lịch, bạn đồng ý với điều khoản dịch vụ của chúng tôi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        caregiver={caregiver}
        onSubmit={handleBookingSubmit}
      />
    </div>
  );
}

export default CaregiverDetail;
