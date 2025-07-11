"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import { Eye, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type propType = {
	id: number;
	title: string;
	description: string;
	url: string;
	thumbnail: string;
	createdAt: string;
	lesson: number;
};

export default function Videocard(props: propType) {
    const {session} = useSession();
    const {id} = useParams();
    const [views,setViews] = useState(0);
    const [comments,setComments] = useState(0);
    useEffect(()=>{
        const supabase = supabaseClient(session);
        supabase.from("comments").select("*").eq("video",props.id).then(({data}) => {
            setComments(data?.length || 0);
        })
        supabase.from("students").select("*").contains("watchedVideos",[props.id]).then(({data}) => {
            setViews(data?.length || 0);
            console.log({views:data})
        })
    },[])
	return (
		<Card className="m-4 p-4 shadow-md rounded-xl">
			<CardTitle className="mb-2 text-lg md:text-xl font-semibold text-gray-800">
				Lesson {props.lesson} — {props.title}
			</CardTitle>

			<CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
				<img
					src={props.thumbnail}
					alt={props.title}
					className="w-full h-48 md:h-56 object-cover rounded-lg"
				/>

				<div className="flex flex-col justify-between h-full">
					<p className="text-sm text-gray-600 mb-4">
						{props.description}
					</p>

					<div className="flex items-center justify-between text-xs text-gray-500 mb-4">
						<div>
							<span className="mr-4 flex items-center gap-2">
                                <Eye/> {views} views
                            </span>
							<span  className="flex items-center gap-2">
                                <MessageCircle/> {comments} comments
                            </span>
						</div>
						<span>{new Date(props.createdAt).toLocaleDateString()}</span>
					</div>

					<Link 
                        href={`/feedback/${id}/${props.id}`} 
                        className={buttonVariants()}
                    >
                        See More
                    </Link>
				</div>
			</CardContent>
		</Card>
	);
}
