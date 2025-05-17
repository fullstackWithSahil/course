import { supabaseClient } from "@/lib/server/supabase"
import { currentUser } from "@clerk/nextjs/server";

export default async function page() {
    const user = await currentUser();
    if (!user) return;
    const supabase = supabaseClient();
    const {data,error} = await supabase.from("courses").select("*").eq("teacher",user.id);
    if(!data||data.length===0){
        return(
            <div className="flex items-center justify-center text-3xl font-bold h-[75%] bg-gray-300 m-6 rounded-2xl">
                You have not created any courses
            </div>
        )
    }
    return (
        <div>
            {data?.map((course)=><div>
                <img src={course.thumbnail||""} alt="course image" className="w-20 h-20 rounded-full"/>
            </div>)}
        </div>
    )
}
