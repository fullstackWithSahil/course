import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart } from "lucide-react";

export type CommentType ={
    comment: string;
    commented_by: string;
    created_at: string;
    id: number;
    likes: number;
    profile: string;
    video: number;
    liked_by: string[];
}

export function CommentBlock(comment:CommentType){
    return(
        <div key={comment.comment} className="flex items-center justify-between gap-2 m-3 border-2 border-black dark:border-white dark:bg-gray-800 p-2 rounded-sm">
            <div className="flex items-center gap-2">
                <Avatar>
                    <AvatarImage src={comment.profile} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>{comment.comment}</span>
            </div>
            <div className="cursor-pointer flex items-center gap-2">
                <p>{comment.liked_by.length}</p>
                <Heart className="fill-red-500 dark:fill-white"/>
            </div>
        </div>
    )
}