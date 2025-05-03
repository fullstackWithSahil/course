"use client"

import type React from "react"

import type { FormData } from "../Onboardingform"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"

interface LocationStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function LocationStep({ formData, updateFormData, nextStep, prevStep }: LocationStepProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    nextStep()
  }

  const locations = [
    { id: "paris", label: "Paris" },
    { id: "frankfurt", label: "Frankfurt" },
    { id: "sao-paulo", label: "São Paulo" },
    { id: "usa", label: "USA" },
    { id: "hong-kong", label: "Hong Kong" },
    { id: "singapore", label: "Singapore" },
    { id: "tokyo", label: "Tokyo" },
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Location & Students</h2>
        <p className="text-gray-500">Where are your students primarily located?</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <Label>Student Location</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {locations.map((location) => (
              <Button
                key={location.id}
                type="button"
                variant={formData.location === location.id ? "default" : "outline"}
                onClick={() => updateFormData({ location: location.id })}
                className="h-16 flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                {location.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expectedStudents">Expected Students (Next Month)</Label>
          <Input
            id="expectedStudents"
            type="number"
            min="1"
            value={formData.expectedStudents}
            onChange={(e) => updateFormData({ expectedStudents: e.target.value })}
            placeholder="e.g., 50"
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Complete
        </Button>
      </div>
    </form>
  )
}
