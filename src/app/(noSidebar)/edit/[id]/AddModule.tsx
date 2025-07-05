"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCourseContext } from "./context";
import { useVideoStorage } from "./VideoStorage";
import supabaseClient from "@/lib/supabase";
import { useSession, useUser } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { useParams } from "next/navigation";
import axios from "axios";

export default function AddModule() {
    const { session } = useSession();
    const { user } = useUser();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [loading, setLoading] = useState(false);
    const {id:courseId} = useParams();

	const { state, dispatch } = useCourseContext();
	const { state: videoFiles } = useVideoStorage();
	const [module, setModule] = useState("");

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

    function validate() {
        // Validating if there are any modules with duplicate lesson numbers
        let valid = true;
        
        for (const module of state) {
        const lessons = new Set();
        for (const video of module.videos) {
            if (lessons.has(video.lesson)) {
            valid = false;
            return valid; // Exit early if duplicate found
            }
            lessons.add(video.lesson);
        }
        }
        
        return valid;
    }

    const host = "https://buisnesstools-course.b-cdn.net";
	async function uploadCourse() {
		try {
            setLoading(true);
            //validate that you dont have duplicate lesson numbers
            if (!validate()) {
                toast.error("There are two lessons with the same number");
                setLoading(false);
                return;
            }
            
            //get the total number of videos for tracking progress
            let totalVideos =0;
            state.forEach((module)=>{
                totalVideos = totalVideos+module.videos.length;
            })
            let videoUploded = 0;

			//update the existing videos and insert the new ones
			const supabase = supabaseClient(session);
            state.forEach((module)=>{
                module.videos.forEach(async(video)=>{
                    try {
                        if(video.existing){
                            //updating the metadata if video already existing
                            const {error} = await supabase
                                .from("videos")
                                .update({
                                    title:video.title,
                                    description:video.description,
                                    lesson:video.lesson
                                })
                                .eq("id",Number(video.id))
                            if (error) {
                                console.error("Error uploading video metadata:", error);
                                toast.error(`Error uploading ${video.title}: ${error.message}`);
                            }
                        }else{
                            //inserting the video if it did not exist earlier
                            const videoToUpload = {
                                teacher: user?.id,
                                module: module.name,
                                thumbnail: video.thumbnail,
                                url:`${host}/${video.id}`,//id contains courseId/modulename/uuid
                                title: video.title,
                                description: video.description,
                                lesson: video.lesson,
                                course: Number(courseId)
                            };
                            
                            const { error } = await supabase.from("videos").insert(videoToUpload);
                            if (error) {
                                console.error("Error uploading video metadata:", error);
                                toast.error(`Error uploading ${video.title}: ${error.message}`);
                            }
                            
                            // Get the video from the VideoStorage context
                            let videoToTranscode:any = null;
                            videoFiles.videos.forEach((videoFile) => {
                                if (videoFile.key === video.id) {
                                    videoToTranscode = videoFile.videoFile;
                                }
                            });
                            if (!videoToTranscode) {
                                console.error(`Video file not found for key: ${video.id}`);
                            }
                            
                            // Queue the video for transcoding
                            const videoData = new FormData();
                            videoData.append("video", videoToTranscode);
                            videoData.append("key", video.id);
                            
                            await axios.post("http://localhost:8080/api/transcode", videoData);
                        }
                        videoUploded++;
                        const precentage = (videoUploded/totalVideos)*100;
                        setUploadProgress(precentage)
                    } catch (error) {
                        throw error;   
                    }
                })
            })
		} catch (error) {
			toast("There was an error uploding the course");
		}finally{
            setLoading(false);
        }
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
							Your videos are being uploaded. Please do not
							refresh the page or close this tab.
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
				<Button onClick={addModule} className="mx-4">
					Add Module
				</Button>
				<Button onClick={uploadCourse} className="col-span-3 mx-4">
					Upload Course
				</Button>
			</div>
		</>
	);
}

const LoadingSpinner = () => {
	return (
		<div className="flex justify-center items-center py-4">
			<Loader2 className="h-8 w-8 animate-spin text-primary" />
		</div>
	);
};
