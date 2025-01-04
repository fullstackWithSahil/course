"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { Module, useCourseContext } from "./Context";
import ModuleCard from "./ModuleCard";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

export default function CourseBuilder({course}:{course:string}){
  const {toast} = useToast();
  const {userId} = useAuth();
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

  async function uplodeCourse(){
    try {
      const {data} = await axios.post("http://localhost:8080/api/newCourse",{
        data:state,
        teacher:userId,
        course
      });
      console.log({
        data:state,
        teacher:userId,
        course
      })
      toast(data);
    } catch (error) {
      toast({
        title:"error uploding file",
        description:"There was an error uplodng course try again later"
      })
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Course Builder</h1>
        <Button onClick={uplodeCourse} variant={"secondary"}>Upload course</Button>
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
          />
        ))}
      </div>
    </div>
  );
}