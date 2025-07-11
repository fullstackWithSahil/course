import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { supabaseClient } from "@/lib/server/supabase";
import Link from "next/link";

export default async function Feedbackcard({
    name,
    thumbnail,
    description,
    id,
}:{
    name:string;
    thumbnail?:string;
    description:string;
    id:number;
}) {
    const supabase = supabaseClient();
    const {data:videos} = await supabase.from("videos").select("id").eq("course", id);
    const {data:students} = await supabase.from("students").select("id").eq("course", id);
    const ids = videos?.map(video => video.id) || [];
    const {data:comments} = await supabase.from("comments").select("id").in("video", ids);
	return (
		<Card className="m-5">
			<CardHeader>
				<CardTitle>{name}</CardTitle>
			</CardHeader>
			<CardContent className="flex items-center">
				<img
					src={thumbnail || ""}
					alt="course image"
					className="w-1/2"
				/>
				<div className="flex flex-col items-center w-1/2">
					<p className="text-justify text-sm mx-2">
						{description}
					</p>
					<div className="flex items-center justify-around gap-4">
						<p className="text-lg font-bold text-gray-400">
							Videos:{videos?.length || 0}
						</p>
						<p className="text-lg font-bold text-gray-400">
							Students:{students?.length || 0}
						</p>
						<p className="text-lg font-bold text-gray-400">
							Comments:{comments?.length || 0}
						</p>
					</div>
					<Link
						className={buttonVariants()}
						href={`/feedback/${id}`}
					>
						See feedback
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
