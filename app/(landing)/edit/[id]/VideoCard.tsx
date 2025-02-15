"use client"
import { useCourseContext, Video as vid } from './Context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Confirmation from '@/components/generic/Confirmation'
import VideoSection from './VideoSection'
import ImageSection from './ImageSection'

export default function VideoCard({ lesson, url, thumbnail, title, description, id }: vid) {
    const { dispatch } = useCourseContext();

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
                    <ImageSection thumbnail={thumbnail}/>
                    <VideoSection url={url}/>
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