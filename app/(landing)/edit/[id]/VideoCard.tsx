"use client"
import React, { useState } from 'react'
import { useCourseContext, Video as vid } from './Context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import MediaUploader from "./MediaUploder"
import Confirmation from '@/components/generic/Confirmation'
import Video from './Video'

export default function VideoCard({ lesson, url, thumbnail, title, description, id }: vid) {
    const { dispatch } = useCourseContext()
    const [video, setVideo] = useState<File | null>(null)
    const [videoUrl, setVideoUrl] = useState<string>(url)
    const [isVideoDialogOpen, setIsVideoDialogOpen] = useState(false)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
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

    async function handleVideoUpload() {
        if (video) {
            // Here you would typically upload the file to your server
            // For now, we'll just update the local state
            const objectUrl = URL.createObjectURL(video)
            setVideoUrl(objectUrl);
            setIsUploadDialogOpen(false);
        }
    }

    function deleteVideo() {
        
    }

    return (
        <Card className='my-2'>
            <CardHeader className='my-2'>
                <CardTitle className='flex items-center justify-between'>
                    <p>Lesson-{lesson}</p>
                    <Confirmation onConfirmation={deleteVideo}/>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex items-center justify-around gap-4'>
                    {/* Thumbnail Section */}
                    <div className='flex-1'>
                        <h1 className="text-center text-2xl font-semibold mb-2">Thumbnail</h1>
                        <div className='relative group aspect-video'>
                            {thumbnailUrl ? (
                                <>
                                    <img 
                                        src={thumbnailUrl} 
                                        alt='Thumbnail'
                                        className='w-full h-full object-cover'
                                    />
                                    <div className='flex items-center justify-center gap-2 absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-60 transition-all duration-300'>
                                        <Dialog open={isThumbnailDialogOpen} onOpenChange={setIsThumbnailDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button>Preview</Button>
                                            </DialogTrigger>
                                            <DialogContent className='p-0 aspect-video'>
                                                <img
                                                    src={thumbnailUrl} 
                                                    alt='Thumbnail' 
                                                    className='w-full h-full object-cover'
                                                />
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog open={isThumbUploadDialogOpen} onOpenChange={setIsThumbUploadDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button>Change</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <MediaUploader
                                                    type='image'
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
                                <Dialog open={isThumbUploadDialogOpen} onOpenChange={setIsThumbUploadDialogOpen}>
                                    <DialogContent>
                                        <MediaUploader
                                            type='image'
                                            file={thumbnail_}
                                            setFile={setThumbnail}
                                            onCancel={() => setIsThumbUploadDialogOpen(false)}
                                            onUpload={handleImageUpload}
                                            previewUrl={thumbnailUrl}
                                            setPreviewUrl={setThumbnailUrl}
                                            setModalClose={setIsThumbUploadDialogOpen}
                                        />
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>
                    </div>

                    {/* Video Section */}
                    <div className='flex-1'>
                        <h1 className="text-center text-2xl font-semibold mb-2">Video</h1>
                        <div className='relative group'>
                            {videoUrl ? (
                                <>
                                    <div className='aspect-video'>
                                        {videoUrl===url?<Video src={videoUrl} />:<video src={videoUrl}/>}
                                    </div>
                                    <div className='flex items-center justify-center gap-2 absolute top-0 left-0 right-0 bottom-[20%] bg-gray-800 opacity-0 group-hover:opacity-60 transition-all duration-300'>
                                        <Dialog open={isVideoDialogOpen} onOpenChange={setIsVideoDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button>Preview</Button>
                                            </DialogTrigger>
                                            <DialogContent className='p-0 max-w-4xl w-full aspect-video'>
                                                <Video src={videoUrl} />
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button>Change</Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <MediaUploader
                                                    type='video'
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
                                <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
                                    <DialogContent>
                                        <MediaUploader
                                            type='video'
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
                            )}
                        </div>
                    </div>
                </div>

                <div className='mt-4 space-y-2'>
                    <Label htmlFor='lesson' className='text-xl'>Lesson number</Label>
                    <Input 
                        id='lesson' 
                        value={lesson}
                        type='number' 
                        onChange={e => dispatch({ 
                            type: "CHANGE_VIDEO_LESSON", 
                            payload: { id, lesson: Number(e.target.value) } 
                        })}
                    />
                    <Label htmlFor='title' className='text-xl'>Title</Label>
                    <Input 
                        id='title' 
                        value={title} 
                        onChange={e => dispatch({ 
                            type: "CHANGE_VIDEO_TITLE", 
                            payload: { id, title: e.target.value } 
                        })}
                    />
                    <Label htmlFor='description' className='text-xl'>Description</Label>
                    <Textarea 
                        id='description' 
                        value={description}
                        onChange={e => dispatch({ 
                            type: "CHANGE_VIDEO_DESCRIPTION", 
                            payload: { id, description: e.target.value } 
                        })}
                    />
                </div>
            </CardContent>
        </Card>
    )
}