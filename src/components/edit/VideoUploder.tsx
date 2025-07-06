import React, { Dispatch, SetStateAction, useEffect, useRef } from "react";
import MediaUploader from "../course/MediaUploder";
import videojs from 'video.js';
import 'video.js/dist/video-js.css';

export default function VideoUploder({ 
    existing=false,
    videoFile,
    setVideoFile,
    videoPreview,
    setVideoPreview,
    handleVideoUpload,
    resetCounter,
    videoUrl
}: { 
    existing?: boolean;
    videoFile:File|null;
    setVideoFile:(file: File | null) => void;
    videoPreview:string;
    setVideoPreview:Dispatch<SetStateAction<string>>;
    handleVideoUpload:()=>void;
    resetCounter:number;
    videoUrl:string;
}) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const playerRef = useRef<any>(null);

    useEffect(() => {
        if (existing && videoRef.current) {
            // Small delay to ensure DOM is ready
            const timer = setTimeout(() => {
                try {
                    console.log('Initializing Video.js player...');
                    
                    // Double check element is in DOM
                    if (!videoRef.current || !document.contains(videoRef.current)) {
                        console.error('Video element not found in DOM');
                        return;
                    }
                    
                    // Initialize Video.js player
                    playerRef.current = videojs(videoRef.current, {
                        controls: true,
                        fluid: true,
                        responsive: true,
                        playbackRates: [0.5, 1, 1.25, 1.5, 2],
                        sources: [{
                            src: videoUrl,
                            type: 'application/x-mpegURL'
                        }],
                        html5: {
                            hls: {
                                enableLowInitialPlaylist: true,
                                smoothQualityChange: true
                            }
                        }
                    });

                    // Handle player ready
                    playerRef.current.ready(() => {
                        console.log('Video.js player is ready');
                    });

                    // Handle errors
                    playerRef.current.on('error', (error:any) => {
                        console.error('Video.js player error:', error);
                    });

                } catch (error) {
                    console.error('Error initializing Video.js player:', error);
                }
            }, 100); // 100ms delay

            return () => {
                clearTimeout(timer);
            };
        }
    }, [existing]);

    // Separate cleanup effect
    useEffect(() => {
        return () => {
            if (playerRef.current) {
                try {
                    playerRef.current.dispose();
                    playerRef.current = null;
                } catch (error) {
                    console.error('Error disposing Video.js player:', error);
                }
            }
        };
    }, []);

    if(!existing){
        return (
            <MediaUploader
                type="video"
                file={videoFile}
                setFile={setVideoFile}
                onCancel={() => {}}
                onUpload={handleVideoUpload}
                previewUrl={videoPreview}
                setPreviewUrl={setVideoPreview}
                resetKey={resetCounter}
            />
        );
    }else{
        return (
            <div className="w-full">
                <h3 className="text-lg font-semibold mb-4">Video</h3>
                <div data-vjs-player>
                    <video
                        ref={videoRef}
                        className="video-js vjs-default-skin"
                        preload="auto"
                        width="100%"
                        height="400"
                        data-setup="{}"
                    />
                </div>
            </div>
        )
    }
}