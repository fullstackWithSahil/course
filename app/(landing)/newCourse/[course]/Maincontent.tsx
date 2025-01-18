"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { Module, useCourseContext } from "./Context";
import ModuleCard from "./ModuleCard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabase";

export default function CourseBuilder({course}:{course:string}){
  const {toast} = useToast();
  const {userId,getToken} = useAuth();
  const [moduleName, setModuleName] = useState("");
  const {state,dispatch} = useCourseContext();
  const handleAddModule = () => {
    if (moduleName.trim()) {
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
      const { data: courseId } = await supabase
        .from("courses")
        .select("id")
        .eq("name", course);
  
      if (!courseId || courseId.length === 0) {
        toast({
          title: "Course not found",
          description: "The specified course does not exist",
        });
        return;
      }
  
      // Insert videos
      await Promise.all(
        state.map((mod) =>
          Promise.all(
            mod.videos.map((v,i) =>
              supabase.from("videos").insert({
                module: mod.name,
                teacher: userId,
                title: v.title,
                description: v.description,
                course: courseId[0].id,
                lesson:i+1,
                url: v.url+".mp4"
              })
            )
          )
        )
      );
  
      // Success toast
      toast({
        title: "Course uploaded successfully",
        description: "Your course was uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading course:", error);
      toast({
        title: "Error uploading course",
        description: "There was an error uploading the course. Please try again later.",
      });
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