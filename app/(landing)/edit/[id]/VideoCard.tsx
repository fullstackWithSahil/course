"use client"
import React, { useEffect, useRef, useState } from 'react'
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
import videojs from 'video.js'
import "video.js/dist/video-js.css";


export default function VideoCard({ lesson, url, thumbnail, title, description, id }: vid) {
    const [imageOpen, setImageOpen] = useState(false);
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
                <div className='flex items-center justify-around'>
                    <div>
                        <h1 className="text-center text-2xl font-semibold">Thumbnail</h1>
                        <div className='relative group'>
                            {thumbnail ? (
                                <>
                                    <img 
                                        src={thumbnail} 
                                        alt='Thumbnail' 
                                        width={16*22} 
                                        height={9*22} 
                                        className='z-0'
                                    />
                                    <div className='flex items-center justify-center absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-60 transition-all duration-300'>
                                        <Dialog onOpenChange={setImageOpen} open={imageOpen}>
                                            <DialogTrigger>
                                                <Button>Preview</Button>
                                            </DialogTrigger>
                                            <DialogContent className='p-0 aspect-video'>
                                                <Image src={thumbnail} alt='Thumbnail' width={16*70} height={9*70}/>
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
                    <div>
                        <h1 className="text-center text-2xl font-semibold">Video</h1>
                        <div className='relative group'>
                            {url ? (
                                <div>
                                    <Video src={url} className='w-[352px] h-[198px]'/>
                                </div>
                            ) : (
                                <ImageUploader onCancel={() => {}} onUpload={() => {}}/>
                            )}
                        </div>
                    </div>
                </div>
                <div>
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

function Video({src,className}:{src:string,className?:string}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<any | null>(null);
    useEffect(() => {
        if (!videoRef.current) return;
      
        setTimeout(() => {
          if (!videoRef.current) return; // Ensure the ref exists
      
          playerRef.current = videojs(videoRef.current, {
            autoplay: false,
            responsive: true,
            controls: true,
            liveui: false,
            sources: [
              {
                src: src+"/1080/index.m3u8",
                type: "application/x-mpegURL",
              },
            ],
          });
      
          console.log("Video.js player initialized:", playerRef.current);
      
          playerRef.current.on("error", () => {
            console.error("Video.js error:", playerRef.current.error());
          });
        }, 0); // Small delay to ensure the DOM is updated
      
        return () => {
          if (playerRef.current) {
            playerRef.current.dispose();
          }
        };
      }, [src]);
    return (
      <div data-vjs-player className={className}>
        <video width={16*22} height={9*22}ref={videoRef} className="video-js vjs-default-skin" />
      </div>
    );
}