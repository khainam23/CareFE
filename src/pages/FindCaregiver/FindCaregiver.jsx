import { useState, useMemo } from 'react';
import { Button, Input } from '@/components/common';
import { Star, MapPin, Clock } from 'lucide-react';

// Mock data
const MOCK_CAREGIVERS = [
  {
    id: 1,
    name: 'Nguyễn Thị Hương',
    type: 'Bảo mẫu toàn thời gian',
    experience: 5,
    rating: 4.8,
    reviews: 45,
    price: 150000,
    district: 'Quận 1',
    avatar: 'https://via.placeholder.com/200?text=Nguyen+Thi+Huong',
    description: '5 năm kinh nghiệm chăm sóc trẻ em, tổn tại kỹ năng...',
  },
  {
    id: 2,
    name: 'Trần Thị Mai',
    type: 'Bảo mẫu theo giờ',
    experience: 3,
    rating: 4.6,
    reviews: 32,
    price: 120000,
    district: 'Quận 2',
    avatar: 'https://via.placeholder.com/200?text=Tran+Thi+Mai',
    description: '3 năm kinh nghiệm, chuyên giáo dục sớm...',
  },
  {
    id: 3,
    name: 'Phạm Thị Linh',
    type: 'Người giúp việc nhà',
    experience: 7,
    rating: 4.9,
    reviews: 58,
    price: 180000,
    district: 'Quận 3',
    avatar: 'https://via.placeholder.com/200?text=Pham+Thi+Linh',
    description: '7 năm kinh nghiệm, tin cậy và tận tâm...',
  },
  {
    id: 4,
    name: 'Võ Thị Ngọc',
    type: 'Bảo mẫu toàn thời gian',
    experience: 4,
    rating: 4.7,
    reviews: 40,
    price: 160000,
    district: 'Quận 4',
    avatar: 'https://via.placeholder.com/200?text=Vo+Thi+Ngoc',
    description: '4 năm kinh nghiệm, có chứng chỉ chuyên môn...',
  },
  {
    id: 5,
    name: 'Đặng Thị Hà',
    type: 'Bảo mẫu theo giờ',
    experience: 2,
    rating: 4.5,
    reviews: 25,
    price: 110000,
    district: 'Quận 5',
    avatar: 'https://via.placeholder.com/200?text=Dang+Thi+Ha',
    description: '2 năm kinh nghiệm, vui vẻ và thân thiện...',
  },
  {
    id: 6,
    name: 'Hoàng Thị Lan',
    type: 'Bảo mẫu toàn thời gian',
    experience: 6,
    rating: 4.8,
    reviews: 52,
    price: 170000,
    district: 'Quận 1',
    avatar: 'https://via.placeholder.com/200?text=Hoang+Thi+Lan',
    description: '6 năm kinh nghiệm, được đánh giá cao...',
  },
  {
    id: 7,
    name: 'Lê Thị Thu',
    type: 'Người giúp việc nhà',
    experience: 5,
    rating: 4.6,
    reviews: 38,
    price: 140000,
    district: 'Quận 2',
    avatar: 'https://via.placeholder.com/200?text=Le+Thi+Thu',
    description: '5 năm kinh nghiệm, chuyên môn cao...',
  },
  {
    id: 8,
    name: 'Bùi Thị Hồng',
    type: 'Bảo mẫu theo giờ',
    experience: 3,
    rating: 4.7,
    reviews: 44,
    price: 125000,
    district: 'Quận 3',
    avatar: 'https://via.placeholder.com/200?text=Bui+Thi+Hong',
    description: '3 năm kinh nghiệm, giàu kinh nghiệm...',
  },
  {
    id: 9,
    name: 'Dương Thị Hương',
    type: 'Bảo mẫu toàn thời gian',
    experience: 8,
    rating: 4.9,
    reviews: 65,
    price: 190000,
    district: 'Quận 4',
    avatar: 'https://via.placeholder.com/200?text=Duong+Thi+Huong',
    description: '8 năm kinh nghiệm, chuyên gia trong lĩnh vực...',
  },
  {
    id: 10,
    name: 'Kiều Thị Hà',
    type: 'Bảo mẫu theo giờ',
    experience: 4,
    rating: 4.6,
    reviews: 35,
    price: 130000,
    district: 'Quận 5',
    avatar: 'https://via.placeholder.com/200?text=Kieu+Thi+Ha',
    description: '4 năm kinh nghiệm, chăm chỉ và trung thực...',
  },
  {
    id: 11,
    name: 'Tạ Thị Anh',
    type: 'Người giúp việc nhà',
    experience: 6,
    rating: 4.8,
    reviews: 48,
    price: 165000,
    district: 'Quận 1',
    avatar: 'https://via.placeholder.com/200?text=Ta+Thi+Anh',
    description: '6 năm kinh nghiệm, có tâm huyết...',
  },
  {
    id: 12,
    name: 'Nô Thị Kiều',
    type: 'Bảo mẫu toàn thời gian',
    experience: 5,
    rating: 4.7,
    reviews: 42,
    price: 155000,
    district: 'Quận 2',
    avatar: 'https://via.placeholder.com/200?text=No+Thi+Kieu',
    description: '5 năm kinh nghiệm, được khách hàng yêu thích...',
  },
];

const CAREGIVER_TYPES = ['Bảo mẫu toàn thời gian', 'Bảo mẫu theo giờ', 'Người giúp việc nhà'];
const GENDERS = ['Nữ', 'Nam', 'Không quan trọng'];
const DISTRICTS = ['Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5'];
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
  const [filters, setFilters] = useState({
    type: '',
    gender: '',
    district: '',
    rating: 0,
    experience: '',
    priceMin: 0,
    priceMax: 200000,
    search: '',
  });

  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({
      type: '',
      gender: '',
      district: '',
      rating: 0,
      experience: '',
      priceMin: 0,
      priceMax: 200000,
      search: '',
    });
    setCurrentPage(1);
  };

  // Filter caregivers based on current filters
  const filteredCaregivers = useMemo(() => {
    return MOCK_CAREGIVERS.filter(caregiver => {
      // Filter by type
      if (filters.type && caregiver.type !== filters.type) return false;

      // Filter by district
      if (filters.district && caregiver.district !== filters.district) return false;

      // Filter by rating
      if (filters.rating > 0 && caregiver.rating < filters.rating) return false;

      // Filter by experience
      if (filters.experience) {
        const range = EXPERIENCE_RANGES.find(r => r.label === filters.experience);
        if (range && (caregiver.experience < range.min || caregiver.experience > range.max)) {
          return false;
        }
      }

      // Filter by price
      if (caregiver.price < filters.priceMin || caregiver.price > filters.priceMax) {
        return false;
      }

      // Filter by search (name)
      if (filters.search && !caregiver.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [filters]);

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

  const CaregiverCard = ({ caregiver }) => (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4">
        <img
          src={caregiver.avatar}
          alt={caregiver.name}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
        <h3 className="text-lg font-bold text-gray-800">{caregiver.name}</h3>
        <p className="text-sm text-gray-600">{caregiver.description}</p>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 text-gray-700">
          <Clock size={16} className="text-teal-500" />
          <span className="text-sm">{caregiver.type}</span>
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <MapPin size={16} className="text-teal-500" />
          <span className="text-sm">{caregiver.district}</span>
        </div>

        <div className="flex items-center justify-between">
          <StarRating rating={caregiver.rating} />
          <span className="text-xs text-gray-500">({caregiver.reviews})</span>
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">Giá / giờ</p>
              <p className="text-lg font-bold text-teal-600">
                {caregiver.price.toLocaleString()}đ
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Kinh nghiệm</p>
              <p className="text-lg font-bold text-gray-800">{caregiver.experience}+ năm</p>
            </div>
          </div>
        </div>

        <button className="w-full bg-teal-500 text-white py-2 rounded-lg hover:bg-teal-600 transition-colors font-medium text-sm">
          Xem chi tiết
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tìm kiếm Bảo mẫu</h1>
          <p className="text-gray-600">Tìm bảo mẫu phù hợp nhất cho gia đình bạn</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Bộ lọc</h2>

              {/* Search Input */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tìm kiếm
                </label>
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  placeholder="Tên bảo mẫu..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {/* Caregiver Type */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại bảo mẫu
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Tất cả loại</option>
                  {CAREGIVER_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giới tính
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleFilterChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Tất cả</option>
                  {GENDERS.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              {/* District */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quận
                </label>
                <select
                  value={filters.district}
                  onChange={(e) => handleFilterChange('district', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Tất cả quận</option>
                  {DISTRICTS.map(district => (
                    <option key={district} value={district}>{district}</option>
                  ))}
                </select>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá tối thiểu
                </label>
                <select
                  value={filters.rating}
                  onChange={(e) => handleFilterChange('rating', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="0">Tất cả</option>
                  {RATING_OPTIONS.map(rating => (
                    <option key={rating} value={rating}>{rating}⭐ trở lên</option>
                  ))}
                </select>
              </div>

              {/* Experience */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Năm kinh nghiệm
                </label>
                <select
                  value={filters.experience}
                  onChange={(e) => handleFilterChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                >
                  <option value="">Tất cả</option>
                  {EXPERIENCE_RANGES.map(range => (
                    <option key={range.label} value={range.label}>{range.label}</option>
                  ))}
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giá / giờ
                </label>
                <div className="flex flex-col gap-2">
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
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-gray-400 text-sm">-</span>
                  <input
                    type="number"
                    max="200000"
                    value={filters.priceMax}
                    onChange={(e) => {
                      const newMax = parseInt(e.target.value) || 200000;
                      if (newMax >= filters.priceMin) {
                        handleFilterChange('priceMax', newMax);
                      }
                    }}
                    placeholder="Đến"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleSearch}
                  variant="primary"
                  className="w-full"
                >
                  Tìm kiếm
                </Button>
                <Button
                  onClick={handleReset}
                  variant="secondary"
                  className="w-full"
                >
                  Đặt lại
                </Button>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
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
                            className={`px-3 py-2 rounded-lg font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-teal-500 text-white'
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default FindCaregiver;
