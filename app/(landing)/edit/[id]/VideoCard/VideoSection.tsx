"use client"
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { buttonVariants } from '@/components/ui/button'
import MediaUploader from "./MediaUploder"
import { Dispatch, SetStateAction, useState } from 'react'
import Video from './Video'

export default function VideoSection({ 
  url,video,setVideo 
}: { 
  url: string, 
  video: File | null,
  setVideo:Dispatch<SetStateAction<File | null>>
}) {
    const [videoUrl, setVideoUrl] = useState<string>(url)
    const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);

    async function handleVideoUpload() {
        if (video) {
            const objectUrl = URL.createObjectURL(video)
            setVideoUrl(objectUrl);
            setIsUploadDialogOpen(false);
        }
    }
  return (
    <div className="flex-1">
      <h1 className="text-center text-2xl font-semibold mb-2">Video</h1>
      <div className="relative group">
        {videoUrl ? (
          <>
            <div className="aspect-video">
              {videoUrl === url ? (
                <Video src={videoUrl} />
              ) : (
                <video src={videoUrl} />
              )}
            </div>
            <div className="flex items-center justify-center gap-2 absolute top-0 left-0 right-0 bottom-[20%] bg-gray-800 opacity-0 group-hover:opacity-60 transition-all duration-300">
              <Dialog
                open={isVideoDialogOpen}
                onOpenChange={setIsVideoDialogOpen}
              >
                <DialogTrigger asChild>
                    <div className={buttonVariants()}>
                        Preview
                    </div>
                </DialogTrigger>
                <DialogContent className="p-0 max-w-4xl w-full aspect-video">
                  <Video src={videoUrl} />
                </DialogContent>
              </Dialog>
              <Dialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
              >
                <DialogTrigger asChild>
                    <div className={buttonVariants()}>
                        Change
                    </div>
                </DialogTrigger>
                <DialogContent>
                  <MediaUploader
                    type="video"
                    file={video}
                    setFile={setVideo}
                    onCancel={() => setIsUploadDialogOpen(false)}
                    onUpload={handleVideoUpload}
                    previewUrl={videoUrl}
                    setPreviewUrl={setVideoUrl}
                    setModalClose={setIsUploadDialogOpen}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
            <MediaUploader
                type="video"
                file={video}
                setFile={setVideo}
                onCancel={() => setIsUploadDialogOpen(false)}
                onUpload={handleVideoUpload}
                previewUrl={videoUrl}
                setPreviewUrl={setVideoUrl}
                setModalClose={setIsUploadDialogOpen}
            />
        )}
      </div>
    </div>
  );
}
