"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCourseContext } from "./Context";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useVideoStorage } from "./VideoStorage";
import supabaseClient from "@/lib/supabase";
import { useSession, useUser } from "@clerk/nextjs";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { url } from "inspector";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center py-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
};

export default function AddModule() {
  const { session } = useSession();
  const { user } = useUser();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {id:courseId} = useParams();

  const [module, setModule] = useState("");
  const { state: videoFiles } = useVideoStorage();
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

  async function uploadCourse() {
    try {
      setLoading(true);
      
      if (!validate()) {
        toast.error("There are two lessons with the same number");
        setLoading(false);
        return;
      }
      
      const supabase = supabaseClient(session);
      // Count total videos across all modules
      let totalVideos = 0;
      state.forEach(module => {
        totalVideos += module.videos.length;
      });
      
      if (totalVideos === 0) {
        toast.error("Please add at least one video to upload");
        setLoading(false);
        return;
      }
    	const host = "https://buisnesstools-course.b-cdn.net";

      let uploadedCount = 0;
      
      // Process each module sequentially
      for (const module of state) {
        // Process each video in the module
        for (const video of module.videos) {
          try {
            // Insert metadata to supabase
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
              continue; // Continue with next video despite error
            }
            
            // Get the video from the VideoStorage context
            let videoToTranscode = null;
            
            videoFiles.videos.forEach((videoFile) => {
              if (videoFile.key === video.id) {
                videoToTranscode = videoFile.videoFile;
              }
            });
            
            if (!videoToTranscode) {
              console.error(`Video file not found for key: ${video.id}`);
              continue;
            }
            
            // Queue the video for transcoding
            const videoData = new FormData();
            videoData.append("video", videoToTranscode);
            videoData.append("key", video.id);
            
            await axios.post("http://localhost:8080/api/transcode", videoData);
            
            // Update progress after each successful upload
            uploadedCount++;
            setUploadProgress(Math.floor((uploadedCount / totalVideos) * 100));
          } catch (videoError) {
            console.error(`Error processing video ${video.title}:`, videoError);
            toast.error(`Error processing ${video.title}`);
          }
        }
      }
      
      // If we got here with at least some uploads, consider it a success
      if (uploadedCount > 0) {
        if (uploadedCount < totalVideos) {
          toast.success(`Uploaded ${uploadedCount} out of ${totalVideos} videos successfully`);
        } else {
          toast.success("All videos uploaded successfully");
        }
        
        // Allow time for the user to see the success message before redirecting
        setTimeout(() => {
          router.push("/home");
        }, 2000);
      } else {
        toast.error("Failed to upload any videos");
      }
    } catch (error) {
      console.error("General error in uploadCourse:", error);
      toast.error("There was an error uploading the course");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Only redirect when upload is complete and loading state is finished
    if (uploadProgress === 100 && !loading) {
      toast.success("Course uploaded successfully");
      router.push("/home");
    }
  }, [uploadProgress, loading, router]);

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
  );
}