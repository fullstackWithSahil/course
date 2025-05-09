import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Wrench } from "lucide-react";
import Maincontent from "./Maincontent";
import Sidebar from "./Sidebar";
import ContextWrapper from "./Context";

export default async function Page({
  params,
}: {
  params: Promise<{ course: string }>
}) {
  const {course} = await params;
  course.replaceAll("%"," ")
  return (
    <ContextWrapper>
      <main className="relative h-screen">
        <Sheet>
          <SheetTrigger asChild>
            <div className="bg-blue-600 dark:bg-black h-8 text-white flex items-center gap-2 cursor-pointer w-screen sm:hidden">
              <Wrench /> <span>Services</span>
            </div>
          </SheetTrigger>
          <SheetContent
            side={"left"}
            className="flex flex-col items-center bg-gradient-to-bl from-blue-200 to-blue-600 dark:from-black dark:to-black"
          >
            <Sidebar />
          </SheetContent>
        </Sheet>
        <section className="bg-gray-300 w-[300px] overflow-y-scroll dark:bg-gray-800 hidden absolute top-0 bottom-0 left-0 md:flex flex-col items-center gap-3 py-2">
          <Sidebar />
        </section>
        <section className="md:w-[calc(100vw-300px)] w-full mt-5 absolute top-0 bottom-0 right-0 overflow-y-scroll">
          <Maincontent course={course} />
        </section>
      </main>
    </ContextWrapper>
  );
}