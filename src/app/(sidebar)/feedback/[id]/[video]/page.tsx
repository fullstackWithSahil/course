"use client";
import { useParams } from "next/navigation";
import Videoplayer from "./Video";
import VideoEngagementDashboard from "./VideoEngagementDashboard";
import { useEffect, useState } from "react";
import { useSession } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabase";
import { Card } from "@/components/ui/card";

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
		<div>
			<h1 className="text-2xl md:text-3xl font-bold m-4">
				{data?.module}/{data?.lesson}-{data?.title}
			</h1>
			<Videoplayer src={data?.url || ""} />
			<VideoEngagementDashboard />
			<Card className="mt-6 mx-4 p-6 md:p-8 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center mb-36">
				<p className="text-xl md:text-2xl font-semibold">
					🚀 More analytics will be added soon.
				</p>
			</Card>
		</div>
	);
}
