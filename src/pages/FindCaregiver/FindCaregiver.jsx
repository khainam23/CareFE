import { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/common';
import { Star, MapPin } from 'lucide-react';
import { publicService } from '@/services/publicService';
import { useNavigate } from 'react-router-dom';

const DISTRICTS = ['Quận Hải Châu', 'Quận Thanh Khê', 'Quận Sơn Trà', 'Quận Ngũ Hành Sơn', 'Quận Liên Chiểu'];
const RATING_OPTIONS = [5, 4, 3, 2, 1];
const EXPERIENCE_RANGES = [
  { label: 'Dưới 1 năm', min: 0, max: 1 },
  { label: '1-3 năm', min: 1, max: 3 },
  { label: '3-5 năm', min: 3, max: 5 },
  { label: '5-10 năm', min: 5, max: 10 },
  { label: 'Trên 10 năm', min: 10, max: 100 },
];

const ITEMS_PER_PAGE = 8;

function FindCaregiver() {
  const navigate = useNavigate();
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    district: '',
    rating: 0,
    experience: '',
    priceMin: 0,
    priceMax: 1000000,
    search: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  // Fetch caregivers from API
  useEffect(() => {
    const fetchCaregivers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await publicService.getCaregivers();

        console.log('API Response:', response);

        // Extract data from ApiResponse structure
        const caregiversList = response?.data || response || [];
        console.log('Caregivers list:', caregiversList);
        setCaregivers(Array.isArray(caregiversList) ? caregiversList : []);
      } catch (err) {
        console.error('Error fetching caregivers:', err);
        const errorMsg = err?.message || err?.error || JSON.stringify(err) || 'Không thể tải danh sách bảo mẫu';
        setError(errorMsg);
        setCaregivers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCaregivers();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      district: '',
      rating: 0,
      experience: '',
      priceMin: 0,
      priceMax: 1000000,
      search: '',
    });
    setCurrentPage(1);
  };

  // Filter caregivers based on current filters
  const filteredCaregivers = useMemo(() => {
    return caregivers.filter(caregiver => {
      // Filter by district (address from backend)
      if (filters.district && !caregiver.address?.includes(filters.district)) return false;

      // Filter by rating (rating from backend)
      if (filters.rating > 0 && (caregiver.rating || 0) < filters.rating) return false;

      // Filter by experience (experienceYears from backend)
      if (filters.experience) {
        const range = EXPERIENCE_RANGES.find(r => r.label === filters.experience);
        const experience = caregiver.experienceYears || 0;
        if (range && (experience < range.min || experience > range.max)) {
          return false;
        }
      }

      // Filter by price (hourlyRate from backend)
      const price = caregiver.hourlyRate || 0;
      if (price < filters.priceMin || price > filters.priceMax) {
        return false;
      }

      // Filter by search (fullName from backend)
      if (filters.search && !caregiver.fullName?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [caregivers, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredCaregivers.length / ITEMS_PER_PAGE);
  const paginatedCaregivers = filteredCaregivers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const StarRating = ({ rating }) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
      <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>
    </div>
  );

  const CaregiverCard = ({ caregiver }) => {
    const [imageError, setImageError] = useState(false);

    const handleViewDetail = () => {
      navigate(`/caregivers/${caregiver.id}`);
    };

    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4">
          <div className="w-full h-60 bg-gray-200 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
            {caregiver.avatarUrl && !imageError ? (
              <img
                src={caregiver.avatarUrl}
                alt={caregiver.fullName}
                className="w-full h-full object-cover" style={{ objectPosition: '30% 30%' }}
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-4xl text-gray-400">👤</span>
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-800">{caregiver.fullName || 'N/A'}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{caregiver.bio || 'Chưa có mô tả'}</p>
        </div>

        <div className="p-4 space-y-3">

          <div className="flex items-center gap-2 text-gray-700">
            <MapPin size={16} className="text-teal-500" />
            <span className="text-sm line-clamp-1">{caregiver.address || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between">
            <StarRating rating={caregiver.rating || 0} />
            <span className="text-xs text-gray-500">({caregiver.totalReviews || 0})</span>
          </div>

          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-xs text-gray-500">Kinh nghiệm</p>
                <p className="text-lg font-bold text-gray-800">{caregiver.experienceYears || 0}+ năm</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleViewDetail}
            className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium text-sm"
          >
            Xem chi tiết
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tìm kiếm Bảo mẫu</h1>
          <p className="text-gray-600">Tìm bảo mẫu phù hợp nhất cho gia đình bạn</p>
        </div>

        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="flex gap-3 flex-wrap items-end">
              {/* Search Input */}
              <div className="flex-1 min-w-48">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Tìm kiếm..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* District */}
              <div className="flex-1 min-w-40">
                <select
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Quận</option>
                  {DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="flex-1 min-w-36">
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="0">Đánh giá</option>
                  {RATING_OPTIONS.map(rating => (
                    <option key={rating} value={rating}>{rating}⭐ trở lên</option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div className="flex-1 min-w-40">
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Kinh nghiệm</option>
                  {EXPERIENCE_RANGES.map(range => (
                    <option key={range.label} value={range.label}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="flex gap-2 min-w-48">
                <input
                  type="number"
                  min="0"
                  value={filters.priceMin}
                  onChange={(e) => {
                    const newMin = parseInt(e.target.value) || 0;
                    if (newMin <= filters.priceMax) {
                      handleFilterChange('priceMin', newMin);
                    }
                  }}
                  placeholder="Từ"
                  className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  max="1000000"
                  value={filters.priceMax}
                  onChange={(e) => {
                    const newMax = parseInt(e.target.value) || 1000000;
                    if (newMax >= filters.priceMin) {
                      handleFilterChange('priceMax', newMax);
                    }
                  }}
                  placeholder="Đến"
                  className="flex-1 px-2 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Action Buttons */}
              <Button
                onClick={handleSearch}
                variant="primary"
                className="px-4 py-2 text-sm text-white"
              >
                Tìm
              </Button>
              <Button
                onClick={handleReset}
                variant="secondary"
                className="px-4 py-2 text-sm"
              >
                Đặt lại
              </Button>
            </div>
          </div>

          {/* Results */}
          <div>
            {/* Loading State */}
            {loading ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
                <p className="text-gray-500">Đang tải danh sách bảo mẫu...</p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-red-500 text-lg mb-2">Lỗi: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-teal-500  rounded-lg hover:bg-teal-600"
                >
                  Thử lại
                </button>
              </div>
            ) : (
              <>
                {/* Results Info */}
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">
                      Tìm thấy <span className="font-bold text-gray-900">{filteredCaregivers.length}</span> bảo mẫu
                    </p>
                  </div>
                  {filteredCaregivers.length > 0 && (
                    <p className="text-sm text-gray-500">
                      Hiển thị {(currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, filteredCaregivers.length)} trong {filteredCaregivers.length}
                    </p>
                  )}
                </div>

                {/* No Results */}
                {filteredCaregivers.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                    <p className="text-gray-500 text-lg mb-2">Không tìm thấy bảo mẫu phù hợp</p>
                    <p className="text-gray-400">Vui lòng thử lại với các bộ lọc khác</p>
                  </div>
                ) : (
                  <>
                    {/* Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {paginatedCaregivers.map(caregiver => (
                        <CaregiverCard key={caregiver.id} caregiver={caregiver} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Trước
                        </button>

                        {[...Array(totalPages)].map((_, i) => {
                          const pageNum = i + 1;
                          // Show current, adjacent, and first/last pages
                          if (
                            pageNum === 1 ||
                            pageNum === totalPages ||
                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                          ) {
                            return (
                              <button
                                key={pageNum}
                                onClick={() => setCurrentPage(pageNum)}
                                className={`px-3 py-2 rounded-lg font-medium transition-colors ${currentPage === pageNum
                                    ? 'bg-teal-500 '
                                    : 'border border-gray-300 hover:bg-gray-50'
                                  }`}
                              >
                                {pageNum}
                              </button>
                            );
                          } else if (
                            (pageNum === currentPage - 2 || pageNum === currentPage + 2)
                          ) {
                            return (
                              <span key={pageNum} className="px-2 py-2">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}

                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Tiếp
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindCaregiver;
