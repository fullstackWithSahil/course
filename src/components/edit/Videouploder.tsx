"use client";

import { useEffect, useRef } from "react";
import { Dispatch, SetStateAction } from "react";
import MediaUploader from "../course/MediaUploder";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function Videouploder({
	exisiting,
	videoFile,
	setVideoFile,
	handleVideoUpload,
	videoPreview,
	setVideoPreview,
	resetCounter,
}: {
	exisiting: boolean;
	videoFile: File | null;
	setVideoFile: Dispatch<SetStateAction<File | null>>;
	handleVideoUpload: () => void;
	videoPreview: string;
	setVideoPreview: Dispatch<SetStateAction<string>>;
	resetCounter: number;
}) {
	const videoRef = useRef<HTMLVideoElement | null>(null);
	const playerRef = useRef<any>(null);

	useEffect(() => {
		if (!videoRef.current) return;
	
		console.log("Initializing Video.js player...");
		
		const videoUrl = `https://buisnesstools-course.b-cdn.net/user_2xgDvRU2MqZcHt3qI2rVHtErdFK/139/start/15cd08b9-863d-4f2c-9065-cb2e4e0a6e1a/1080/index.m3u8`;
		console.log("Video URL:", videoUrl);
	
		playerRef.current = videojs(videoRef.current, {
		  controls: true,
		  autoplay: false,
		  preload: 'metadata',
		  responsive: true,
		  fluid: true,
		  html5: {
			vhs: {
			  overrideNative: true
			}
		  },
		  sources: [
			{
			  src: videoUrl,
			  type: "application/x-mpegURL",
			},
		  ],
		});
	
		return () => {
		  if (playerRef.current) {
			console.log("Disposing Video.js player");
			playerRef.current.dispose();
		  }
		};
	  }, []);

	return (
		<div className="w-full p-3">
			{!exisiting ? (
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
			) : (
				<video
					ref={videoRef}
					className="video-js vjs-big-play-centered w-full h-full"
					controls={true}
					data-setup='{"fluid": true}'
				/>
			)}
		</div>
	);
}
