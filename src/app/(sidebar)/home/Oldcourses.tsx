import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { supabaseClient } from "@/lib/server/supabase";
import { currentUser } from "@clerk/nextjs/server";
import CourseCard from "./Oldcoursecard";

export default async function Oldcourses() {
	const user = await currentUser();
	const supabase = supabaseClient();
	
	const { data } = await supabase
		.from("courses")
		.select("*")
		.eq("teacher", user?.id || "");

	if (!data||data.length == 0) {
		return (
			<Card className="w-full my-4">
				<CardContent className="flex flex-col items-center justify-center h-40">
					<p className="text-muted-foreground text-center">
						No courses found. Create your first course to get
						started!
					</p>
				</CardContent>
			</Card>
		);
	}
	return (
		<div className="m-3 grid gap-5 grid-cols-1 md:grid-cols-2">
			{data?.map(course => (
                <CourseCard 
                    key={course.id}
                    id={course.id}
                    description={course.description||""}
                    thumbnail={course.thumbnail||""}
                    name={course.name||""}
                    price={course.price||0}
                />
            ))}
		</div>
	);
}
