import { createClient } from "@/lib/server/supabase"
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import CourseCard from "./OldComponents";

export default async function OldCourses() {
    const supabase = await createClient();
    const { data, error } = await supabase.from('courses').select('*');

    return (
        <div className="container mx-auto p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight">Your Courses</h1>
                <Button variant="default">
                    Create New Course
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data?.map(course => (
                    <CourseCard 
                        key={course.id}
                        course={course}
                        formatPrice={course.price}
                    />
                ))}
            </div>

            {data?.length === 0 && (
                <Card className="w-full">
                    <CardContent className="flex flex-col items-center justify-center h-40">
                        <p className="text-muted-foreground text-center">
                            No courses found. Create your first course to get started!
                        </p>
                        <Button className="mt-4" variant="outline">
                            Create Course
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}