import React, { useState } from 'react';
import { Button, Input } from '@/components/common';
import image41 from '@/assets/images/image 41.svg';
import rectangle200 from '@/assets/images/Rectangle 200.svg';
import rectangle201 from '@/assets/images/Rectangle 201.svg';
import rectangle202 from '@/assets/images/Rectangle 202.svg';
import DatePickerInput from '@/components/DatePickerInput';
import { Phone, Mail, MapPin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import ServiceCard from './ServiceCard';
import ProcessStep from './ProcessStep';
import ContactCard from './ContactCard';

const Home = () => {
  const heroRef = useScrollAnimation('animate__fadeInDown');
  const searchRef = useScrollAnimation('animate__fadeInUp');
  const servicesRef = useScrollAnimation('animate__fadeInUp');
  const processRef = useScrollAnimation('animate__fadeInUp');
  const contactRef = useScrollAnimation('animate__fadeInUp');

  const [searchForm, setSearchForm] = useState({
    location: '',
    time: '',
    name: '',
  });

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchForm(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (value) => {
    setSearchForm(prev => ({ ...prev, time: value }));
  };

  const handleSearch = () => {
    console.log('Search:', searchForm);
    // Handle search logic
  };

  const services = [
    {
      title: 'Chăm sóc tại nhà',
      description: 'Hỗ trợ, chăm sóc các hoạt động hàng ngày'
    },
    {
      title: 'Theo dõi sức khỏe',
      description: 'Theo dõi sức khỏe, hỗ trợ chăm sóc'
    },
    {
      title: 'Dịch vụ linh hoạt',
      description: 'Hỗ trợ, chăm sóc các hoạt động hàng ngày'
    },
    {
      title: 'Trải nghiệm tối ưu người dùng',
      description: 'Hỗ trợ, chăm sóc các hoạt động hàng ngày'
    }
  ];

  const processSteps = [
    {
      number: 1,
      title: 'Chọn dịch vụ',
      description: 'Chọn dịch vụ và người chăm sóc phù hợp với bạn',
      image: rectangle200
    },
    {
      number: 2,
      title: 'Chọn thời gian và địa điểm',
      description: 'Xác định ngày, giờ và địa điểm để đặt dịch vụ LifeEase trong vòng chưa đầy 60 giây. Bạn có thể tùy chọn số lần sử dụng theo nhu cầu.',
      image: rectangle201
    },
    {
      number: 3,
      title: 'Tiến hành công việc',
      description: 'Người chăm sóc sẽ xác nhận đến nhà bạn như đã hẹn và thực hiện nhiệm vụ. Chất lượng, sự chuyên nghiệp luôn được đảm bảo 100%.',
      image: rectangle202
    },
    {
      number: 4,
      title: 'Đánh giá và xếp hạng',
      description: 'Bạn có thể đánh giá chất lượng dịch vụ.',
      image: rectangle200
    }
  ];

  return (
    <div className="min-h-screen bg-white">
       <section ref={heroRef} className="relative h-96 bg-cover bg-center rounded-lg overflow-hidden">
          <img 
            src={image41} 
            alt="Hero Banner" 
            className="absolute w-full h-full object-cover object-top"
          />
          <div className="absolute top-12 right-12  max-w-md">
            <p className="text-2xl font-bold leading-tight">
              Chăm sóc tận tâm - bình an mỗi ngày
            </p>
            <p className="text-sm mt-3 leading-relaxed">
              Kết nối gia đình với đội ngũ chăm sóc tận tâm, minh bạch và đánh tin cậy
            </p>
          </div>
        </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Section */}
        <section ref={searchRef} className="py-4 px-4 bg-green-100 rounded-lg mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Tìm nhà chăm sóc phù hợp</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <Input
              label="Tìm theo vị trí (Quận, huyện)"
              name="location"
              value={searchForm.location}
              onChange={handleSearchChange}
              placeholder="Nhập vị trí..."
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tìm theo thời gian
              </label>
              <DatePickerInput
                value={searchForm.time}
                onChange={handleDateChange}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 cursor-pointer"
              />
            </div>
            <Input
              label="Tìm theo tên"
              name="name"
              value={searchForm.name}
              onChange={handleSearchChange}
              placeholder="Nhập tên..."
            />
            <Button 
              onClick={handleSearch}
              className="h-10 transition-all duration-300 hover:animate__animated hover:animate__pulse"
            >
              Tìm kiếm
            </Button>
          </div>
        </section>

        {/* Services Section */}
        <section ref={servicesRef} className="py-16 mt-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            An tâm với lựa chọn của bạn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <ServiceCard key={index} service={service} index={index} />
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section ref={processRef} className="py-16 mt-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Quy trình sử dụng dịch vụ
          </h2>
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <ProcessStep key={step.number} step={step} index={index} />
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef} className="py-16 mt-12 mb-8">
          <div className="bg-green-100 rounded-lg p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                Liên hệ ngay
              </h2>
              <p className="text-gray-600 text-lg">
                Chúng tôi luôn sẵn sàng hỗ trợ và tư vấn cho bạn
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <ContactCard icon={Phone} title="Hotline" text="24/7 hỗ trợ khách hàng" link="tel:1900123456" linkText="1900 123 456" />
              <ContactCard icon={Mail} title="Email" text="Gửi email cho chúng tôi" link="mailto:support@careservice.com" linkText="support@careservice.com" />
              <ContactCard icon={MapPin} title="Địa chỉ" text="Văn phòng chính" linkText="123 Nguyễn Huệ, Quận 1<br/>TP. Hồ Chí Minh" isAddress />
            </div>

            <div className="text-center">
              <Button 
                onClick={() => window.location.href = '/register'}
                className="px-8 py-3 text-lg"
              >
                Đăng ký ngay
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
