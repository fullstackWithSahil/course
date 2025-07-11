"use client";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Views,{ViewType} from "./Views";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Eye } from "lucide-react";
import Comments, { CommentType } from "./Comments";
import { useEffect, useState } from "react";
import { useSession } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import supabaseClient from "@/lib/supabase";


const VideoEngagementDashboard = () => {
	const [activeTab, setActiveTab] = useState("comments");
	const [comments, setComments] = useState<CommentType>([]);
	const [sortedViews, setSortedViews] = useState<ViewType>([]);
	const { session } = useSession();
	const { video } = useParams();
	useEffect(() => {
		const supabase = supabaseClient(session);
		supabase
			.from("comments")
			.select("*")
			.eq("video", Number(video))
			.then(({ data }) => {
				const sortedComments =
					data?.sort(
						(a, b) =>
							new Date(b.created_at).getTime() -
							new Date(a.created_at).getTime()
					) || [];
				setComments(sortedComments);
				console.log({ data });
			});
		supabase
			.from("students")
			.select("*")
			.contains("watchedVideos", [Number(video)])
			.then(({ data }) => {
				const sortedViews =
					data?.sort(
						(a, b) =>
							new Date(b.created_at).getTime() -
							new Date(a.created_at).getTime()
					) || [];
				setSortedViews(sortedViews);
				console.log({ sortedViews });
			});
	}, []);
	
	
	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<MessageCircle className="h-5 w-5" />
						Video Engagement
					</CardTitle>
					<CardDescription>
						Recent comments and views for this video
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger
								value="comments"
								className="flex items-center gap-2"
							>
								<MessageCircle className="h-4 w-4" />
								Comments {comments.length}
							</TabsTrigger>
							<TabsTrigger
								value="views"
								className="flex items-center gap-2"
							>
								<Eye className="h-4 w-4" />
								Recent Views {sortedViews.length}
							</TabsTrigger>
						</TabsList>
						<Comments comments={comments}/>
						<Views sortedViews={sortedViews}/>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	);
};

export default VideoEngagementDashboard;

export const formatRelativeTime = (dateString:string) => {
	const now = new Date();
	const date = new Date(dateString);
	const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

	if (diffInHours < 1) return "Just now";
	if (diffInHours < 24) return `${diffInHours}h ago`;
	if (diffInHours < 48) return "Yesterday";
	return date.toLocaleDateString();
};

export const getInitials = (name:string) => {
	if (!name) return "?";
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase();
};
