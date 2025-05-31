"use client";
import { Dispatch, SetStateAction } from "react";
import Video from "../Videoplayer";
import MediaUploader from "../course/MediaUploder";

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
				<Video
					src={
						"https://buisnesstools-course.b-cdn.net/user_2xgDvRU2MqZcHt3qI2rVHtErdFK/139/start/15cd08b9-863d-4f2c-9065-cb2e4e0a6e1a"
					}
					disabled={true}
				/>
			)}
		</div>
	);
}
