"use client";
import { useEffect, useRef } from 'react'
import videojs from 'video.js'
import "video.js/dist/video-js.css";

export default function Video({src, className}:{src:string, className?:string}) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const playerRef = useRef<any | null>(null);
    
    useEffect(() => {
        if (!videoRef.current) return;
      
        setTimeout(() => {
          if (!videoRef.current) return;
      
          playerRef.current = videojs(videoRef.current, {
            autoplay: false,
            responsive: true,
            controls: true,
            liveui: false,
            aspectRatio: '16:9', // Add aspect ratio
            fluid: true, // Make the player fluid
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
        }, 0);
      
        return () => {
          if (playerRef.current) {
            playerRef.current.dispose();
          }
        };
      }, [src]);

    return (
      <div data-vjs-player className={`aspect-video ${className || ''}`}>
        <video 
          ref={videoRef} 
          className="video-js vjs-default-skin vjs-big-play-centered w-full h-full"
        />
      </div>
    );
}