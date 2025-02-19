"use client"
import { Module, useCourseContext, Video as vid } from '../Context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Confirmation from '@/components/generic/Confirmation'
import VideoSection from './VideoSection'
import ImageSection from './ImageSection'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import supabaseClient from '@/lib/supabase'
import { useParams } from 'next/navigation'
import axios from 'axios'

export default function VideoCard({ 
    lesson, url, thumbnail, title, description, id ,module 
}: vid&{module:Module}) {
    const {toast} = useToast();
    const {getToken,userId} = useAuth();
    const params = useParams();
    const [thumbnail_, setThumbnail] = useState<File | null>(null);
    const [video, setVideo] = useState<File | null>(null)
    const { dispatch } = useCourseContext();
    const [uploading,setUploding] = useState(false);

    async function commitChanges() {
        try {
            //handling loading state for the button
            if(uploading) return;
            setUploding(true);

            // //initilizing supabase client and getting key for video and thumbnail url
            const token = await getToken({ template: "supabase" });
            const supabase = supabaseClient(token);
            const {data:course} = await supabase.from("courses").select("*").eq("id",Number(params.id));
            if(!course||!course[0]) return;
            const key =`${userId}/${course[0].name}/${module.name}/lesson-${module.videos.length+1}`;
            const host ="https://buisnesstools-course.b-cdn.net/";
            
            // //video and thumbnail transcoding if the File exist
            if(thumbnail_){
                const formData = new FormData();
                formData.append('file', thumbnail_);
                formData.append('key',`${key}/thumbnail.webp`);
                const {data,error} = await supabase.functions.invoke("imageResizing",{body:formData});
                console.log({data})
                if(error){
                    toast({
                        title:"Something went wrong",
                        description:"Sorry, something went wrong while uploading video. Please try again later.",
                    })
                }
            }

            if(video){
                const formData = new FormData();
                formData.append("video",video as Blob);
                formData.append("key",key);
                formData.append("update","true");
                const {data} = await axios.post("http://localhost:8080/api/video/transcode",formData)
                if(data=="error"){
                    toast({
                        title:"Something went wrong",
                        description:"Sorry, something went wrong while uploading the thumbnail. Please try again later.",
                    })
                }
            }

            //check if video already exists and update it and create it if it doesn't
            const {data:videos} = await supabase.from("videos").select("*").eq("id",id);
            if(!videos||videos.length === 0) {
                const {data,error} = await supabase.from("videos").insert({
                    lesson,
                    title,
                    description,
                    module:module.name,
                    teacher: userId,
                    course: Number(params.id),
                    url:host+key,
                    thumbnail:host+key+"/thumbnail.webp"
                }).select();
                console.log({data,error});
            } else {
                const {data,error} = await supabase.from("videos").update({
                    lesson,
                    title,
                    description,
                    module:module.name,
                }).eq("id",id).select();
                console.log({data,error});
            }

            //updating the loding state
            setUploding(false)
        } catch (error) {
            console.error(error)
            toast({
                title: "there was an error",
                description: "there was an error updating the video information please try again later",
            })
            setUploding(false);
        }
    }

    async function deleteVideo() {
        try {
            const token = await getToken({template:"supabase"});
            const supabase = supabaseClient(token);
            const { error } = await supabase
                .from('videos')
                .delete()
                .eq('id',id);

            if (error) {
                toast({
                    title: "there was an error deleting the video",
                    description: "there was an error deleting the video information please try again later",  
                })
            }
        
        } catch (error) {
            toast({
                title: "there was an error deleting the video",
                description: "there was an error deleting the video information please try again later",  
            })
        }
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
                    <ImageSection 
                        thumbnail={thumbnail} 
                        thumbnail_={thumbnail_} 
                        setThumbnail={setThumbnail}
                    />
                    <VideoSection 
                        url={url} 
                        video={video}
                        setVideo={setVideo}
                    />
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
                <div className='flex items-center justify-end'>
                    <Button className={`my-2 text-right ${uploading?"bg-green-300":"bg-green-600"} hover:bg-green-700`} onClick={commitChanges}>
                        {uploading?"Loading...":"Commit changes"}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}