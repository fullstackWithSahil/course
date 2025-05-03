import { currentUser } from "@clerk/nextjs/server";
import OnboardingForm from "./Onboardingform";
import { RedirectToSignUp } from "@clerk/nextjs";

export default async function Home() {
  const user = await currentUser();
  if(!user){
    return <RedirectToSignUp/> 
  }
  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <OnboardingForm />
    </main>
  );
}
