"use server"

import { createClient } from "@/lib/server/supabase";

export async function getMessages(){
    try {
        const supabase = await createClient();
        const {data} = await supabase
            .from("messages")
            .select("*");
        return data;
    } catch (error) {
        console.log("error getting messages",error);
        return "error getting messages"
    }
}