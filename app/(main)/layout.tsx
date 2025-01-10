import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Home, MessageCircle, Search, User2, Wrench } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
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
        {children}
      </section>
    </main>
  );
}

const tabs =[
  {
    label:"Home",
    icon: <Home/>,
    href:"/home",
  },{
    label:"Students",
    icon: <User2/>,
    href:"/students",
  },{
    label:"Chats",
    icon: <MessageCircle/>,
    href:"/chats",
  },{
    label:"Feedback",
    icon: <Search/>,
    href:"/settings",
  }
];

function Sidebar() {
  return (
    <>
    {tabs.map((tab,i) =><Link href={tab.href} key={i} className={cn(buttonVariants(),"w-3/4")}>
      {tab.icon}
      {tab.label}
    </Link>)}
    </>
  );
}
