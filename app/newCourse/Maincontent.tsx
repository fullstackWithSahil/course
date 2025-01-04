"use client";
import { useReducer, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { Module, useCourseContext } from "./Context";
import ModuleCard from "./ModuleCard";

export default function CourseBuilder() {
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Course Builder</h1>

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
