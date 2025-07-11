"use client";

import { useCourseContext } from "@/app/(noSidebar)/edit/[id]/Context";
import { Button } from "../ui/button";
import {
	useVideoStorage,
	videoActions,
} from "@/app/(noSidebar)/edit/[id]/VideoStorage";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import API from "@/lib/api";

export default function DeleteButton({
	moduleId,
	videoId,
	existing,
    url,
}: {
	moduleId: string;
	videoId: string;
	existing: boolean;
    url:string;
}) {
	console.log({url})
	const { dispatch } = useCourseContext();
	const { dispatch: VideoStorageDiapatch } = useVideoStorage();
	function handleDelete() {
		dispatch({ type: "DELETE_VIDEO", payload: { moduleId, videoId } });
		const payload = videoActions.removeVideo(videoId);
		VideoStorageDiapatch(payload);
        if(existing){
            API.post("/videos/delete",{
                key:url.replace("https://buisnesstools-course.b-cdn.net/","")
            }).then(({data})=>{
                console.log(data)
            })
        }
	}

	if (existing) {
		return (
			<AlertDialog>
				<AlertDialogTrigger>
                    <Button variant={"destructive"}>
                        Delete
                    </Button>
                </AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							Are you absolutely sure?
						</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This video will be permanently
							deleted from our servers.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		);
	} else {
		return (
			<Button variant={"destructive"} onClick={handleDelete}>
				Delete
			</Button>
		);
	}
}
