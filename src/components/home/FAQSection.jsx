import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqs } from '@constants/home';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0); // Open the first item by default

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="bg-white p-8 rounded-2xl shadow-sm">
          <div className="space-y-1">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 last:border-b-0">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between text-left py-5"
                >
                  <span className="text-lg font-medium text-gray-800">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-6 h-6 text-gray-500 transition-transform transform ${openIndex === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    openIndex === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-600 pb-5 pr-8">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
