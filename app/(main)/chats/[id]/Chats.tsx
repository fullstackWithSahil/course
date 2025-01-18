"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, ThumbsUp, ThumbsDown, Smile } from "lucide-react";
import { MessageType, useChats } from "./ChatContext";
import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { SupabaseClient } from '@supabase/supabase-js';
import supabaseClient from "@/lib/supabase";

export default function Chats() {
  const { messages, dispatch } = useChats();
  const { getToken, userId } = useAuth();
  const supabaseRef = useRef<SupabaseClient | null>(null);

  function handleReaction(
    id: number,
    reaction: "heart" | "thumbsUp" | "thumbsDown" | "smile"
  ) {
    dispatch({ type: "add_reaction", payload: { id, reaction } });
  }

  useEffect(() => {
    async function fetchChats() {
      try {
        const token = await getToken({ template: "supabase" });
        const supabase = supabaseClient(token);
        
        const { data, error } = await supabase
          .from("messages")
          .select('*')
          .or(`sender.eq.${userId},to.eq.${userId}`);
        console.log({data})

        if (error) throw error;
        
        if (data) {
          dispatch({ type: "add_many", payload: data as any });
        }
      } catch (error) {
        console.error("Error fetching chats:", error);
      }
    }
    
    if (userId) {
      fetchChats();
    }
  }, [getToken, userId, dispatch]);

  useEffect(() => {
    let channel: any;

    async function subscribe() {
      try {
        const token = await getToken({ template: "supabase" });
        const supabase = await supabaseClient(token);
        supabaseRef.current = supabase;

        channel =  supabase.channel("messages").on("postgres_changes",{
          event:"INSERT",
        },(payload:MessageType)=>{
          console.log(payload)
        })
          .subscribe();
      } catch (error) {
        console.error("Error setting up real-time subscription:", error);
      }
    }

    if (userId) {
      subscribe();
    }

    return () => {
      if (supabaseRef.current && channel) {
        supabaseRef.current.removeChannel(channel);
      }
    };
  }, [getToken, dispatch, userId]);

  const reactions = [
    { type: "heart", Icon: Heart },
    { type: "thumbsUp", Icon: ThumbsUp },
    { type: "thumbsDown", Icon: ThumbsDown },
    { type: "smile", Icon: Smile },
  ] as const;

  return (
    <ScrollArea className="h-[400px] pr-4">
      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          <div className="flex items-start space-x-2">
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
      ))}
    </ScrollArea>
  );
}