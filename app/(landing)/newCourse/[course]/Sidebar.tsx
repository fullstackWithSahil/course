"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCourseContext } from "./Context";

export default function Sidebar() {
  const {state} = useCourseContext();
  return (
    <div>
      <h1 className="text-xl text-center font-bold">Course structure</h1>
      <Accordion type="single" collapsible className="w-full">
        {state.map((iteam,i)=><AccordionItem value={iteam.name}>
          <AccordionTrigger>Module-{i+1}:{iteam.name}</AccordionTrigger>
          <AccordionContent>
            <ol>
                {iteam.videos.map((v,i)=><li>lesson{i+1}:{v.title}</li>)}
            </ol>
          </AccordionContent>
        </AccordionItem>)}
      </Accordion>
    </div>
  );
}
