"use client"
import React, { useState } from 'react'
import { useCourseContext, Video as vid } from './Context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Button} from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import ImageUploader from './Imageuploder'
import Confirmation from '@/components/generic/Confirmation';
import Video from './Video'

export default function VideoCard({ lesson, url, thumbnail, title, description, id }: vid) {
    const [imageOpen, setImageOpen] = useState(false);
    const [videoClicked, setVideoClicked] = useState(false);
    const { dispatch } = useCourseContext();
    
    function handleImageUpload(image: string | null): void {
        console.log("Uploaded image:", image);
    }

    function deleteVideo() {}

    return(
        <Card className='my-2'>
            <CardHeader className='my-2'>
                <CardTitle className='flex items-center justify-between'>
                    <p>Lesson-{lesson}</p>
                    <Confirmation onConfirmation={deleteVideo}/>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex items-center justify-around gap-4'>
                    <div className='flex-1'>
                        <h1 className="text-center text-2xl font-semibold mb-2">Thumbnail</h1>
                        <div className='relative group aspect-video'>
                            {thumbnail ? (
                                <>
                                    <img 
                                        src={thumbnail} 
                                        alt='Thumbnail'
                                        className='w-full h-full object-cover'
                                    />
                                    <div className='flex items-center justify-center gap-2 absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-60 transition-all duration-300'>
                                        <Dialog onOpenChange={setImageOpen} open={imageOpen}>
                                            <DialogTrigger>
                                                <Button>Preview</Button>
                                            </DialogTrigger>
                                            <DialogContent className='p-0 aspect-video'>
                                                <Image 
                                                    src={thumbnail} 
                                                    alt='Thumbnail' 
                                                    width={1280} 
                                                    height={720}
                                                    className='w-full h-full object-cover'
                                                />
                                            </DialogContent>
                                        </Dialog>
                                        <Dialog>
                                            <DialogTrigger>
                                                <Button>Change</Button>
                                            </DialogTrigger>
                                            <DialogContent className='p-0 aspect-video'>
                                                <ImageUploader 
                                                    onUpload={handleImageUpload} 
                                                    onCancel={() => setImageOpen(false)}
                                                />
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                </>
                            ) : (
                                <ImageUploader onCancel={() => {}} onUpload={() => {}}/>
                            )}
                        </div>
                    </div>
                    <div className='flex-1'>
                        <h1 className="text-center text-2xl font-semibold mb-2">Video</h1>
                        <div className='relative group'>
                            {url ? (
                                <>
                                    <div onClick={() => setVideoClicked(true)} className='aspect-video'>
                                        <Video src={url} />
                                    </div>
                                    {videoClicked && (
                                        <div className='flex items-center justify-center gap-2 absolute top-0 left-0 right-0 bottom-[20%] bg-gray-800 opacity-0 group-hover:opacity-60 transition-all duration-300'>
                                            <Dialog onOpenChange={setImageOpen} open={imageOpen}>
                                                <DialogTrigger>
                                                    <Button>Preview</Button>
                                                </DialogTrigger>
                                                <DialogContent className='p-0 max-w-4xl w-full aspect-video'>
                                                    <Video src={url} />
                                                </DialogContent>
                                            </Dialog>
                                            <Dialog>
                                                <DialogTrigger>
                                                    <Button>Change</Button>
                                                </DialogTrigger>
                                                <DialogContent className='p-0 aspect-video'>
                                                    <ImageUploader 
                                                        onUpload={handleImageUpload} 
                                                        onCancel={() => setImageOpen(false)}
                                                    />
                                                </DialogContent>
                                            </Dialog>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <ImageUploader onCancel={() => {}} onUpload={() => {}}/>
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
                        onChange={e => dispatch({ type: "CHANGE_VIDEO_LESSON", payload: { id, lesson: Number(e.target.value) } })}
                    />
                    <Label htmlFor='title' className='text-xl'>Title</Label>
                    <Input 
                        id='title' 
                        value={title} 
                        onChange={e => dispatch({ type: "CHANGE_VIDEO_TITLE", payload: { id, title: e.target.value } })}
                    />
                    <Label htmlFor='description' className='text-xl'>Description</Label>
                    <Textarea 
                        id='description' 
                        value={description}
                        onChange={e => dispatch({ type: "CHANGE_VIDEO_DESCRIPTION", payload: { id, description: e.target.value } })}
                    />
                </div>
            </CardContent>
        </Card>
    )
}