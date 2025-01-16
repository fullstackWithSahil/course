import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const questions:{title:string;description:string}[] = []

export default function page() {
  return (
    <div className="px-6">
      <h1 className="text-2xl font-bold text-center">
        These are some of the frequently asked questions
      </h1>
        {!questions[0]&&<div className="h-[20vh] my-6 rounded-lg w-full flex items-center justify-center bg-gray-300">
                <p className="text-3xl font-bold text-blue-600">
                    there are no frequently asked questions currently
                </p>
            </div>
        }
      <Accordion type="single" collapsible className="w-full">
        {questions.map((iteam,i)=><AccordionItem 
            key={i}
            value={`item-${i}`}
        >
          <AccordionTrigger className="text-xl font-semibold">{iteam.title}</AccordionTrigger>
          <AccordionContent>
            {iteam.description}
          </AccordionContent>
        </AccordionItem>)}
      </Accordion>
    </div>
  );
}