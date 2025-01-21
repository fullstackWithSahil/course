"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useChats } from "./ChatContext";
import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { RealtimeChannel} from '@supabase/supabase-js';
import supabaseClient from "@/lib/supabase";
import { getMessages } from "@/app/actions/messsages";
import Message from "./Message";
import { useParams } from "next/navigation";

export default function Chats() {
  const { messages, dispatch } = useChats();
  const params = useParams();
  const id = Number(params.id);
  const { getToken,userId} = useAuth();
  const channels = useRef<RealtimeChannel|null>(null);

  useEffect(()=>{
      //get the existing messages
      getMessages(id,userId as string).then((messages)=>{
        if(messages){
          dispatch({type:"add_many",payload:messages as any});
        }
      });
  },[userId])

  useEffect(()=>{
    getToken({template:"supabase"}).then(async(token)=>{
      const supabase = supabaseClient(token);
          //subscribe for inserts
          channels.current = supabase.channel('custom-all-channel')
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'messages' },
            (payload) => {
              dispatch({type:"add_message",payload:payload.new as any})
            }
          )
          .subscribe()
      })
      return ()=>{
        if (channels.current){
          channels.current.unsubscribe();
        }
      }
  },[])

  return (
    <ScrollArea className="h-[400px] pr-4">
      {messages.map((message) =><Message key={message.id} {...message}/>)}
    </ScrollArea>
  );
}