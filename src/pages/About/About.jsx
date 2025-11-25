import React from 'react';
import { Button } from '@/components/common';
import { Heart, Users, Award, Shield } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Heart,
      title: 'Tâm huyết',
      description: 'Chúng tôi chăm sóc mỗi người như thành viên gia đình của riêng mình'
    },
    {
      icon: Users,
      title: 'Cộng đồng',
      description: 'Xây dựng mạng lưới chăm sóc đáng tin cậy và tận tâm'
    },
    {
      icon: Award,
      title: 'Chất lượng',
      description: 'Đảm bảo dịch vụ tốt nhất với các chuyên gia được đào tạo'
    },
    {
      icon: Shield,
      title: 'An toàn',
      description: 'Bảo vệ sức khỏe và quyền riêng tư của từng gia đình'
    }
  ];

  const stats = [
    { number: '5000+', label: 'Gia đình được phục vụ' },
    { number: '2000+', label: 'Nhân viên chăm sóc' },
    { number: '98%', label: 'Mức độ hài lòng' },
    { number: '24/7', label: 'Hỗ trợ khách hàng' }
  ];

  const features = [
    {
      title: 'Kết nối Dễ dàng',
      description: 'Tìm kiếm và kết nối với nhân viên chăm sóc phù hợp chỉ trong vài phút'
    },
    {
      title: 'Dịch vụ Linh hoạt',
      description: 'Từ chăm sóc tại nhà đến giám sát sức khỏe, chúng tôi có mọi thứ bạn cần'
    },
    {
      title: 'Giá Cạnh Tranh',
      description: 'Dịch vụ chất lượng cao với giá hợp lý cho tất cả mọi người'
    },
    {
      title: 'Đánh Giá Minh Bạch',
      description: 'Hệ thống đánh giá công khai giúp bạn chọn nhân viên tốt nhất'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-50 to-teal-100 py-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Về <span className="text-teal-600">LifeEase</span>
          </h1>
          <p className="text-xl text-gray-700 mb-8 leading-relaxed">
            Chúng tôi tin rằng mỗi người đều xứng đáng được chăm sóc chuyên nghiệp, tận tâm và với giá cả hợp lý. 
            LifeEase kết nối các gia đình với đội ngũ nhân viên chăm sóc tuyệt vời để mang lại an tâm và sự an bình cho bạn.
          </p>
          <Button className="max-w-xs mx-auto">
            Khám Phá Dịch Vụ
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold text-teal-600 mb-2">{stat.number}</p>
                <p className="text-gray-700 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Sứ Mệnh</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Sứ mệnh của LifeEase là cung cấp dịch vụ chăm sóc chất lượng cao, giá cả phải chăng và dễ tiếp cận. 
                Chúng tôi muốn mỗi gia đình đều có cơ hội được hỗ trợ bởi những người chuyên nghiệp, tận tâm và đáng tin cậy.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Thông qua nền tảng của chúng tôi, chúng tôi giúp hàng ngàn gia đình cải thiện chất lượng cuộc sống 
                và tìm được sự cân bằng giữa công việc và gia đình.
              </p>
            </div>
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tầm Nhìn</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Chúng tôi mong muốn trở thành nền tảng chăm sóc được tin tưởng nhất tại Việt Nam, 
                nơi mà các gia đình có thể yên tâm tìm kiếm dịch vụ chăm sóc chất lượng.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Chúng tôi cam kết không ngừng phát triển và cải tiến để đáp ứng nhu cầu ngày càng cao của thị trường 
                và những kỳ vọng của khách hàng.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Giá Trị Cốt Lõi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <div 
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="mb-4">
                    <IconComponent className="w-10 h-10 text-teal-600" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Tại Sao Chọn LifeEase?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="border-l-4 border-teal-600 pl-6 py-2">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-teal-600 to-teal-700 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold  mb-6">
            Sẵn Sàng Bắt Đầu?
          </h2>
          <p className="text-xl text-teal-50 mb-8 leading-relaxed">
            Tham gia hàng ngàn gia đình đang tin tưởng LifeEase để chăm sóc những người yêu thương của họ.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="secondary"
              className="bg-white text-teal-600 hover:bg-gray-100"
            >
              Tìm Nhân Viên Chăm Sóc
            </Button>
            <Button 
              variant="outline"
              className="border-white  hover:bg-white hover:text-teal-600"
            >
              Liên Hệ Với Chúng Tôi
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;