"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PlusIcon } from "lucide-react";
import { useCourseContext,Module } from "./Context";
import Confirmation from "@/components/generic/Confirmation";
import VideoCard from "./VideoCard/VideoCard";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Mainsection() {
  const {state,dispatch} = useCourseContext();
  const [moduleName, setModuleName] = useState("");
  const {toast} = useToast();
  
  function handleAddModule(){
    if (moduleName) {
      dispatch({
        type: "ADD_MODULE",
        payload: { id: Date.now().toString(), name: moduleName },
      });
      setModuleName("");
    }
  }

  async function handleUplode(){
    try {
      console.log({state})
    } catch (error) {
      console.log(error);
      toast({
        title:"There was an error editing the course",
        description:"There was an error editing the course try again later",
      })
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Course Editor</h1>
        <Button variant={"secondary"} onClick={handleUplode}>Upload course</Button>
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
          />
        ))}
      </div>
    </div>
  )
}

function ModuleCard({module}:{module:Module}) {
  const {dispatch} = useCourseContext();
  function deleteModule(){}
  function addLesson(){
      dispatch({
        type: "ADD_VIDEO",
        payload: {
          moduleId: module.id,
          video: {
            id: Date.now().toString(),
            title: "",
            description: "",
            url:"",
            thumbnail:"",
            lesson: module.videos.length + 1,
          },
        },
      });
  }
  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-center capitalize text-3xl flex items-center justify-center gap-2'>
                <p>
                {module.name}
                </p>
                <Confirmation onConfirmation={deleteModule}/>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div>
              <Label htmlFor="name">Module Name</Label>
              <Input 
                id="name" 
                value={module.name} 
                onChange={e=>dispatch({type:"UPDATE_MODULE_NAME",payload:{id:module.id,name:e.target.value}})}
              />
            </div>
            {module.videos.map(v =><VideoCard module={module} key={v.id} {...v}/>)}
            <Button onClick={addLesson}>Add a new lesson</Button>
        </CardContent>
    </Card>
  )
}