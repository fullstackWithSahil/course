"use client"

import type React from "react"

import type { FormData } from "../Onboardingform"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useSession, useUser } from "@clerk/nextjs"
import supabaseClient from "@/lib/supabase"
import { toast } from "sonner"

interface PersonalInfoStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
}

export default function PersonalInfoStep({ formData, updateFormData, nextStep }: PersonalInfoStepProps) {
  const {session} = useSession();
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    const supabase = supabaseClient(session);
    const {error} = await supabase.from("teachers").upsert({...formData,logo:""});
    if(error){
      console.log(error);
      toast("There was an error adding your data. Please try again later...")
    }
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold">Personal Information</h2>
        <p className="text-sm text-gray-500">Please provide your basic contact information.</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateFormData({ name: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
            placeholder="john@example.com"
            required
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="mobile">Mobile Number</Label>
          <Input
            id="mobile"
            type="tel"
            value={formData.mobile}
            onChange={(e) => updateFormData({ mobile: e.target.value })}
            placeholder="+1 (555) 123-4567"
            required
          />
        </div>
      </div>

      <div className="pt-2 sm:pt-4">
        <Button type="submit" className="w-full">
          Continue
        </Button>
      </div>
    </form>
  )
}
