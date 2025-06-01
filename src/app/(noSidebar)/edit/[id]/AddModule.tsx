"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCourseContext } from "./Context";
import { useSession } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabase";
import { useVideoStorage } from "./VideoStorage";
import axios from "axios";
import { useParams } from "next/navigation";

type Video = {
    id: string;
    title: string;
    description: string;
    url: string;
    thumbnail: string;
    lesson: number;
    existing: boolean;
    module:string;
}

export default function AddModule() {
    const {session} = useSession();
    const {state:VideoStorage} = useVideoStorage()
    const {state,dispatch} = useCourseContext();
    const [loading,setLoading] = useState(false);
    const [module,setModule] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const {id:courseId} = useParams();

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
        //loading state and supabase
        setLoading(true);
        const supabase = supabaseClient(session);

        //listing promises
        const existingVideos:Video[] = []
        const newVideos:Video[] = []
        state.forEach((mod)=>{
            mod.videos.forEach((vid)=>{
                if(vid.existing){
                    existingVideos.push({...vid,module})
                }else{
                    newVideos.push({...vid,module})
                }
            })
        })

        //change metadata for existing videos
        existingVideos.map((vid)=>{
            return new Promise((resolve,reject)=>{
                supabase.from("videos").update({
                    title:vid.title,
                    description:vid.description,
                    lesson:vid.lesson,
                    module:vid.module
                }).then(({error})=>{
                    if(error){
                        reject(error)
                    }else{
                        resolve("videos updated")
                    }
                })
            })
        })
        Promise.all(existingVideos).then(()=>{
            toast("Metadata for all the existing videos are updated")
        }).catch(()=>{
            toast("There was an error updataing the metadata")
        })
        
        //create entries for new videos
        newVideos.map((vid)=>{
            return new Promise((resolve,reject)=>{
                supabase.from("videos").insert({
                    title:vid.title,
                    description:vid.description,
                    module:vid.module,
                    lesson:vid.lesson,
                    thumbnail:vid.thumbnail,
                    url:vid.url,
                    course:Number(courseId),
                }).then(({error})=>{
                    if(error){
                        reject(error)
                    }else{
                        resolve("videos updated")
                    }
                })
            })
        })
        Promise.all(newVideos).then(()=>{
            toast("New video metadata added")
        }).catch(()=>{
            toast("There was an error adding the metadata for new videos")
        })

        //state to track uplode progress
        let uploadedCount =0;
        const totalVideos = VideoStorage.videos.length;

        //uploding the video files
        VideoStorage.videos.forEach((video)=>{
            const videoData = new FormData();
            videoData.append("video",video.videoFile);
            videoData.append("key", video.key);
            axios.post("http://localhost:8080/api/transcode", videoData).catch((error)=>{
                toast("there was an error uploding the video");
                console.log({error});
            })
        })
        uploadedCount++;
        setUploadProgress(Math.floor((uploadedCount / totalVideos) * 100));
        setLoading(false);
    }

    return (
        <>
            {loading && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full mx-4">
                        <h2 className="text-xl font-semibold text-center mb-4">
                        Uploading Course
                        </h2>
                        <p className="text-gray-600 text-center mb-6">
                        Your videos are being uploaded. Please do not refresh the page or close this tab.
                        </p>
                        
                        <LoadingSpinner />
                        
                        <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                    </div>
                </div>
            </div>
        )}
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