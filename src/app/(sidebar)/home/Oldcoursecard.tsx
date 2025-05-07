"use client"
import { Pencil, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSession } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type propTypes ={
    description: string ;
    id: number;
    name: string ;
    price: number ;
    thumbnail: string;
}

export default function CourseCard(course:propTypes){
    const {session} = useSession();
    const router = useRouter();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [students,setStudents] = useState(0);
    const [videos,setVideos] = useState(0);

    useEffect(()=>{
        async function getData(){
            try {
                const supabase = supabaseClient(session);
                const {data:Nvideos} = await supabase.from("videos").select("*").eq("course",course.id);
                setVideos(Nvideos?.length||0);
                const {data:Nstudents} = await supabase.from("students").select("*").eq("course",course.id);
                setStudents(Nstudents?.length||0);
            } catch (error) {
                console.log(error)
                toast("Error getting courses data")
            }
        }
        getData();
    },[]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };
    
    const handleDelete = async () => {
        try {
            const supabase = supabaseClient(session);

            const { error: videosError } = await supabase
                .from('videos')
                .delete()
                .eq('course', course.id)
                .select();
            
            if (videosError) {
                console.error("Error deleting videos:", videosError);
                toast("There was an error deleting the course videos. Please try again later.");
                return;
            }
            
            // Then delete the course itself
            const { error: courseError } = await supabase
                .from('courses')
                .delete()
                .eq('id', course.id);
                
            if (courseError) {
                console.error("Error deleting course:", courseError);
                toast("There was an error deleting the course. Please try again later.");
                return;
            }
            
            console.log('Successfully deleted course:', course.id);
            toast("Course deleted successfully");
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error("Unexpected error in handleDelete:", error);
            toast("An unexpected error occurred");
        }
    };

    function handleEdit(){
        router.push(`/edit/${course.id}`);
    }

    return (
        <>
            <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
                <div className="relative aspect-video">
                    <img
                        src={course.thumbnail}
                        alt={course.name}
                        className="object-cover w-full"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
                <CardContent className="flex flex-col flex-1 p-4">
                    <div className="flex justify-between items-start">
                        <div className="space-y-1.5">
                            <h3 className="font-semibold text-lg leading-none">
                                {course.name}
                            </h3>
                            <p className="text-sm break-words whitespace-normal min-h-[20%] truncate">
                                {course.description} 
                            </p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="-m-2">
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">Open menu</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleEdit}>
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => setDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    <div className="mt-4">
                        <p className="font-semibold text-lg text-primary">
                            {formatPrice(course.price)}
                        </p>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <Badge variant="secondary">
                            {students || 0} Students
                        </Badge>
                        <Badge variant="secondary">
                            {videos || 0} Lessons
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            course and remove all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};