import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseClient } from "@/lib/server/supabase"
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

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
            {data?.map((course)=><Card
                key={course.id} 
                className="m-5"
            >
                <CardHeader>
                    <CardTitle>{course.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center">
                    <img src={course.thumbnail||""} alt="course image" className="w-1/2"/>
                    <div className="flex flex-col items-center w-1/2">
                        <p className="text-justify text-sm mx-2">
                            {course.description}
                        </p>
                        <div className="flex items-center justify-around gap-4">
                            <p className="text-lg font-bold text-gray-400">Videos:20</p>
                            <p className="text-lg font-bold text-gray-400">Students:50</p>
                            <p className="text-lg font-bold text-gray-400">Comments:100</p>
                        </div>
                        <Link className={buttonVariants()} href={`/feedback/${course.id}`}>
                            See feedback
                        </Link>
                    </div>
                </CardContent>
            </Card>)}
        </div>
    )
}
