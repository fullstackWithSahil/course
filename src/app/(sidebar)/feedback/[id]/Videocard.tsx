import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VideoType } from "./formatter";
import Video from "@/components/Videoplayer";

export default function Videocard({id,title}:VideoType) {
	return (
		<Accordion type="single" collapsible key={id}>
			<AccordionItem value="item-1">
				<AccordionTrigger>
					{1}-{title}
				</AccordionTrigger>
				<AccordionContent>
					<Video
						src={
							"https://buisnesstools-course.b-cdn.net/user_2xgDvRU2MqZcHt3qI2rVHtErdFK/139/start/15cd08b9-863d-4f2c-9065-cb2e4e0a6e1a"
						}
					/>
					<div className="mx-3 border-2 rounded-t-xl">
						<div className="font-medium bg-gray-800 border-2 rounded-t-xl text-white w-full rounded-t-lx text-xl text-center py-2">
                            Comments
                        </div>
						{Array(10)
							.fill(0)
							.map((a) => (
								<p key={a}>my name is sahil</p>
							))}
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}
