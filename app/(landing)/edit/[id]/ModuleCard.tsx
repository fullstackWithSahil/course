import React from 'react'
import { Module, Video } from './Context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ModuleCard({module}:{module:Module}) {
  return (
    <Card>
        <CardHeader>
            <CardTitle className='text-center capitalize text-3xl'>
                {module.name}
            </CardTitle>
        </CardHeader>
        <CardContent>
            {module.videos.map(v =><VideoCard {...v}/>)}
        </CardContent>
    </Card>
  )
}


function VideoCard(v:Video){
    return(
        <Card className='my-2'>
            <CardHeader className='my-2'>
                <CardTitle>
                    lesson-{v.lesson}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className='flex items-center justify-around'>
                    <div>
                        <h1 className="text-center text-2xl font-semibold">Thumbnail</h1>
                        <div className='relative group'> {/* Add group class here */}
                            <Image 
                                src={v.thumbnail} 
                                alt='sahil' 
                                width={16*22} 
                                height={9*22} 
                                className='z-0'
                            />
                            <div className='flex items-center justify-center absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-60 group-hover:z-10 pointer-events-none group-hover:pointer-events-auto transition-all duration-300'> {/* Modified this div */}
                                <Button className='group-hover:z-10 bg-opacity-100'>Preview</Button>
                                <Button className='group-hover:z-10 bg-opacity-100'>Change</Button>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-center text-2xl font-semibold">Video</h1>
                        <Image src={v.thumbnail} alt='sahil' width={16*22} height={9*22}/>
                    </div>
                </div>
                <div>
                    <Label htmlFor='title' className='text-xl'>Title</Label>
                    <Input id='title' value={v.title}/>
                    <Label htmlFor='description' className='text-xl'>Description</Label>
                    <Textarea id='description' value={v.description}/>
                </div>
            </CardContent>
        </Card>
    )
}