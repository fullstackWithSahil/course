"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCourseContext } from "./context";


export default function AddModule() {
    const {state,dispatch} = useCourseContext();
    const [module,setModule] = useState("");

    function addModule() {
        if (!module) {
            toast.error("Please enter a module name");
            return;
        }
        dispatch({
            type: "ADD_MODULE",
            payload: { id: String(state.length), name: module },
        });
        setModule("");
    }
    
    function uploadCourse(){
    }

    return (
        <>
        <div className="m-3 grid grid-cols-3 gap-2">
            <Input
                className="col-span-2 mx-4"
                value={module}
                onChange={(e) => setModule(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                    addModule();
                    }
                }}
                placeholder="Enter module name"
            />
            <Button onClick={addModule} className="mx-4">Add Module</Button>
            <Button onClick={uploadCourse} className="col-span-3 mx-4">
                Upload Course
            </Button>
        </div>
    </>
  )
}

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};