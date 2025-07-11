"use client";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { useSession } from "@clerk/nextjs";
import supabaseClient from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatting,Module } from "./formatter";
import Videocard from "./Videocard";

export default function page() {
    const {session} = useSession();
    const {id} = useParams();
    const [blocks, setBlocks] = useState<Module[]>([]);
    useEffect(()=>{
        const supabase = supabaseClient(session);
        supabase.from("videos").select("*").eq("course",Number(id)).then(({data}) => {
            const bloc = formatting(data);
            console.log({data, bloc});
            setBlocks(bloc);
        })
    },[session])
    return (
        <div>
            <h1 className="text-center text-5xl font-bold">Modules</h1>
			<div className="w-full mb-32">
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
									<Videocard 
                                        key={video.id}
                                        id={Number(video.id)}
                                        thumbnail={video.thumbnail}
                                        title={video.title}
                                        description={video.description}
                                        url={video.url}
                                        createdAt={video.createdAt}
                                        lesson={video.lesson}
                                    />
								))}
							</AccordionContent>
						</AccordionItem>
					))}
				</Accordion>
			</div>
		</div>
    )
}
