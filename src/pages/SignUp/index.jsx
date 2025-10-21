import { useState } from 'react';
import { Box, Page } from '@components/signup';
import CustomerSignUp from './CustomerSignUp';
import EmployeeSignUp from './EmployeeSignUp';
import TypeSelection from './TypeSelection';

const TYPES = ['customer', 'employee'];

export default function SignUp() {
  const [selectedType, setSelectedType] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setCurrentStep(1);
  };

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleBackToTypeSelection = () => {
    setSelectedType(null);
    setCurrentStep(1);
  };

  // Type Selection Screen
  if (!selectedType) {
    return (
      <Box components={<TypeSelection types={TYPES} onSelectType={handleTypeSelect} />} title="Chọn loại tài khoản" />
    );
  }

  // Customer SignUp Flow
  if (selectedType === 'customer') {
    return (
      <Page
        components={
          <CustomerSignUp
            currentStep={currentStep}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onBack={handleBackToTypeSelection}
          />
        }
      />
    );
  }

  // Employee SignUp Flow
  if (selectedType === 'employee') {
    return (
      <Page
        components={
          <EmployeeSignUp
            currentStep={currentStep}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onBack={handleBackToTypeSelection}
          />
        }
      />
    );
  }
}