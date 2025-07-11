"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Clock, Eye, Mail, MessageCircle, Reply, ThumbsUp } from "lucide-react";
import { formatRelativeTime, getInitials } from "./VideoEngagementDashboard ";

const sampleViews = [
	{
		id: 1,
		name: "John Doe",
		email: "john@example.com",
		created_at: "2024-01-15T08:00:00",
		course: 101,
		watchedVideos: [1, 2, 3],
		student: "student1",
		teacher: null,
		note: null,
	},
	{
		id: 2,
		name: "Jane Smith",
		email: "jane@example.com",
		created_at: "2024-01-15T09:30:00",
		course: 101,
		watchedVideos: [1, 4],
		student: "student2",
		teacher: null,
		note: null,
	},
	{
		id: 3,
		name: "Mike Wilson",
		email: "mike@example.com",
		created_at: "2024-01-16T07:45:00",
		course: 102,
		watchedVideos: [1, 2],
		student: "student3",
		teacher: null,
		note: null,
	},
	{
		id: 4,
		name: "Sarah Jones",
		email: "sarah@example.com",
		created_at: "2024-01-16T10:20:00",
		course: 101,
		watchedVideos: [1],
		student: "student4",
		teacher: null,
		note: null,
	},
	{
		id: 5,
		name: "Alex Brown",
		email: "alex@example.com",
		created_at: "2024-01-17T12:15:00",
		course: 103,
		watchedVideos: [1, 2, 3, 4, 5],
		student: "student5",
		teacher: null,
		note: null,
	},
];

export default function Views() {
    const sortedViews =
		sampleViews?.sort(
			(a, b) => new Date(b.created_at) - new Date(a.created_at)
		) || [];

    function handleMessage(id: number, name: string, email: string): void {
        throw new Error("Function not implemented.");
    }

	return (
		<TabsContent value="views" className="space-y-4">
			{sampleViews.length === 0 ? (
				<div className="text-center py-8 text-muted-foreground">
					<Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
					<p>No views yet</p>
				</div>
			) : (
				sortedViews.map((view) => (
					<Card key={view.id} className="p-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center space-x-3">
								<Avatar>
									<AvatarImage
										src={`https://api.dicebear.com/7.x/initials/svg?seed=${view.name}`}
									/>
									<AvatarFallback>
										{getInitials(view.name)}
									</AvatarFallback>
								</Avatar>
								<div>
									<div className="flex items-center gap-2 mb-1">
										<h4 className="font-medium">
											{view.name}
										</h4>
										<Badge
											variant="outline"
											className="text-xs"
										>
											Course {view.course}
										</Badge>
									</div>
									<p className="text-sm text-muted-foreground">
										{view.email}
									</p>
									<div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
										<span className="flex items-center gap-1">
											<Eye className="h-3 w-3" />
											{view.watchedVideos?.length ||
												0}{" "}
											videos watched
										</span>
										<span className="flex items-center gap-1">
											<Clock className="h-3 w-3" />
											{formatRelativeTime(
												view.created_at
											)}
										</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										handleMessage(
											view.id,
											view.name,
											view.email
										)
									}
								>
									<Mail className="h-4 w-4 mr-2" />
									Message
								</Button>
							</div>
						</div>
					</Card>
				))
			)}
		</TabsContent>
	);
}
