import CourseCard from "@/components/generic/CourseCard";
import NotAllowedToSee from "@/components/generic/NotAllowedToSee";
import { createClient } from "@/lib/server/supabase"
import { currentUser } from "@clerk/nextjs/server";


export default async function page() {
  const user = await currentUser();
  if(!user){
    return <NotAllowedToSee/>
  }
  const supabase = await createClient();
  const {data} = await supabase.from("courses").select("*").eq("teacher",user.id||"");
  return (
    <main>
      {data?.map(async(course)=>{
        const {data} = await supabase
          .from("students")
          .select("id")
          .eq("course",course.id);
        const students = data?.length||0;
        return(
          <CourseCard
            key={course.id}
            id={course.id}
            thumbnail={course.thumbnail||""} 
            name={course.name||""}
            description={course.description||""}
            students={students}
            created_at={course.created_at}
          />
          )
      })}
    </main>
  )
}
