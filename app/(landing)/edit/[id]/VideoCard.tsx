import React, { useState } from 'react'
import { useCourseContext, Video } from './Context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Button} from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import ImageUploader from './Imageuploder'
import Confirmation from '@/components/generic/Confirmation'



export default function VideoCard(v:Video){
    const [imageOpen,imageOpenSetOpen] = useState(false);
    const {dispatch} = useCourseContext();
    function handleImageUplode(image: string | null): void {
        throw new Error('Function not implemented.')
    }

    function handleCancle(): void {
       
    }

    function deleteVideo(){}

    return(
        <Card className='my-2'>
            <CardHeader className='my-2'>
                <CardTitle className='flex items-center justify-between'>
                    <p>
                    lesson-{v.lesson}
                    </p>

                    <Confirmation onConfirmation={deleteVideo}/>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex items-center justify-around'>
                    <div>
                        <h1 className="text-center text-2xl font-semibold">Thumbnail</h1>
                        <div className='relative group'> {/* Add group class here */}
                            {/* add an uploder if thumbnail does not exist */}
                            {v.thumbnail?<>
                            <Image 
                                src={v.thumbnail} 
                                alt='sahil' 
                                width={16*22} 
                                height={9*22} 
                                className='z-0'
                            />
                            <div className='flex items-center justify-center absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-60 group-hover:z-10 pointer-events-none group-hover:pointer-events-auto transition-all duration-300'> {/* Modified this div */}
                                <Dialog onOpenChange={imageOpenSetOpen} open={imageOpen}>
                                    <DialogTrigger>
                                        <Button className='group-hover:z-10 bg-opacity-100'>
                                            Preview
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='p-0 aspect-video'>
                                        <Image src={v.thumbnail} alt='sahil' width={16*70} height={9*70}/>
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger>
                                        <Button className='group-hover:z-10 bg-opacity-100'>
                                            Change
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='p-0 aspect-video'>
                                        <ImageUploader 
                                            onUpload={handleImageUplode} 
                                            onCancel={()=>imageOpenSetOpen(false)}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            </>:<ImageUploader onCancel={()=>{}} onUpload={()=>{}}/>}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-center text-2xl font-semibold">Video</h1>
                        <div className='relative group'> {/* Add group class here */}
                            {/* add an uploder if thumbnail does not exist */}
                            {v.url?<>
                            <Image 
                                src={v.thumbnail} 
                                alt='sahil' 
                                width={16*22} 
                                height={9*22} 
                                className='z-0'
                            />
                            <div className='flex items-center justify-center absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-60 group-hover:z-10 pointer-events-none group-hover:pointer-events-auto transition-all duration-300'> {/* Modified this div */}
                                <Dialog onOpenChange={imageOpenSetOpen} open={imageOpen}>
                                    <DialogTrigger className='group-hover:z-10 bg-opacity-100'>
                                        <Button className=''>
                                            Preview
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='p-0 aspect-video'>
                                        <Image src={v.thumbnail} alt='sahil' width={16*70} height={9*70}/>
                                    </DialogContent>
                                </Dialog>
                                <Dialog>
                                    <DialogTrigger>
                                        <Button className='group-hover:z-10 bg-opacity-100'>
                                            Change
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className='p-0 aspect-video'>
                                        <ImageUploader 
                                            onUpload={handleImageUplode} 
                                            onCancel={()=>imageOpenSetOpen(false)}
                                        />
                                    </DialogContent>
                                </Dialog>
                            </div>
                            </>:<ImageUploader onCancel={()=>{}} onUpload={()=>{}}/>}
                        </div>
                    </div>
                </div>
                <div>
                    <Label htmlFor='lesson' className='text-xl'>Lesson number</Label>
                    <Input 
                        id='lesson' 
                        value={v.lesson}
                        type='number' 
                        onChange={e=>dispatch({type:"CHANGE_VIDEO_LESSON",payload:{id:v.id,lesson:Number(e.target.value)}})}
                    />
                    <Label htmlFor='title' className='text-xl'>Title</Label>
                    <Input 
                        id='title' 
                        value={v.title} 
                        onChange={e=>dispatch({type:"CHANGE_VIDEO_TITLE",payload:{id:v.id,title:e.target.value}})}
                    />
                    <Label htmlFor='description' className='text-xl'>Description</Label>
                    <Textarea 
                        id='description' 
                        value={v.description}
                        onChange={e=>dispatch({type:"CHANGE_VIDEO_DESCRIPTION",payload:{id:v.id,description:e.target.value}})}
                    />
                </div>
            </CardContent>
        </Card>
    )
}