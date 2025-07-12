"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { Clock, Eye } from "lucide-react";
import { formatRelativeTime, getInitials } from "./VideoEngagementDashboard";
import Messagebutton from "./Messagebutton";

export type ViewType = {
	course: number | null;
	created_at: string;
	email: string | null;
	id: number;
	name: string | null;
	note: string | null;
	student: string | null;
	teacher: string | null;
	watchedVideos: number[] | null;
}[];

export default function Views({sortedViews}:{sortedViews: ViewType}) {
	return (
		<TabsContent value="views" className="space-y-4">
			{sortedViews.length === 0 ? (
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
										{getInitials(view.name||"O")}
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
							<Messagebutton senderId={view.student||""}/>
						</div>
					</Card>
				))
			)}
		</TabsContent>
	);
}
