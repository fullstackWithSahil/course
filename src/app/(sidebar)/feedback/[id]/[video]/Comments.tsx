"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Clock, Mail, MessageCircle, Reply, ThumbsUp } from "lucide-react";
import { formatRelativeTime, getInitials } from "./VideoEngagementDashboard";

export type CommentType = {
	comment: string | null;
	commented_by: string | null;
	created_at: string;
	id: number;
	liked_by: string[] | null;
	profile: string | null;
	video: number | null;
}[];

export default function Comments({comments}:{comments: CommentType}) {
	function handleReply(id: any, commented_by: any): void {
		throw new Error("Function not implemented.");
	}

	function handleMessage(id: any, commented_by: any, arg2: null): void {
		throw new Error("Function not implemented.");
	}

	return (
		<TabsContent value="comments" className="space-y-4">
			{comments.length === 0 ? (
				<div className="text-center py-8 text-muted-foreground">
					<MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
					<p>No comments yet</p>
				</div>
			) : (
				comments.map((comment) => (
					<Card key={comment.id} className="p-4">
						<div className="flex items-start space-x-3">
							<Avatar>
								<AvatarImage
									src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.commented_by}`}
								/>
								<AvatarFallback>
									{getInitials(comment.commented_by||"O")}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 space-y-2">
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<h4 className="font-medium">
											{comment.commented_by}
										</h4>
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
