"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
} from "lucide-react";
import { useChats } from "./ChatContext";

export default function Chats() {
  const { messages, dispatch } = useChats();
  function handleReaction(
    id: number,
    reaction: "heart" | "thumbsUp" | "thumbsDown" | "smile"
  ){
    dispatch({type:"add_reaction",payload:{id,reaction}})
  }

  return (
    <ScrollArea className="h-[400px] pr-4">
      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          <div className="flex items-start space-x-2">
            <Avatar>
              <AvatarImage
                src={message.profile}
              />
              <AvatarFallback>{message.user[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{message.user}</p>
              <p>{message.content}</p>
              {message.image && (
                <img
                  src={message.image || "/placeholder.svg"}
                  alt="Uploaded content"
                  className="mt-2 max-w-full h-auto rounded"
                />
              )}
              <div className="flex space-x-2 mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReaction(message.id, "heart")}
                >
                  <Heart className="h-4 w-4 mr-1" /> {message.reactions.heart}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReaction(message.id, "thumbsUp")}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />{" "}
                  {message.reactions.thumbsUp}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReaction(message.id, "thumbsDown")}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />{" "}
                  {message.reactions.thumbsDown}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleReaction(message.id, "smile")}
                >
                  <Smile className="h-4 w-4 mr-1" /> {message.reactions.smile}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
}
