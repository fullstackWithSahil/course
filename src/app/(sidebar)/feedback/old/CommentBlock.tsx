import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";

export type CommentType = {
	comment: string;
	commented_by: string;
	created_at: string;
	id: number;
	likes: number;
	profile: string;
	video: number;
	liked_by: string[];
};

const comments = [
	{
		id: 51,
		created_at: "2025-07-06T07:45:15.927325+00:00",
		comment: "hi",
		video: 241,
		commented_by: "Sahil",
		profile:
			"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yelJnYWF2YWNKbmdpZVhRMTlidnNtb2I5eDUifQ",
		liked_by: [],
		reply: null,
	},
	{
		id: 52,
		created_at: "2025-07-06T07:45:20.664873+00:00",
		comment: "helll",
		video: 241,
		commented_by: "Sahil",
		profile:
			"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yelJnYWF2YWNKbmdpZVhRMTlidnNtb2I5eDUifQ",
		liked_by: [Array],
		reply: null,
	},
	{
		id: 53,
		created_at: "2025-07-06T07:45:34.994569+00:00",
		comment: "nnn ksks",
		video: 241,
		commented_by: "Sahil",
		profile:
			"https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yelJnYWF2YWNKbmdpZVhRMTlidnNtb2I5eDUifQ",
		liked_by: [],
		reply: 52,
	},
];
export function CommentBlock() {
	return (
		<div>
			{comments.map((comment) => (
				<div
					key={comment.comment}
					className="flex items-center justify-between gap-2 m-3 border-2 border-black dark:border-white dark:bg-gray-800 p-2 rounded-sm"
				>
					<div className="flex items-center gap-2">
						<Avatar>
							<AvatarImage src={comment.profile} alt="@shadcn" />
							<AvatarFallback>CN</AvatarFallback>
						</Avatar>
						<span>{comment.comment}</span>
					</div>
					<div className="cursor-pointer flex items-center gap-2">
						<p>{comment.liked_by.length}</p>
						<Heart className="fill-red-500 dark:fill-white" />
					</div>
				</div>
			))}
		</div>
	);
}
