import React from 'react';
import { howItWorks } from '@constants/home';
import professionalTeam from '@assets/images/professional-team.png';
import flexibleService from '@assets/images/flexible-service.png';
import greatExperience from '@assets/images/great-experience.png';

const images = {
  'professional-team.png': professionalTeam,
  'flexible-service.png': flexibleService,
  'great-experience.png': greatExperience,
};

const HowItWorksSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {howItWorks.map((step, index) => (
            <div key={index} className="text-center">
              <div className="mb-6 flex justify-center">
                <img 
                  src={images[step.image]} 
                  alt={step.title} 
                  className="w-48 h-48 object-cover rounded-full border-4 border-white shadow-lg"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
