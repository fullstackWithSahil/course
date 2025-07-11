"use client";
import React, { useState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Eye, Reply, Mail, ThumbsUp, Clock } from "lucide-react";
import Comments from "./Comments";
import Views from "./Views";


const VideoEngagementDashboard = () => {
	const [activeTab, setActiveTab] = useState("comments");
	
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
								Comments 10
							</TabsTrigger>
							<TabsTrigger
								value="views"
								className="flex items-center gap-2"
							>
								<Eye className="h-4 w-4" />
								Recent Views 11
							</TabsTrigger>
						</TabsList>

						<Comments />

						<Views />
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
	const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

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
