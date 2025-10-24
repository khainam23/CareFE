import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Page } from '@components/signup';
import CustomerSignUp from './CustomerSignUp';
import EmployeeSignUp from './EmployeeSignUp';
import ProfessionalSkillsSignUp from './ProfessionalSkillsSignUp';
import TypeSelection from './TypeSelection';

const TYPES = ['customer', 'employee'];

export default function SignUp() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [signupPhase, setSignupPhase] = useState('typeSelection'); // 'typeSelection', 'employee', 'professional', 'complete'

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setCurrentStep(1);
    if (type === 'employee') {
      setSignupPhase('employee');
    } else if (type === 'customer') {
      setSignupPhase('customer');
    }
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
    setSignupPhase('typeSelection');
  };

  const handleEmployeeSignUpComplete = () => {
    // After EmployeeSignUp is complete, move to ProfessionalSkillsSignUp
    setSignupPhase('professional');
    setCurrentStep(1);
  };

  const handleProfessionalSkillsComplete = () => {
    // After all signup steps are complete, redirect to home
    setSignupPhase('complete');
    navigate('/');
  };

  // Type Selection Screen
  if (signupPhase === 'typeSelection') {
    return (
      <Box components={<TypeSelection types={TYPES} onSelectType={handleTypeSelect} />} title="Tham gia với tư cách khách hàng hoặc chuyên viên chăm sóc" />
    );
  }

  // Customer SignUp Flow
  if (signupPhase === 'customer') {
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
  if (signupPhase === 'employee') {
    return (
      <Page
        components={
          <EmployeeSignUp
            onComplete={handleEmployeeSignUpComplete}
            onBack={handleBackToTypeSelection}
          />
        }
      />
    );
  }

  // Professional Skills SignUp Flow
  if (signupPhase === 'professional') {
    return (
      <Page
        components={
          <ProfessionalSkillsSignUp
            onComplete={handleProfessionalSkillsComplete}
            onBack={handleBackToTypeSelection}
          />
        }
      />
    );
  }
}