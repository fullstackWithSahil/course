"use client";

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Module, useCourseContext } from "./Context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import MediaUploader from "@/components/course/MediaUploder";
import { Label } from "@/components/ui/label";
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { videoActions } from "./VideoStorage";
import axios from "axios";
import { toast } from "sonner";

export default function Editor() {
	const { state } = useCourseContext();
	return (
        <div className="h-full overflow-y-scroll">
			{state.map((module) => (
                <div key={module.id} className="m-3 p-3 border-2">
					<h1 className="text-2xl text-center font-bold">
						{module.name}
					</h1>
					<AddLesson module={module} />
				</div>
			))}
		</div>
	);
}

function AddLesson({module}:{module:Module}) {
    const {  dispatch,state } = useCourseContext();
	const {userId} = useAuth();
	const params = useParams();
	
	const course = params.name; 
	const host ="https://buisnesstools-course.b-cdn.net/";
	const id = uuidv4();
	const key =`${host}/${userId}/${course}/${module.name}/${id}`;
    const [uploading, setUploding] = useState(false);

	//metadata related to lesson
    const [name, setname] = useState("");
    const [description, setDescription] = useState("");
    const [lesson, setLesson] = useState(module.videos.length);
	
	//image states
    const [image, setImage] = useState<File|null>(null);
    const [imageModal, setImageModal] = useState(false);
    const [imagePreview, setImagePreview] = useState("");
	
	//video states
    const [videoFile, setVideoFile] = useState<File|null>(null);
    const [videoModal, setVideoModal] = useState(false);
    const [videoPreview, setVideoPreview] = useState("");

	async function addVideo(){
		try {
			if(uploading) return;
			setUploding(true);			
			const video = {
				id: key,
				title:name,
				description,
				url:videoPreview,
				thumbnail:imagePreview,
				lesson
			};
			dispatch({type:"ADD_VIDEO",payload:{moduleId:module.id,video}});
			setUploding(false);
		} catch (error) {
			toast("there was an error uploding the video please try arain later...")
			setUploding(false);
		}
	}

	async function uplodeThumbnail(){
		try {
			const reader:any = new FileReader();
			const base64Image = await new Promise((resolve, reject) => {
				reader.onload = () => {
				const base64String = reader.result.split(',')[1];
				resolve(base64String);
				};
				reader.onerror = () => reject(reader.error);
				reader.readAsDataURL(image);
			});
			
			const lambdaResponse = await axios.post('https://xhqbbboit44bex2ipwtqqda55a0sxuho.lambda-url.us-east-1.on.aws/',{
				key: `${key}/thumbnail`,
				imageBase64: base64Image
			});
		} catch (error) {
			console.log(error)
			toast("there was an error uploding the thumbnail please try again later..")
		}
	}

	return (
		<Card>
			<CardHeader>
				<div>
					<Label>Name</Label>
					<Input className="col-span-4" value={name} onChange={(e)=>{setname(e.target.value)}}/>
				</div>
				<div>
					<Label>Description</Label>
					<Textarea value={description} onChange={(e)=>setDescription(e.target.value)}/>
				</div>
				<div>
				<Label>Lesson</Label>
				<Input
					type="number"
					value={lesson}
					onChange={(e) => setLesson(Number(e.target.value))}
				/>
				</div>
			</CardHeader>
			<CardContent className="flex items-center gap-3">
				<MediaUploader
					type="image"
					file={image}
					setFile={setImage}
					onCancel={()=>{}}
					onUpload={uplodeThumbnail}
					previewUrl={imagePreview}
					setPreviewUrl={setImagePreview}
					setModalClose={setImageModal}
				/>
				<MediaUploader
					type="video"
					file={videoFile}
					setFile={setVideoFile}
					onCancel={()=>{}}
					// onUpload={()=>{}}
					onUpload={()=>{
						if(!videoFile) return;
						console.log("uploding")
						videoActions.addVideo({key,videoFile});
						setVideoModal(false)
					}}
					previewUrl={videoPreview}
					setPreviewUrl={setVideoPreview}
					setModalClose={setVideoModal}
				/>
			</CardContent>
			<CardFooter className="flex justify-end">
				<Button disabled={uploading} onClick={addVideo}>Add Video</Button>
			</CardFooter>
		</Card>
	);
}
