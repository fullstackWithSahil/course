"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import supabaseClient from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

type commentType = {
    comment: string | null;
    commented_by: string | null;
    created_at: string;
    id: number;
    likes: number | null;
    profile: string | null;
    video: number | null;
}[];

export default function ReadComments({id}:{id:number}) {
    const [comments,setComments] = useState<commentType|null>(null);
    const [clicked,setClicked] = useState(false);
    const {getToken} = useAuth();
    useEffect(()=>{
        async function getComments(){
            const token = getToken({template:"supabase"});
            const supabase = supabaseClient(token);
            const res= await supabase
                .from("comments")
                .select("*")
                .eq("video",id);
            setComments(res.data);
        }
        if(clicked){
            getComments();
        }
    },[clicked])
  return (
    <Accordion type="single" collapsible className="w-full col-span-3">
        <AccordionItem value="item-1">
            <AccordionTrigger className="text-center text-2xl font-medium" onClick={()=>setClicked(true)}>
                Read comments
            </AccordionTrigger>
            <AccordionContent>
                {!comments?<p>You dont have ant comments on this video yet</p>:comments.map(comment=>(
                    <div key={comment.id}>
                        {comment.comment}
                    </div>
                ))}
            </AccordionContent>
        </AccordionItem>
    </Accordion>
  )
}
