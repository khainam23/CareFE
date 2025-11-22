import React, { useState } from 'react';
import { Button, Input } from '@/components/common';
import image41 from '@/assets/images/image 41.svg';
import image54 from '@/assets/images/image 54.svg';
import rectangle200 from '@/assets/images/Rectangle 200.svg';
import rectangle201 from '@/assets/images/Rectangle 201.svg';
import rectangle202 from '@/assets/images/Rectangle 202.svg';
import DatePickerInput from '@/components/DatePickerInput';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';

const Home = () => {
  const [searchForm, setSearchForm] = useState({
    location: '',
    time: '',
    name: '',
  });

  const [contactForm, setContactForm] = useState({
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    contactMessage: '',
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

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log('Contact form:', contactForm);
    // Handle contact form submission
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');
    setContactForm({
      contactName: '',
      contactPhone: '',
      contactEmail: '',
      contactMessage: '',
    });
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="relative h-96 bg-cover bg-center rounded-lg overflow-hidden mt-8">
          <img 
            src={image41} 
            alt="Hero Banner" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute top-12 right-12 text-white max-w-md">
            <p className="text-2xl font-bold leading-tight">
              Chăm sóc tận tâm - bình an mỗi ngày
            </p>
            <p className="text-sm mt-3 leading-relaxed">
              Kết nối gia đình với đội ngũ chăm sóc tận tâm, minh bạch và đánh tin cậy
            </p>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-12 px-6 bg-green-100 rounded-lg mt-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Tìm nhà chăm sóc phù hợp</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
              className="h-10"
            >
              Tìm kiếm
            </Button>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 mt-8">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            An tâm với lựa chọn của bạn
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div 
                key={index}
                className="relative group overflow-hidden rounded-lg h-80"
              >
                <img 
                  src={image54} 
                  alt={service.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
                <div className={`absolute inset-x-0 px-4 pb-6 text-white flex flex-col ${index % 2 === 0 ? 'justify-end' : 'justify-start'} h-full`}>
                  <h6 className="text-lg font-bold mb-2">{service.title}</h6>
                  <p className="text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 mt-12">
          <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">
            Quy trình sử dụng dịch vụ
          </h2>
          <div className="space-y-8">
            {processSteps.map((step, index) => (
              <div 
                key={step.number}
                className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-gray-200 last:border-b-0"
              >
                {index % 2 === 0 ? (
                  <>
                    <div className="flex-shrink-0 md:w-1/3">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                    <div className="md:w-2/3">
                      <h6 className="text-lg font-bold text-teal-600 mb-2">
                        {step.number}. {step.title}
                      </h6>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="md:w-2/3">
                      <h6 className="text-lg font-bold text-teal-600 mb-2">
                        {step.number}. {step.title}
                      </h6>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 md:w-1/3">
                      <img 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 mt-12 mb-8">
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
              {/* Phone */}
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                  <Phone className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                  Hotline
                </h3>
                <p className="text-gray-600 text-center mb-3">
                  24/7 hỗ trợ khách hàng
                </p>
                <a 
                  href="tel:1900123456" 
                  className="block text-center text-green-600 font-semibold hover:text-green-700"
                >
                  1900 123 456
                </a>
              </div>

              {/* Email */}
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                  <Mail className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                  Email
                </h3>
                <p className="text-gray-600 text-center mb-3">
                  Gửi email cho chúng tôi
                </p>
                <a 
                  href="mailto:support@careservice.com" 
                  className="block text-center text-green-600 font-semibold hover:text-green-700 break-all"
                >
                  support@careservice.com
                </a>
              </div>

              {/* Address */}
              <div className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4 mx-auto">
                  <MapPin className="text-green-600" size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
                  Địa chỉ
                </h3>
                <p className="text-gray-600 text-center mb-3">
                  Văn phòng chính
                </p>
                <p className="text-center text-gray-700 font-medium">
                  123 Nguyễn Huệ, Quận 1<br />
                  TP. Hồ Chí Minh
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">
                Gửi tin nhắn cho chúng tôi
              </h3>
              <form className="space-y-4" onSubmit={handleContactSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Họ và tên"
                    name="contactName"
                    value={contactForm.contactName}
                    onChange={handleContactChange}
                    placeholder="Nhập họ và tên của bạn"
                  />
                  <Input
                    label="Số điện thoại"
                    name="contactPhone"
                    value={contactForm.contactPhone}
                    onChange={handleContactChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <Input
                  label="Email"
                  name="contactEmail"
                  type="email"
                  value={contactForm.contactEmail}
                  onChange={handleContactChange}
                  placeholder="Nhập email của bạn"
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tin nhắn
                  </label>
                  <textarea
                    name="contactMessage"
                    value={contactForm.contactMessage}
                    onChange={handleContactChange}
                    rows="4"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Nhập tin nhắn của bạn..."
                  />
                </div>
                <div className="flex justify-center">
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 flex items-center gap-2"
                  >
                    <MessageCircle size={20} />
                    Gửi tin nhắn
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
