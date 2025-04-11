"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { Module, useCourseContext } from "./Context";
import ModuleCard from "./ModuleCard";
import { useAuth } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CourseBuilder({course}:{course:string}){
  const {userId,getToken} = useAuth();
  const router = useRouter();
  const [moduleName, setModuleName] = useState("");
  const {state,dispatch} = useCourseContext();
  const handleAddModule = () => {
    if (moduleName) {
      dispatch({
        type: "ADD_MODULE",
        payload: { id: Date.now().toString(), name: moduleName },
      });
      setModuleName("");
    }
  };

  async function uploadCourse() {
    try {
      // Get token and initialize Supabase client
      const token = await getToken({ template: "supabase" });
      if (!token) throw new Error("Failed to retrieve token");
      const supabase = supabaseClient(token);
  
      // Get course ID
      const courses = await supabase.from("courses").select("*").eq("name",course);
      if(!courses.data) return null;
      const courseId = courses.data[0].id;
  
      // Insert videos
      console.log({state});
      const videoUploadResults = await Promise.allSettled(
        state.flatMap((mod) =>
          mod.videos.map((v, i) =>
            supabase.from("videos").insert({
              module: mod.name,
              teacher: userId,
              title: v.title,
              description: v.description,
              course: courseId,
              lesson: i + 1,
              url: v.url,
              thumbnail: v.thumbnail
            })
          )
        )
      );

      // Log any failed uploads
      videoUploadResults.forEach((result, index) => {
        if (result.status === "rejected") {
          console.error(`Error inserting video ${index}:`, result.reason);
        }
      });

      // Success toast
      toast("Your course was uploaded successfully");
      router.push("/home");
    } catch (error:any) {
      console.error("Error uploading course:", error.message || error);
      toast("There was an error uploading the course. Please try again later.");
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Course Builder</h1>
        <Button onClick={uploadCourse} variant={"secondary"}>Upload course</Button>
      </div>

      {/* Add Module Section */}
      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Enter module name"
          value={moduleName}
          onChange={(e) => setModuleName(e.target.value)}
        />
        <Button onClick={handleAddModule}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Module
        </Button>
      </div>

      {/* List Modules */}
      <div className="space-y-4">
        {state.map((module: Module) => (
          <ModuleCard
            key={module.id}
            module={module}
            dispatch={dispatch}
            course={course}
          />
        ))}
      </div>
    </div>
  );
}