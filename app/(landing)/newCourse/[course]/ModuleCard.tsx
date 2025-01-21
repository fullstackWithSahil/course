"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent } from "react";
import { Module, Video, Action } from "./Context";
import { Textarea } from "@/components/ui/textarea";
import Assets from "./Assets";
import { useToast } from "@/hooks/use-toast";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from "@clerk/nextjs";

export default function ModuleCard({
  module,
  dispatch,
  course
}: {
  module: Module;
  dispatch: React.Dispatch<Action>;
  course:string;
}) {
  const {userId} = useAuth();
  const key =`${userId}/${course}/${module.name}/lesson-${module.videos.length+1}`;
  const supabase = createClientComponentClient();
  const {toast} = useToast();
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [video,setVideo] = useState<File|null>();
  const [Thumbnail,setThumbnail] = useState<File|null>();

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "image") {
          setImagePreview(reader.result as string);
          setThumbnail(file);
        } else {
          setVideoPreview(reader.result as string);
          setVideo(file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVideo = async() => {
    if(!imagePreview&&!videoPreview){
      toast({
        title:"Add the video and thumbnail",
        description:"you have not added the video or the thumbnail",
      })
      return;
    }
    if (videoTitle.trim() && videoDescription.trim()) {
      dispatch({
        type: "ADD_VIDEO",
        payload: {
          moduleId: module.id,
          video: {
            id: Date.now().toString(),
            title: videoTitle,
            description: videoDescription,
            url:key
          },
        },
      });
      setVideoTitle("");
      setVideoDescription("");
      setImagePreview(null);
      setVideoPreview(null);
      setVideo(null);
      setThumbnail(null);
      if (video && Thumbnail) {
        const courseDetails = await supabase.storage.from("courses").upload(key, video);
        const thumbnailDetails = await supabase.storage.from("thumbnails").upload(key, Thumbnail);
        if (courseDetails.error || thumbnailDetails.error) {
          console.log({ courseDetails, thumbnailDetails });
        }
      } else {
        toast({
          title: "Error",
          description: "Video or Thumbnail file is missing.",
        });
      }
      
    }
  };

  return (
    <Card key={module.id}>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{module.name}</h2>
        </div>

        {/* Add Video Section */}
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <Input
            placeholder="Video Title"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
          />
          <Textarea
            placeholder="Video Description"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
          />
          <Assets 
            handleAddVideo={handleAddVideo} 
            handleFileChange={handleFileChange} 
            imagePreview={imagePreview} 
            videoPreview={videoPreview}
          />
        </div>

        {/* List Videos */}
        <ul className="space-y-2">
          {module.videos.map((video: Video) => (
            <li key={video.id} className="flex justify-between items-center">
              <div>
                <strong>{video.title}</strong>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}