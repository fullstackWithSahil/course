"use client";

import Structure from "@/components/course/Structure";
import AddModule from "./AddModule";
import Editor from "./Editor";
import { useCourseContext } from "./Context";
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import formatter from "./formatter";


export default function Main() {
    const { dispatch } = useCourseContext();
	const { id } = useParams();
	const { session } = useSession();
	
	useEffect(() => {
		const supabase = supabaseClient(session);
		supabase
			.from("videos")
			.select("*")
			.eq("course", Number(id))
			.then(({ data }) => {
				const blocks = formatter(data);
				dispatch({ type: "ADD_EXISTING_MODULES", payload: blocks });
			});
	}, [id,dispatch,session]);
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
