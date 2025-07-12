"use client"
import { buttonVariants } from "@/components/ui/button";
import { 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import sendDiscordMessage from "@/lib/discord";
import { cn } from "@/lib/utils";
import { useUser } from "@clerk/nextjs";
import { Dialog } from "@radix-ui/react-dialog";
import { CodeIcon, Home, Magnet, Mail, MessageCircle, Phone, Quote, Search, Settings, User2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


const tabs = [
  {
    label: "Home",
    icon: <Home />,
    href: "/home",
  },
  {
    label: "Students",
    icon: <User2 />,
    href: "/students",
  },
  {
    label: "Chats",
    icon: <MessageCircle />,
    href: "/chats",
  },
  {
    label: "Feedback",
    icon: <Search />,
    href: "/feedback",
  },
  {
    label:"Leads",
    icon:<Magnet/>,
    href:"/leads"
  },
  {
    label:"Templetes",
    icon:<Mail/>,
    href:"/template"
  },
  {
    label:"Apis",
    icon:<CodeIcon/>,
    href:"/apis"
  },
];

export default function Sidebar() {
    const [phoneNumber,setPhoneNumber] = useState("");
    const [problem,setProblem] = useState("");
    const [name,setName] = useState("");
    const [displayProblems,setDisplayProblems] = useState(false);
    const [displayPhone,setDisplayPhone] = useState(false);
    const user = useUser();


    async function reportAProblem(){
      const message = `someone has reported a problem:
email:${user.user?.primaryEmailAddress}
problem:${problem}
------------------------------------------------------------------`;
      await sendDiscordMessage(message);
      setProblem("");
      setDisplayProblems(false);
    }

    async function requestACall(){
      const message = `someone has requested for a call:
name:${name}
phoneNumber:${phoneNumber}
----------------------------------------------------------`;
      await sendDiscordMessage(message);
      setName("");
      setPhoneNumber("");
      setDisplayPhone(false);
    }

  return (
    <>
      {tabs.map((tab, i) => (
        <Link href={tab.href} key={i} className={cn(buttonVariants(), "w-3/4")}>
          {tab.icon}
          {tab.label}
        </Link>
      ))}
      <Dialog onOpenChange={setDisplayProblems} open={displayProblems}>
        <DialogTrigger asChild>
          <div className={cn(buttonVariants({variant:"destructive"}),"w-3/4")}>
            <Settings />
            Report a problem
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Report a problem</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="col-span-4">
                Problem you are facing
              </Label>
              <Textarea 
                id="username" 
                value={problem} 
                className="col-span-4"
                onChange={e=>setProblem(e.target.value)} 
               />
            </div>
          </div>
          <DialogFooter>
            <div className={buttonVariants()} onClick={reportAProblem}>Submit</div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog onOpenChange={setDisplayPhone} open={displayPhone}>
        <DialogTrigger asChild>
          <div className={cn(buttonVariants({variant:"destructive"}),"w-3/4")}>
            <Phone />
            Request a call
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Request a call</DialogTitle>
            <DialogDescription>
              Add your mobile number and a member will contact you
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Moblie number:
              </Label>
              <Input 
                id="name" 
                value={phoneNumber} 
                className="col-span-3"
                onChange={e=>setPhoneNumber(e.target.value)} 
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                name
              </Label>
              <Input 
                id="username" 
                value={name} 
                className="col-span-3"
                onChange={e=>setName(e.target.value)} 
              />
            </div>
          </div>
          <DialogFooter>
            <div className={buttonVariants()} onClick={requestACall}>Submit</div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}