"use client";

import {
	useVideoStorage,
	videoActions,
} from "@/app/(noSidebar)/edit/[id]/VideoStorage";
import { Button, buttonVariants } from "../ui/button";
import { useCourseContext, Video } from "@/app/(noSidebar)/edit/[id]/Context";
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
import { useSession } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabase";
import { toast } from "sonner";
import axios from "axios";

export default function DeleteButton({
	moduleId,
	videoId,
	existing = false,
}: {
	moduleId: string;
	videoId: string;
	existing?: boolean;
}) {
	const { dispatch,state } = useCourseContext();
	const { dispatch: VideoStorageDiapatch } = useVideoStorage();
    const {session} = useSession();

	async function handleDelete() {
        //finding the video in local state
        let videoToDelete = {
            url:"",
            thumbnail:""
        }
        state.forEach((mod) => {
            mod.videos.forEach((vid) => {
                if (vid.id == videoId) {
                    videoToDelete.url = vid.url;
                    videoToDelete.thumbnail =vid.thumbnail
                }
            });
        });

        //updating local state
		dispatch({ type: "DELETE_VIDEO", payload: { moduleId, videoId } });
		const payload = videoActions.removeVideo(videoId);
		VideoStorageDiapatch(payload);

        if(existing){
            if (!videoToDelete) {
                toast("Video not found for deletion.");
                return;
            }
            try {
                //deleting the database record
                const supabase = supabaseClient(session);
                const {error} = await supabase
                    .from("videos")
                    .delete()
                    .eq("id",Number(videoId));
                
                //deleting the video and image files
                await axios.post("http://localhost:8080/api/videos/delete",{
                    thumbnail:videoToDelete.thumbnail,
                    url:videoToDelete.url
                })
                if(error){
                    toast("There was an error deleting the course");
                }
            } catch (error) {
                toast("There was an error deleting the course");
                console.log({error});
            }
        }
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
