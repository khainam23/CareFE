import React, { useState } from 'react';
import RoleSelection from '@components/signup/RoleSelection';
import ProfessionalInfo from '@components/signup/ProfessionalInfo';
import Expertise from '@components/signup/Expertise';
import Education from '@components/signup/Education';
import FinalStep from '@components/signup/FinalStep';
import CareNowLogo from '@assets/icons/CareNowLogo.svg';

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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4">
      <div className="w-full max-w-3xl space-y-8">
        <div className="flex justify-center">
          <img src={CareNowLogo} alt="CareNow" className="h-7" />
        </div>
        <div className="bg-white p-8 rounded-xl shadow-sm">
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default SignUp;
