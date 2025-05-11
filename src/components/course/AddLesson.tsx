"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect,useState } from "react";
import MediaUploader from "@/components/course/MediaUploder";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { useCourseContext, Video } from "@/app/(noSidebar)/newCourse/[name]/Context";
import { useVideoStorage, videoActions } from "@/app/(noSidebar)/newCourse/[name]/VideoStorage";

export default function AddLesson({
	modulename,
	moduleLength,
	moduleId,
	video,
	update
}:{
	modulename:string;
	moduleLength:number;
	moduleId:string;
	update:boolean;
	video?:Video;
}) {
    const { dispatch } = useCourseContext();
	const {dispatch:VideoStorageDiapatch} = useVideoStorage();
	const { userId } = useAuth();
	const params = useParams();
	
	const course = params.name; 
	const host = "https://buisnesstools-course.b-cdn.net";
	const [id, setId] = useState("");
	useEffect(() => {
		if (!id) {
			setId(uuidv4());
		}
	}, [id]);
	const key = `${userId}/${course}/${modulename}/${id}`;
    const [uploading, setUploading] = useState(false);

	// Add a reset key to force MediaUploader components to reset
	const [resetCounter, setResetCounter] = useState(0);

	//metadata related to lesson
    const [name, setName] = useState(video?.title || "");
    const [description, setDescription] = useState(video?.description || "");
    const [lesson, setLesson] = useState(video?.lesson || moduleLength);
	
	//image states
    const [image, setImage] = useState<File|null>(null);
    const [_, setImageModal] = useState(false);
    const [imagePreview, setImagePreview] = useState(video?.thumbnail || "");
	
	//video states
    const [videoFile, setVideoFile] = useState<File|null>(null);
    const [__, setVideoModal] = useState(false);
    const [videoPreview, setVideoPreview] = useState(video?.url || "");

	function clearState() {
		if (!update) {
			setName("");
			setDescription("");
			setLesson(moduleLength + 1);
			setImage(null);
			setImageModal(false);
			setImagePreview("");
			setVideoFile(null);
			setVideoModal(false);
			setVideoPreview("");
			// Increment the reset counter to trigger the MediaUploader reset
			setResetCounter(prev => prev + 1);
			setId(uuidv4());
		}
	}
	
	async function addVideo() {
		try {
			if (!videoFile || !image) {
				toast("Please upload a video and an image");
				return;
			}
			if (!name || !description || !lesson) {
				toast("Please fill in all fields");
				return;
			}
			const video = {
				id: key,
				title: name,
				description,
				url: videoPreview,
				thumbnail: `${host}/${key}.webp`,
				lesson
			};
			
			dispatch({type: "ADD_VIDEO", payload: {moduleId, video}});
			clearState();
			const payload = videoActions.addVideo({key, videoFile});
			VideoStorageDiapatch(payload);
		} catch (error) {
			toast("There was an error uploading the video. Please try again later...")
		}
	}

	async function uploadThumbnail() {
		try {
			setUploading(true);
			const reader: any = new FileReader();
			const base64Image = await new Promise((resolve, reject) => {
				reader.onload = () => {
				const base64String = reader.result.split(',')[1];
				resolve(base64String);
				};
				reader.onerror = () => reject(reader.error);
				reader.readAsDataURL(image);
			});
			
			const lambdaResponse = await axios.post('https://xhqbbboit44bex2ipwtqqda55a0sxuho.lambda-url.us-east-1.on.aws/', {
				key: `${key}`,
				imageBase64: base64Image
			});
			setUploading(false);
		} catch (error) {
			toast("There was an error uploading the thumbnail. Please try again later..")
			setUploading(false);
		}
	}

	function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { id, value } = e.target;
		
		// For update mode, dispatch appropriate action based on field
		if (update) {
		  type actionMapType= {
			name: "CHANGE_VIDEO_TITLE",
			description: "CHANGE_VIDEO_DESCRIPTION",
			lesson: "CHANGE_VIDEO_LESSON"
		  };

		  const actionMap: actionMapType = {
			name: "CHANGE_VIDEO_TITLE",
			description: "CHANGE_VIDEO_DESCRIPTION",
			lesson: "CHANGE_VIDEO_LESSON"
		  };
		  
		  const actionType = actionMap[id as "name"|"description"|"lesson"];
		  if (actionType) {
			const payload: any = id === 'name' 
			  ? { title: value, id: video?.id || "" }
			  : id === 'lesson'
				? { lesson: Number(value), id: video?.id || "" }
				: { [id]: value, id: video?.id || "" };
				
			dispatch({
			  type: actionType,
			  payload
			});
		  }
		}
		
		// Set local state based on field
		switch (id) {
		  case "name":
			setName(value);
			break;
		  case "description":
			setDescription(value);
			break;
		  case "lesson":
			setLesson(Number(value));
			break;
		  default:
			break;
		}
	}

	function handleDelete(){
		dispatch({type:"DELETE_VIDEO",payload:{moduleId,videoId:video?.id||""}});
		const payload = videoActions.removeVideo(video?.id||"");
		VideoStorageDiapatch(payload);
	}

	function handleVideoUpload() {
		if (!videoFile) return;
		videoActions.addVideo({key, videoFile});
		setVideoModal(false)
	}
	
	return (
		<Card className="my-5">
			<CardHeader>
				<CardTitle className="text-center font-bold text-3xl">Lesson-{lesson}</CardTitle>
				<div>
					<Label htmlFor="name">Name</Label>
					<Input 
						className="col-span-4" 
						value={name} 
						onChange={(e) => {handleChange(e)}}
						id="name"
						required
					/>
				</div>
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea 
						value={description} 
						onChange={(e) => {handleChange(e)}}
						id="description"
						required
					/>
				</div>
				<div>
				<Label htmlFor="lesson">Lesson</Label>
				<Input
					type="number"
					value={lesson}
					onChange={(e) => {handleChange(e)}}
					required
					id="lesson"
				/>
				</div>
			</CardHeader>
			<CardContent className="flex items-center gap-3">
				<MediaUploader
					type="image"
					file={image}
					setFile={setImage}
					onCancel={() => {}}
					onUpload={uploadThumbnail}
					previewUrl={imagePreview}
					setPreviewUrl={setImagePreview}
					resetKey={resetCounter}
				/>
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
			</CardContent>
			<CardFooter className="flex justify-end">
				{!update?<Button disabled={uploading} onClick={addVideo}>Add Lesson</Button>:<Button  variant={"destructive"} onClick={handleDelete}>Delete</Button>}
			</CardFooter>
		</Card>
	);
}