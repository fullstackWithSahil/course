"use client";
import { MessageType, useChats } from './ChatContext'
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Heart, ThumbsUp, ThumbsDown, Smile } from "lucide-react";


export default function Message(message:MessageType) {
    const {dispatch } = useChats();
    function handleReaction(
        id: number,
        reaction: "heart" | "thumbsUp" | "thumbsDown" | "smile"
      ) {
        dispatch({ type: "add_reaction", payload: { id, reaction } });
      }
    
      const reactions = [
        { type: "heart", Icon: Heart },
        { type: "thumbsUp", Icon: ThumbsUp },
        { type: "thumbsDown", Icon: ThumbsDown },
        { type: "smile", Icon: Smile },
      ] as const;
  return (
    <div key={message.id} className="mb-4">
          <div className="flex items-start space-x-2 border-2 p-1 rounded-sm">
            <Avatar>
              <AvatarImage src={message.profile} alt={message.firstname||""} />
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{message.firstname}</p>
              <p>{message.message}</p>
              <div className="flex space-x-2 mt-2">
                {reactions.map(({ type, Icon }) => (
                  <Button
                    key={type}
                    variant="outline"
                    size="sm"
                    onClick={() => handleReaction(message.id, type)}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {message.reactions[type]}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
  )
}
