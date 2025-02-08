import logo from "@/assets/sample.png";
import NotAllowedToSee from "@/components/generic/NotAllowedToSee";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/server/supabase";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

export default async function page() {
    const supabase = await createClient();
    const user = await currentUser();
    if(!user){
        return <NotAllowedToSee/>
    }
    const {data} = await supabase.from("courses").select("*").eq("teacher",user.id);
  return (
    <div>
        <h1 className="text-3xl font-bold text-center col-span-3">
            Select the course you want to see feedback for
        </h1>
        <div className="grid grid-cols-3 grid-rows-6">
            {!data ?<div className="h-[40vh] flex items-center justify-center bg-gray-300 m-3 rounded-lg"> 
                <p className="text-lg">You have not created any courses</p> 
                </div>: data.map((course) => (
                <div key={course.id} className="mx-3">
                    <div className="border-2 rounded-xl p-4">
                        <Image src={logo} alt="logo" />
                        <h2 className="text-xl font-semibold">{course.name}</h2>
                        <p>{course.description}</p>
                        <Link href={`/feedback/${course.id}`} className={buttonVariants()}>
                            See Feedback
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}