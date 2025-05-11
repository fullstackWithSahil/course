"use client";
import { State } from "@/app/(noSidebar)/newCourse/[name]/Context";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";

export default function Structure({
	context,
}: {
	context: () => { state: State };
}) {
	const { state } = context();
	return (
		<div className="w-1/4 bg-gray-300 h-full">
			<h1 className="text-xl text-center font-bold">Course structure</h1>
			<Accordion type="single" collapsible className="w-full">
				{state.map((iteam, i) => (
					<AccordionItem key={iteam.id} value={iteam.name}>
						<AccordionTrigger>
							Module-{i + 1}:{iteam.name}
						</AccordionTrigger>
						<AccordionContent>
							<ol>
								{iteam.videos.map((v) => (
									<li key={v.id}>
										lesson{v.lesson}:{v.title}
									</li>
								))}
							</ol>
						</AccordionContent>
					</AccordionItem>
				))}
			</Accordion>
		</div>
	);
}
