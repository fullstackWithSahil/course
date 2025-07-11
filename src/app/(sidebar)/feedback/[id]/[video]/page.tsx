"use client";
import { useParams } from "next/navigation";
import Videoplayer from "./Video";
import VideoEngagementDashboard from "./VideoEngagementDashboard";
import { useEffect, useState } from "react";
import { useSession } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabase";

type VideoType = {
	course: number | null;
	created_at: string;
	description: string | null;
	id: number;
	lesson: number | null;
	module: string | null;
	teacher: string | null;
	thumbnail: string | null;
	title: string | null;
	url: string | null;
} | null;

export default function Page() {
	const { video } = useParams();
	const [data, setData] = useState<VideoType>(null);
	const { session } = useSession();
	useEffect(() => {
		const supabase = supabaseClient(session);
		supabase
			.from("videos")
			.select("*")
			.eq("id", Number(video))
			.single()
			.then(({ data }) => {
				setData(data);
			});
	}, []);
	return (
		<div className="pb-14">
			<h1 className="text-2xl md:text-3xl font-bold m-4">
				{data?.module}/{data?.lesson}-{data?.title}
			</h1>
			<Videoplayer src={data?.url || ""} />
			<VideoEngagementDashboard />
		</div>
	);
}
