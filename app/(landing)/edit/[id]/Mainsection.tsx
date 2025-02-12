"use client";
import { useState } from "react";
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon } from "lucide-react";
import { useCourseContext,Module } from "./Context";
import ModuleCard from "./ModuleCard";

export default function Mainsection() {
  const {state,dispatch} = useCourseContext();
  const [moduleName, setModuleName] = useState("");
  function handleAddModule(){
    throw new Error("Function not implemented.");
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Course Builder</h1>
        <Button variant={"secondary"}>Upload course</Button>
      </div>

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
            // dispatch={dispatch}
            // course={course}
          />
        ))}
      </div>
    </div>
  )
}
