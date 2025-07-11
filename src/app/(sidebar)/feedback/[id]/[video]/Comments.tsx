"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Clock, Mail, MessageCircle, Reply, ThumbsUp } from "lucide-react";
import { formatRelativeTime, getInitials } from "./VideoEngagementDashboard ";

const sampleComments = [
	{
		id: 1,
		comment:
			"Great explanation of the concept! This really helped me understand the fundamentals.",
		commented_by: "john_doe",
		created_at: "2024-01-15T10:30:00",
		liked_by: ["user1", "user2"],
		profile: "student",
		video: 1,
	},
	{
		id: 2,
		comment:
			"Could you elaborate more on the second part? I'm having trouble with the implementation.",
		commented_by: "jane_smith",
		created_at: "2024-01-15T14:20:00",
		liked_by: ["user3"],
		profile: "student",
		video: 1,
	},
	{
		id: 3,
		comment:
			"This helped me understand the topic better. Thanks for the clear examples!",
		commented_by: "mike_wilson",
		created_at: "2024-01-16T09:15:00",
		liked_by: ["user1", "user4", "user5"],
		profile: "student",
		video: 1,
	},
	{
		id: 4,
		comment:
			"Perfect timing for my exam prep. Really appreciate the detailed walkthrough.",
		commented_by: "sarah_jones",
		created_at: "2024-01-16T16:45:00",
		liked_by: [],
		profile: "student",
		video: 1,
	},
	{
		id: 5,
		comment:
			"The examples were very clear and easy to follow. More videos like this please!",
		commented_by: "alex_brown",
		created_at: "2024-01-17T11:30:00",
		liked_by: ["user2", "user6"],
		profile: "student",
		video: 1,
	},
];

export default function Comments() {
    function handleReply(id: any, commented_by: any): void {
        throw new Error("Function not implemented.");
    }

    function handleMessage(id: any, commented_by: any, arg2: null): void {
        throw new Error("Function not implemented.");
    }

    const sortedComments =
		sampleComments?.sort(
			(a, b) => new Date(b.created_at) - new Date(a.created_at)
		) || [];

	return (
		<TabsContent value="comments" className="space-y-4">
			{sortedComments.length === 0 ? (
				<div className="text-center py-8 text-muted-foreground">
					<MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
					<p>No comments yet</p>
				</div>
			) : (
				sortedComments.map((comment) => (
					<Card key={comment.id} className="p-4">
						<div className="flex items-start space-x-3">
							<Avatar>
								<AvatarImage
									src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.commented_by}`}
								/>
								<AvatarFallback>
									{getInitials(comment.commented_by)}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<h4 className="font-medium">
											{comment.commented_by}
										</h4>
										<Badge
											variant="outline"
											className="text-xs"
										>
											{comment.profile}
										</Badge>
									</div>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Clock className="h-3 w-3" />
										{formatRelativeTime(comment.created_at)}
									</div>
								</div>
								<p className="text-sm leading-relaxed">
									{comment.comment}
								</p>
								<div className="flex items-center justify-between pt-2">
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-2 text-xs"
										>
											<ThumbsUp className="h-3 w-3 mr-1" />
											{comment.liked_by?.length || 0}
										</Button>
									</div>
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-2 text-xs"
											onClick={() =>
												handleReply(
													comment.id,
													comment.commented_by
												)
											}
										>
											<Reply className="h-3 w-3 mr-1" />
											Reply
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="h-8 px-2 text-xs"
											onClick={() =>
												handleMessage(
													comment.id,
													comment.commented_by,
													null
												)
											}
										>
											<Mail className="h-3 w-3 mr-1" />
											Message
										</Button>
									</div>
								</div>
							</div>
						</div>
					</Card>
				))
			)}
		</TabsContent>
	);
}
