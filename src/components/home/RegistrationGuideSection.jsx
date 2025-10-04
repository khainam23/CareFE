import React from 'react';
import { registrationSteps } from '@constants/home';

const RegistrationGuideSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
            Cách thức đăng ký trở thành chuyên viên chăm sóc trên CareNow
          </h2>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-9 top-0 bottom-0 w-0.5 bg-teal-200" style={{ transform: 'translateX(-50%)' }}></div>

            {registrationSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-8 mb-12">
                <div className="relative z-10 flex-shrink-0">
                  <div className="text-8xl font-serif font-bold text-gray-200">
                    {step.number}
                  </div>
                </div>
                <div className="pt-4 flex-1">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{step.description}</p>
                  <ul className="space-y-2">
                    {step.items.map((item, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-teal-500 mr-3 mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RegistrationGuideSection;
