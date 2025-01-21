"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useChats } from "./ChatContext";
import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { RealtimeChannel} from '@supabase/supabase-js';
import supabaseClient from "@/lib/supabase";
import { getMessages } from "@/app/actions/messsages";
import Message from "./Message";

export default function Chats() {
  const { messages, dispatch } = useChats();
  const { getToken} = useAuth();
  const channels = useRef<RealtimeChannel|null>(null)
  useEffect(()=>{
    getToken().then(async(token)=>{
      const supabase = supabaseClient(token);

      //get the existing messages
      const data = await getMessages();
      dispatch({type:"add_many",payload:data as any});
      
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
      {messages.map((message) =><Message {...message}/>)}
    </ScrollArea>
  );
}