"use client"
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import MediaUploader from "./MediaUploder"
import { useState } from 'react'


export default function ImageSection({thumbnail}:{thumbnail:string}) {
    const [thumbnail_, setThumbnail] = useState<File | null>(null)
    const [thumbnailUrl, setThumbnailUrl] = useState<string>(thumbnail)
    const [isThumbnailDialogOpen, setIsThumbnailDialogOpen] = useState(false)
    const [isThumbUploadDialogOpen, setIsThumbUploadDialogOpen] = useState(false)
    async function handleImageUpload() {
        if (thumbnail_) {
            // Here you would typically upload the file to your server
            // For now, we'll just update the local state
            const objectUrl = URL.createObjectURL(thumbnail_)
            setThumbnailUrl(objectUrl)
            setIsThumbUploadDialogOpen(false)
        }
    }
  return (
    <div className="flex-1">
      <h1 className="text-center text-2xl font-semibold mb-2">Thumbnail</h1>
      <div className="relative group aspect-video">
        {thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl}
              alt="Thumbnail"
              className="w-full h-full object-cover"
            />
            <div className="flex items-center justify-center gap-2 absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-60 transition-all duration-300">
              <Dialog
                open={isThumbnailDialogOpen}
                onOpenChange={setIsThumbnailDialogOpen}
              >
                <DialogTrigger asChild>
                    <div className={buttonVariants()}>
                        Preview
                    </div>
                </DialogTrigger>
                <DialogContent className="p-0 aspect-video">
                  <img
                    src={thumbnailUrl}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                  />
                </DialogContent>
              </Dialog>
              <Dialog
                open={isThumbUploadDialogOpen}
                onOpenChange={setIsThumbUploadDialogOpen}
              >
                <DialogTrigger asChild>
                    <div className={buttonVariants()}>
                        Change
                    </div>
                </DialogTrigger>
                <DialogContent>
                  <MediaUploader
                    type="image"
                    file={thumbnail_}
                    setFile={setThumbnail}
                    onCancel={() => setIsThumbUploadDialogOpen(false)}
                    onUpload={handleImageUpload}
                    previewUrl={thumbnailUrl}
                    setModalClose={setIsThumbUploadDialogOpen}
                    setPreviewUrl={setThumbnailUrl}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </>
        ) : (
            <MediaUploader
                type="image"
                file={thumbnail_}
                setFile={setThumbnail}
                onCancel={() => setIsThumbUploadDialogOpen(false)}
                onUpload={handleImageUpload}
                previewUrl={thumbnailUrl}
                setPreviewUrl={setThumbnailUrl}
                setModalClose={setIsThumbUploadDialogOpen}
            />
        )}
      </div>
    </div>
  );
}
