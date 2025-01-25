"use client";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { PlusIcon } from "lucide-react";
import { ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Assets({
  handleFileChange,
  imagePreview,
  videoPreview,
  handleAddVideo,
  uploading
}: {
  handleFileChange: (
    e: ChangeEvent<HTMLInputElement>,
    type: "image" | "video"
  ) => void;
  imagePreview: string | null;
  videoPreview: string | null;
  handleAddVideo: () => void;
  uploading:boolean;
}) {
  return (
    <div className="flex justify-around items-start gap-3">
      <div className="space-y-2">
        <Label htmlFor="picture">Thumbnail</Label>
        <Input
          id="picture"
          type="file"
          accept="image/png"
          onChange={(e) => handleFileChange(e, "image")}
        />
        {imagePreview && (
          <div className="w-24 h-24 relative overflow-hidden rounded-md flex-shrink-0">
            <Image
              src={imagePreview}
              alt="Image Preview"
              fill
              className="aspect-video bg-cover"
            />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="video">Video</Label>
        <Input
          id="video"
          type="file"
          accept="video/mp4"
          onChange={(e) => handleFileChange(e, "video")}
        />
        {videoPreview && (
            <div className="w-24 h-24 relative overflow-hidden rounded-md flex-shrink-0">
            <video
                src={videoPreview}
                controls
                className="absolute inset-0 w-full h-full object-cover aspect-video"
            >
                Your browser does not support the video tag.
            </video>
            </div>
        )}
      </div>

      <div className="space-y-2 flex items-center justify-center">
        <Button onClick={handleAddVideo} className={uploading?"bg-gray-800":""}>
            <PlusIcon className="mr-2 h-4 w-4" />
            {uploading?"uploding...":"Add Video"}
        </Button>
      </div>
    </div>
  );
}
