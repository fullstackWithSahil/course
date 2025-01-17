"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Heart,
  ThumbsUp,
  ThumbsDown,
  Smile,
} from "lucide-react";
import { MessageType, useChats } from "./ChatContext";
import { useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabase";

export default function Chats() {
  const { messages, dispatch } = useChats();
  function handleReaction(
    id: number,
    reaction: "heart" | "thumbsUp" | "thumbsDown" | "smile"
  ){
    dispatch({type:"add_reaction",payload:{id,reaction}})
  }

  const {getToken,userId} = useAuth();
  //useeffect to fetch initial messages
  useEffect(()=>{
    async function fetchChats(){
      const token = await getToken({template:"supabase"});
      const supabase = await supabaseClient(token);
      const {data}= await supabase
        .from("messages")
        .select("*")
        .eq("sender",userId!)
        .eq("to",userId!);
      if(!data) return;
      dispatch({type:"add_many",payload:data as any});
    }
    fetchChats();
  },[])

  useEffect(()=>{
    let channel: any;
    let supabase: any;
    async function subscribe(){
      const token = await getToken({template:"supabase"});
      supabase = await supabaseClient(token);
      channel = supabase.channel("incomingMessages").on("postgres_changes",{
        event:"INSERT",schema:"public",table:"messages"
      },(payload:MessageType)=>{
        console.log({payload});
        dispatch({type:"add_message",payload})
      }).subscribe();
    }
    subscribe();
    return ()=> supabase.removeChannel(channel)
  },[])

  return (
    <ScrollArea className="h-[400px] pr-4">
      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          <div className="flex items-start space-x-2">
            <Avatar>
              <AvatarImage
                src={message.profile}
              />
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold">{message.firstname}</p>
              <p>{message.message}</p>
              {/* {message.image && (
                <img
                  src={message.image || "/placeholder.svg"}
                  alt="Uploaded content"
                  className="mt-2 max-w-full h-auto rounded"
                />
              )} */}
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
