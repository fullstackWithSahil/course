"use client"

import type { FormData } from "../Onboardingform"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

interface CompletionStepProps {
  formData: FormData
}

export default function CompletionStep({ formData }: CompletionStepProps) {
  const handleSubmitToServer = () => {
    // Here you would typically send the data to your server
    console.log("Submitting data to server:", formData)
    alert("Form submitted successfully!")
  }

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Onboarding Complete!</h2>
        <p className="text-gray-500">
          Thank you for providing your information, {formData.name}. Your course setup is almost ready.
        </p>
      </div>

      <div className="space-y-4 text-left bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold">Summary:</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <span className="font-medium">Brand:</span> {formData.brandName}
          </li>
          <li>
            <span className="font-medium">Contact:</span> {formData.email}
          </li>
          <li>
            <span className="font-medium">Notification Method:</span> {formData.notificationMethod}
          </li>
          <li>
            <span className="font-medium">Location:</span> {formData.location}
          </li>
          <li>
            <span className="font-medium">Expected Students:</span> {formData.expectedStudents}
          </li>
        </ul>
      </div>

      <div className="pt-4">
        <Button onClick={handleSubmitToServer} className="w-full">
          Submit and Create Account
        </Button>
      </div>
    </div>
  )
}
