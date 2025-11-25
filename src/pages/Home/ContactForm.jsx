import { Button, Input } from '@/components/common';
import { MessageCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

const ContactForm = ({ contactForm, handleContactChange, handleContactSubmit }) => {
  const ref = useScrollAnimation('animate__fadeInUp');

  return (
    <div ref={ref} className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
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
            className="bg-green-600 hover:bg-green-700  px-8 py-3 flex items-center gap-2 transition-all duration-300 hover:animate__animated hover:animate__pulse"
          >
            <MessageCircle size={20} />
            Gửi tin nhắn
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
