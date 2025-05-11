"use client"

import type React from "react"

import type { FormData } from "../Onboardingform"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin } from "lucide-react"
import { toast } from "sonner"
import supabaseClient from "@/lib/supabase"
import { useSession, useUser } from "@clerk/nextjs"

interface LocationStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function LocationStep({ formData, updateFormData, nextStep, prevStep }: LocationStepProps) {
  const {session} = useSession();
  const {user} = useUser();
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    const supabase = supabaseClient(session);
    const {error} = await supabase
      .from("teachers")
      .update({...formData,logo:""})
      .eq("teacher",user?.id||"");
    if(error){
      console.log(error);
      toast("There was an error adding your data. Please try again later...")
    }
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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold">Location & Students</h2>
        <p className="text-sm text-gray-500">Where are your students primarily located?</p>
      </div>

      <div className="space-y-3 sm:space-y-6">
        <div className="space-y-1 sm:space-y-3">
          <Label>Student Location</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
            {locations.map((location) => (
              <Button
                key={location.id}
                type="button"
                variant={formData.location === location.id ? "default" : "outline"}
                onClick={() => updateFormData({ location: location.id })}
                className="h-12 sm:h-16 text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
              >
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                {location.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1 sm:space-y-2">
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

      <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
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
