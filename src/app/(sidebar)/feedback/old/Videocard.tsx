"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { VideoType } from "./formatter";
import Video from "./Video";
import { CommentBlock} from "./CommentBlock";

export default function Videocard({id,title,lesson}:VideoType) {
	return (
		<Accordion type="single" collapsible key={id}>
			<AccordionItem value="item-1">
				<AccordionTrigger>
					{lesson}-{title}
				</AccordionTrigger>
				<AccordionContent>
					<Video />

					<div className="flex items-center text-lg font-medium text-white my-3 mx-4">
						<p className="px-5 bg-gray-800 opacity-50 border-2 rounded-xl">
							{100} Views
						</p>
						<p className="px-5 bg-gray-800 opacity-50 border-2 rounded-xl">
							{10} Comments
						</p>
					</div>
					<div className="mx-3 border-2 rounded-t-xl">
						<div className="font-medium bg-gray-800 border-2 rounded-t-xl text-white w-full rounded-t-lx text-xl text-center py-2">
                            Comments
                        </div>
						<CommentBlock />
					</div>
				</AccordionContent>
			</AccordionItem>
		</Accordion>
	);
}