"use server"

import { createClient } from "@/lib/server/supabase";

export async function getMessages(courseId:number,user:string){
    try {
        const supabase = await createClient();
        console.log({user,courseId})
        const { data} = await supabase
            .from("messages")
            .select("*")
            .eq("course",courseId)
            .or(`sender.eq.${user},to.eq.${user}`)
        console.log({data})
        return data;
    } catch (error) {
        console.log("error getting messages",error);
        return "error getting messages"
    }
}