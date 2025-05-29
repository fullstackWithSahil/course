"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VideoType } from "./formatter";
import Video from "@/components/Videoplayer";
import { useEffect, useState } from "react";
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import { toast } from "sonner";
import { CommentBlock, CommentType } from "./CommentBlock";
import { useParams } from "next/navigation";

export default function Videocard({id,title,lesson}:VideoType) {

	const {session} = useSession();
	const [comments,setComments] = useState<CommentType[]>([]);
	const [views,setViews] = useState(0);
	const {id:courseId} = useParams();

	useEffect(()=>{
        const supabase = supabaseClient(session);
        supabase
            .from("comments")
            .select("*")
            .eq("video",Number(id))
            .then(({data,error})=>{
                if(error){
                    toast.error("Error fetching comments")
                }else{
                    setComments(data as CommentType[]);
                }
            });
		supabase
			.from("students")
			.select("*")
			.eq("course",Number(courseId))
			.contains("watchedVideos",id).then(({data})=>{
				setViews(data?data.length:0)
			})
    },[id])

	return (
		<Accordion type="single" collapsible key={id}>
			<AccordionItem value="item-1">
				<AccordionTrigger>
					{lesson}-{title}
				</AccordionTrigger>
				<AccordionContent>
					<div className="w-full">
						<Video
							src={
								"https://buisnesstools-course.b-cdn.net/user_2xgDvRU2MqZcHt3qI2rVHtErdFK/139/start/15cd08b9-863d-4f2c-9065-cb2e4e0a6e1a"
							}
						/>
					</div>

					<div className="flex items-center text-lg font-medium text-white my-3 mx-4">
						<p className="px-5 bg-gray-800 opacity-50 border-2 rounded-xl">
							{views} Views
						</p>
						<p className="px-5 bg-gray-800 opacity-50 border-2 rounded-xl">
							{comments.length} Comments
						</p>
					</div>
					<div className="mx-3 border-2 rounded-t-xl">
						<div className="font-medium bg-gray-800 border-2 rounded-t-xl text-white w-full rounded-t-lx text-xl text-center py-2">
                            Comments
                        </div>
						 
						{comments.length>0?comments.map((comment)=><CommentBlock
							key={comment.id}
							comment={comment.comment}
							commented_by={comment.commented_by}
							created_at={comment.created_at}
							id={comment.id}
							likes={comment.likes}
							profile={comment.profile}
							video={comment.video}
							liked_by={comment.liked_by}
						/>):<p className="text-center text-2xl font-bold my-3">No comments yet</p>}
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}