"use client"
import type { FormData } from "../Onboardingform"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { UploadCloud } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import supabaseClient from "@/lib/supabase"
import { useSession, useUser } from "@clerk/nextjs"

interface CourseInfoStepProps {
  formData: FormData
  updateFormData: (data: Partial<FormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export default function CourseInfoStep({ formData, updateFormData, nextStep, prevStep }: CourseInfoStepProps) {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [file,setFile]= useState<File|null>(null);

  const {session} = useSession();
  const {user} = useUser();
  
  const handleSubmit = async(e: React.FormEvent) => {
    e.preventDefault()
    const supabase = supabaseClient(session);
    const fileExtension = file?.type.split("/")[1];
    const {error} = await supabase.from("teachers").upsert({
      ...formData,
      logo:`${user?.id}/logo.${fileExtension}`
    });
    let error2 = null;
    if (file) {
      const uploadResult = await supabase.storage
        .from("onboarding")
        .upload(`${user?.id}/logo.${fileExtension}`, file);
      error2 = uploadResult.error;
    }
    if(error||error2){
      console.log({error,error2});
      toast("There was an error adding your data. Please try again later...")
    }
    nextStep()
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFile(file);
      const fileExtension = file.type.split("/")[1];
      updateFormData({ logo: `${user?.id}/logo.${fileExtension}` });

      // Create preview URL
      const reader = new FileReader()
      reader.onload = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="space-y-1 sm:space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold">Course Information</h2>
        <p className="text-sm text-gray-500">Tell us about the course you want to create.</p>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="brandName">Brand Name</Label>
          <Input
            id="brandName"
            value={formData.brandName}
            onChange={(e) => updateFormData({ brandName: e.target.value })}
            placeholder="Your Course Brand"
            required
          />
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="logo">Brand Logo</Label>
          <div className="border-2 border-dashed rounded-lg p-3 sm:p-6 flex flex-col items-center justify-center">
            {logoPreview ? (
              <div className="flex flex-col items-center gap-2 sm:gap-4">
                <img
                  src={logoPreview || "/placeholder.svg"}
                  alt="Logo preview"
                  className="w-20 h-20 sm:w-32 sm:h-32 object-contain"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setLogoPreview(null)
                    updateFormData({ logo: null })
                  }}
                  size="sm"
                  className="sm:text-base"
                >
                  Remove Logo
                </Button>
              </div>
            ) : (
              <>
                <UploadCloud className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400 mb-1 sm:mb-2" />
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Drag and drop or click to upload</p>
                <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("logo")?.click()}
                  size="sm"
                  className="sm:text-base"
                >
                  Select Logo
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <Label htmlFor="curriculum">Course Curriculum</Label>
          <Textarea
            id="curriculum"
            value={formData.curriculum}
            onChange={(e) => updateFormData({ curriculum: e.target.value })}
            placeholder="Describe your course curriculum, modules, and learning objectives..."
            className="min-h-[100px] sm:min-h-[150px]"
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
