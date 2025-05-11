import { supabaseClient } from "@/lib/server/supabase"
import { currentUser } from "@clerk/nextjs/server";

export default async function page() {
    const user = await currentUser();
    if (!user) return;
    const supabase = supabaseClient();
    const {data,error} = await supabase.from("courses").select("*").eq("teacher",user.id); 
    return (
        <div>
            {data?.map((course)=><div>
                <img src={course.thumbnail||""} alt="course image" className="w-20 h-20 rounded-full"/>
            </div>)}
        </div>
    )
}
