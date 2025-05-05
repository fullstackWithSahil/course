"use client"
import React, { ReactNode } from 'react'
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import Sidebar from './Sidebar'

export default function layout({children}:{children:ReactNode}) {
  return (
    <main className='h-[95vh] md:flex items-center'>
        <div className='md:hidden'>
            <Sheet>
                <SheetTrigger className='bg-blue-500 w-full text-left text-white font-bold py-2'>
                    Options
                </SheetTrigger>
                <SheetContent side="left" className='pl-5'>
                    <SheetHeader>
                        Options
                    </SheetHeader>
                    <Sidebar/>
                </SheetContent>
            </Sheet>
        </div>
        <section className='w-1/4 h-full mt-5 items-center gap-2 hidden md:flex flex-col'>
            <Sidebar/>
        </section>
        <section className='h-full w-full md:w-3/4'>
            {children}
        </section>
    </main>
  )
}
