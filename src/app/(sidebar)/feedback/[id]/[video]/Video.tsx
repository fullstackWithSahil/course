"use client";
import Video from "@/components/Videoplayer";
import { useEffect, useState } from "react";

export default function Videoplayer({src}:{src: string}){
    const [clientSide, setClientSide] = useState(false);
    useEffect(()=>{
        setClientSide(true);
    },[]);
    if(!clientSide) return null;
    return (
        <div className="w-full aspect-video px-5">
            {/* <Video src={src}/> */}
        </div>
    )
}
