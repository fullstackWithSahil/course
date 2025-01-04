"use client";
import { PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from 'next/navigation'

export default function Page() {
  const [name,setName] = useState("");
  const [desc,setDesc] = useState("");
  const {toast} = useToast();
  const {userId} = useAuth();
  const router = useRouter();
  async function handleClick(){
    try {
      // const {data} = await axios.post("http://localhost:8080/api/createCourses", {
      //   name,
      //   description:desc,
      //   teacher:userId
      // })
      router.push(`/newCourse/${name}`)
    } catch (error) {
      toast({
        title: "Error creating a course",
        description:"There was an error creating a course try again later"
      })
    }
  }
  return (
    <>
      <h1 className="text-4xl text-center font-bold">Create a new course</h1>
      <Dialog>
        <DialogTrigger asChild>
          <div className="h-24 cursor-pointer w-4/5 border-2 rounded-lg flex items-center justify-center mx-[auto]">
            <PlusCircle />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new Course</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Course Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
                value={name}
                onChange={e=>setName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Description
              </Label>
              <Input
                id="username"
                defaultValue="@peduarte"
                className="col-span-3"
                value={desc}
                onChange={e=>setDesc(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleClick}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
