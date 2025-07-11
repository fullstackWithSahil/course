import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { supabaseClient } from "@/lib/server/supabase";
import { formatting } from "./formatter";
import Videocard from "./Videocard";

export default async function page({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const supabase = supabaseClient();
	const { id } = await params;
	const { data } = await supabase
		.from("videos")
		.select("*")
		.eq("course", Number(id));

	//formatting the videos
	const blocks = formatting(data)
	return (
		<div>
            <h1 className="text-center text-5xl font-bold">Modules</h1>
			<div className="w-full">
				<Accordion type="multiple">
					{blocks.map((block, i) => (
                        <AccordionItem key={block.id} value={`item-${i}`}>
							<AccordionTrigger>
								<h3 className="text-xl font-bold text-center capitalize">
									{block.name}
								</h3>
							</AccordionTrigger>
							<AccordionContent>
								{block.videos.map((video,i) => (
									// <div>
										
										<Videocard {...video} key={video.id}/>
									// </div>
								))}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
	);
}
