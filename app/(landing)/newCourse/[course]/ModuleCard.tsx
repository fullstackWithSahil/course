"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState, ChangeEvent } from "react";
import { Module, Video, Action } from "./Context";
import { Textarea } from "@/components/ui/textarea";
import Assets from "./Assets";
import { useAuth } from "@clerk/nextjs";
import axios from 'axios';
import supabaseClient from "@/lib/supabase";
import { toast } from "sonner";


export default function ModuleCard({
  module,
  dispatch,
  course
}: {
  module: Module;
  dispatch: React.Dispatch<Action>;
  course:string;
}) {
  const {userId,getToken} = useAuth(); 
  const key =`${userId}/${course}/${module.name}/lesson-${module.videos.length+1}`;
  const host ="https://buisnesstools-course.b-cdn.net/";
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [video,setVideo] = useState<Blob|null>();
  const [Thumbnail,setThumbnail] = useState<Blob|null>();
  const [uploding,setUploding] = useState(false);

  async function handleAddVideo(){
    try {
      if(uploding) return;
      setUploding(true);
      if(!Thumbnail||!video){
        toast("It seems that you have not uploaded video or thumbnail")
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
              url:host+key,
              thumbnail:host+key+"/thumbnail.webp"
            },
          },
        });
      }
      const videodata = new FormData();
      videodata.append("video",video);
      videodata.append("key",key);
      const {data}= await axios.post("http://13.203.204.51:8080/api/video/transcode",videodata);
      if(!data.message){
        toast(data);
        return;
      }
      const thumbnailData = new FormData();
      thumbnailData.append("key",`${key}/thumbnail.webp`);
      thumbnailData.append("file",Thumbnail);
      const token = await getToken({template:"supabase"});
      const supabase = supabaseClient(token);
      const {error} = await supabase.functions.invoke("imageResizing",{body:thumbnailData});
      if(error){
        toast("There was an error uploding the thumbnail")
      }

      setVideoTitle("");
      setVideoDescription("");
      setImagePreview(null);
      setVideoPreview(null);
      setVideo(null);
      setThumbnail(null);
      setUploding(false);
    } catch (error) {
      console.log(error)
      toast("there was an error uploading video")
    }
  }

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
            uploading={uploding}
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