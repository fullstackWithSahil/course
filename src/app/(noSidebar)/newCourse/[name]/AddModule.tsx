"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourseContext } from "./Context";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useVideoStorage } from "./VideoStorage";
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};


export default function AddModule() {
	const {session} = useSession();
	const [uploadProgress, setUploadProgress] = useState(0);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const [module, setModule] = useState("");
	const {state:video} = useVideoStorage();
	const { dispatch, state } = useCourseContext();

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

	async function uplodeCourse(){
		try {
			console.log(state);
			console.log(video);
			setLoading(true);
			const supabase = supabaseClient(session);
			let uploded = 0;
			const totalVideos = state.flat().length;
			state.forEach((module) => {
				module.videos.forEach(async (video) => {
					const videoToUplode = {}
					const {error} = await supabase.from("videos").insert(videoToUplode);
					uploded++;
					setUploadProgress(Math.floor((uploded / totalVideos) * 100));
				})
			})
		} catch (error) {
			toast.error("there was an error uploding the course")
		}
	}
	
	useEffect(()=>{
		if(uploadProgress == 100){
			toast.success("Course uploded successfully");
			router.push("/myCourses");
		}
	},[uploadProgress])

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
					if (e.key == "Enter") {
						addModule();
					}
				}}
				/>
			<Button onClick={addModule} className="mx-4">Add Module</Button>
			<Button onClick={uplodeCourse} className="col-span-3 mx-4">
				Uplode course
			</Button>
		</div>
		</>
	);
}
