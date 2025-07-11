"use client";
import Structure from "@/components/course/Structure";
import { useCourseContext } from "./Context";
import AddModule from "./AddModule";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import formatter from "@/components/edit/formatting";
import Editor from "./Editor";

export default function Main() {
    const {id} = useParams();
    const {session} = useSession();
    const {dispatch} = useCourseContext();
    useEffect(()=>{
        const supabase = supabaseClient(session);
        supabase.from("videos").select("*").eq("course",id as any).then(({data})=>{
            const formated = formatter(data);
            dispatch({type:"ADD_EXISTING_MODULES",payload:formated});
        })
    },[id])
	return (
		<main className="w-full h-[90vh] flex">
			<Structure context={useCourseContext} />
			<div className="w-3/4 h-[90%]">
				<AddModule />
				<Editor />
			</div>
		</main>
	);
}
