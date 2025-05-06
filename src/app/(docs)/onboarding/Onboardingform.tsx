"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import PersonalInfoStep from "./steps/personal-info-step";
import BankDetailsStep from "./steps/bank-details-step";
import ProgressIndicator from "./Progress-indecator";
import NotificationStep from "./steps/notification-step";
import CompletionStep from "./steps/completion-step";
import LocationStep from "./steps/location-step";
import CourseInfoStep from "./steps/course-info-step";

export type FormData = {
  // Personal Info
  name: string;
  email: string;
  mobile: string;
  
  // Notification Preferences
  notificationMethod: string;
  notificationContact: string;
  
  // Bank Details
  accountName: string;
  accountNumber: string;
  routingNumber: string;
  
  // Course Info
  brandName: string;
  logo: string | null;
  curriculum: string;
  
  // Location Info
  location: string;
  expectedStudents: string;
  completed:boolean;
  teacher:string;
};

export default function OnboardingForm({initialFormData}:{initialFormData:FormData}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const steps = [
    "Personal Information",
    "Notification Preferences",
    "Bank Details",
    "Course Information",
    "Location & Students",
    "Complete"
  ];

  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <PersonalInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} />;
      case 1:
        return <NotificationStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 2:
        return <BankDetailsStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <CourseInfoStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 4:
        return <LocationStep formData={formData} updateFormData={updateFormData} nextStep={nextStep} prevStep={prevStep} />;
      case 5:
        return <CompletionStep formData={formData} />;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-3xl shadow-lg">
      <CardContent className="p-6">
        <ProgressIndicator steps={steps} currentStep={currentStep} />
        <div className="mt-8">
          {renderStep()}
        </div>
      </CardContent>
    </Card>
  );
}
