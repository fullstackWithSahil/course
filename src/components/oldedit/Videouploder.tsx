"use client";
import { useEffect, useRef } from "react";
import { Dispatch, SetStateAction } from "react";
import MediaUploader from "../course/MediaUploder";
import videojs from "video.js";
import "video.js/dist/video-js.css";

export default function VideoUploader({
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
		if (!exisiting || !videoRef.current) return;

		const videoUrl = `https://buisnesstools-course.b-cdn.net/user_2zRgadsp1IOxkFPdwzeilUtIykt/155/start/7d1490ef-654b-4a7c-ad97-9325b1e071c9/1080/index.m3u8`;
		
		try {
			playerRef.current = videojs(videoRef.current, {
				controls: true,
				autoplay: false,
				preload: 'auto',
				responsive: true,
				fluid: true,
				// Remove the html5 vhs config that might be causing issues
				sources: [
					{
						src: videoUrl,
						type: "application/x-mpegURL",
					},
				],
			});

			playerRef.current.ready(() => {
				console.log('Video.js player ready');
			});

			playerRef.current.on('error', (e: any) => {
				console.error('Video.js error:', e);
			});

			playerRef.current.on('loadstart', () => {
				console.log('Video started loading');
			});

		} catch (error) {
			console.error('Error initializing video.js:', error);
		}

		return () => {
			if (playerRef.current && !playerRef.current.isDisposed()) {
				playerRef.current.dispose();
				playerRef.current = null;
			}
		};
	}, [exisiting]);

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
				<div>
					<video
						ref={videoRef}
						className="video-js vjs-default-skin w-full"
						controls={true}
						preload="auto"
						data-setup="{}"
					/>
				</div>
			)}
		</div>
	);
}