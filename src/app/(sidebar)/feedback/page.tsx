import { supabaseClient } from "@/lib/server/supabase"
import { currentUser } from "@clerk/nextjs/server";
import Feedbackcard from "./Feedbackcard";

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
            {data?.map((course)=><Feedbackcard 
                key={course.id}
                id={course.id} 
                description={course.description||""}
                thumbnail={course.thumbnail||""}
                name={course.name||""} 
            />)}
        </div>
    )
}
