"use client"

import type React from "react"

import type { FormData } from "../Onboardingform"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface NotificationStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function NotificationStep({ formData, updateFormData, nextStep, prevStep }: NotificationStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  const notificationOptions = [
    { id: "email", label: "Email" },
    { id: "whatsapp", label: "WhatsApp" },
    { id: "discord", label: "Discord" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Notification Preferences</h2>
        <p className="text-gray-500">How would you like to receive important notifications?</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Preferred Notification Method</Label>
          <div className="grid grid-cols-3 gap-3">
            {notificationOptions.map((option) => (
              <Button
                key={option.id}
                type="button"
                variant={formData.notificationMethod === option.id ? "default" : "outline"}
                onClick={() => updateFormData({ notificationMethod: option.id })}
                className="h-16"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        {formData.notificationMethod && (
          <div className="space-y-2">
            <Label htmlFor="notificationContact">
              {formData.notificationMethod === "email"
                ? "Email Address"
                : formData.notificationMethod === "whatsapp"
                  ? "WhatsApp Number"
                  : "Discord Username"}
            </Label>
            <Input
              id="notificationContact"
              value={formData.notificationContact}
              onChange={(e) => updateFormData({ notificationContact: e.target.value })}
              placeholder={
                formData.notificationMethod === "email"
                  ? "john@example.com"
                  : formData.notificationMethod === "whatsapp"
                    ? "+1 (555) 123-4567"
                    : "username#1234"
              }
              required
            />
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Continue
        </Button>
      </div>
    </form>
  )
}
