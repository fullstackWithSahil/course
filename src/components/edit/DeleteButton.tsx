"use client";

import {
	useVideoStorage,
	videoActions,
} from "@/app/(noSidebar)/edit/[id]/VideoStorage";
import { Button, buttonVariants } from "../ui/button";
import { useCourseContext } from "@/app/(noSidebar)/edit/[id]/Context";
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

export default function DeleteButton({
	moduleId,
	videoId,
	existing = false,
}: {
	moduleId: string;
	videoId: string;
	existing?: boolean;
}) {
	const { dispatch } = useCourseContext();
	const { dispatch: VideoStorageDiapatch } = useVideoStorage();
	function handleDelete() {
		dispatch({ type: "DELETE_VIDEO", payload: { moduleId, videoId } });
		const payload = videoActions.removeVideo(videoId);
		VideoStorageDiapatch(payload);
	}
    if(existing){

        return (
            <AlertDialog>
                <AlertDialogTrigger className={buttonVariants({variant:"destructive"})}>
                    Delete
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            The video once deleted cannot be recovered. Make sure you have a copy of this video before deleting the video.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            className={buttonVariants({variant:"destructive"})} 
                            onClick={handleDelete}
                        >
                            Delete Video
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        );
    }else{
        return(
            <Button variant={"destructive"} onClick={handleDelete}>
                Delete
            </Button>
        )
    }
}
