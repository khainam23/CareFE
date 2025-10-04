import React from 'react';
import { features } from '@constants/home';

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#E0EFEA] p-8 rounded-2xl border border-gray-200 flex flex-col justify-between min-h-[220px]"
            >
              <h3 className="text-xl font-medium text-gray-800">
                {feature.title}
              </h3>
              <div>
                <div className="w-10 h-px bg-gray-400 my-4"></div>
                <p className="text-sm text-gray-600">{feature.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
