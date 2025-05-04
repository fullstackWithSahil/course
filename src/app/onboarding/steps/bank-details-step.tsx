"use client"

import type React from "react"

import type { FormData } from "../Onboardingform"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import supabaseClient from "@/lib/supabase"
import { useSession, useUser } from "@clerk/nextjs"

interface BankDetailsStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function BankDetailsStep({ formData, updateFormData, nextStep, prevStep }: BankDetailsStepProps) {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold">Bank Details</h2>
        <p className="text-sm text-gray-500">
          Please provide your banking information for Stripe Connect integration. This information is securely processed
          by Stripe.
        </p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="accountName">Account Holder Name</Label>
          <Input
            id="accountName"
            value={formData.accountName}
            onChange={(e) => updateFormData({ accountName: e.target.value })}
            placeholder="John Doe"
            required
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            value={formData.accountNumber}
            onChange={(e) => updateFormData({ accountNumber: e.target.value })}
            placeholder="XXXXXXXXXXXX"
            required
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="routingNumber">Routing Number</Label>
          <Input
            id="routingNumber"
            value={formData.routingNumber}
            onChange={(e) => updateFormData({ routingNumber: e.target.value })}
            placeholder="XXXXXXXXX"
            required
          />
        </div>
      </div>

      <div className="flex gap-2 sm:gap-3 pt-2 sm:pt-4">
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
