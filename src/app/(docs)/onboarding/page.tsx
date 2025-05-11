import { currentUser } from "@clerk/nextjs/server";
import OnboardingForm, { FormData } from "./Onboardingform";
import { RedirectToSignUp } from "@clerk/nextjs";
import { supabaseClient } from "@/lib/server/supabase";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await currentUser();
  if(!user){
    return <RedirectToSignUp/> 
  }
  
  const initialFormData: FormData = {
    name: "",
    email: "",
    mobile: "",
    notificationMethod: "",
    notificationContact: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
    brandName: "",
    logo: "",
    curriculum: "",
    location: "",
    expectedStudents: "",
    completed:false,
    teacher:user.id,
  };

  const supabase = supabaseClient();
  const {data} = await supabase
    .from("teachers")
    .select("*")
    .eq("teacher",user.id)
    .single();

  if(data&&data.completed){
    redirect("/home");
  }
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <OnboardingForm initialFormData={(data?data:initialFormData) as FormData} />
    </main>
  );
}
