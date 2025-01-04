"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { Module, Video, Action } from "./Context";
import { Textarea } from "@/components/ui/textarea";
import Assets from "./Assets";

export default function ModuleCard({
  module,
  dispatch,
}: {
  module: Module;
  dispatch: React.Dispatch<Action>;
}) {
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

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
        } else {
          setVideoPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVideo = () => {
    if (videoTitle.trim() && videoDescription.trim()) {
      dispatch({
        type: "ADD_VIDEO",
        payload: {
          moduleId: module.id,
          video: {
            id: Date.now().toString(),
            title: videoTitle,
            description: videoDescription,
          },
        },
      });
      setVideoTitle("");
      setVideoDescription("");
      setImagePreview(null);
      setVideoPreview(null);
    }
  };

  return (
    <Card key={module.id}>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{module.name}</h2>
          <Button
            variant="destructive"
            size="sm"
            onClick={() =>
              dispatch({ type: "REMOVE_MODULE", payload: { id: module.id } })
            }
          >
            <Trash className="mr-2 h-4 w-4" />
            Remove
          </Button>
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
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  dispatch({
                    type: "REMOVE_VIDEO",
                    payload: { moduleId: module.id, videoId: video.id },
                  })
                }
              >
                <Trash className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}