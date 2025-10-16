import React, { useState } from 'react';
import RoleSelection from '@components/signup/RoleSelection';
import ProfessionalInfo from '@components/signup/ProfessionalInfo';
import Expertise from '@components/signup/Expertise';
import Education from '@components/signup/Education';
import FinalStep from '@components/signup/FinalStep';
import Logo from '@assets/images/Logo.svg';
import BgImage from '@assets/images/image 16.svg';

const STEPS = {
  ROLE_SELECTION: 1,
  PROFESSIONAL_INFO: 2,
  EXPERTISE: 3,
  EDUCATION: 4,
  FINAL_STEP: 5,
};

const SignUp = () => {
  const [currentStep, setCurrentStep] = useState(STEPS.ROLE_SELECTION);
  const [formData, setFormData] = useState({
    role: '',
    fullName: '',
    phone: '',
    gender: '',
    birthDate: '',
    city: '',
    district: '',
    address: '',
    expertise: [],
    education: '',
  });

  const nextStep = () => setCurrentStep((prev) => (prev < 5 ? prev + 1 : prev));
  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  const updateFormData = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case STEPS.ROLE_SELECTION:
        return <RoleSelection nextStep={nextStep} updateFormData={updateFormData} />;
      case STEPS.PROFESSIONAL_INFO:
        return <ProfessionalInfo nextStep={nextStep} prevStep={prevStep} updateFormData={updateFormData} formData={formData} />;
      case STEPS.EXPERTISE:
        return <Expertise nextStep={nextStep} prevStep={prevStep} updateFormData={updateFormData} formData={formData} />;
      case STEPS.EDUCATION:
        return <Education nextStep={nextStep} prevStep={prevStep} updateFormData={updateFormData} formData={formData} />;
      case STEPS.FINAL_STEP:
        return <FinalStep prevStep={prevStep} formData={formData} />;
      default:
        return <RoleSelection nextStep={nextStep} updateFormData={updateFormData} />;
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-12 px-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${BgImage})` }}
    >
      <div className="w-full max-w-5xl space-y-8">
        <div className="flex justify-center">
          <img src={Logo} alt="LifeEase" className="h-24" />
        </div>
        <div className="p-2 md:p-4">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
