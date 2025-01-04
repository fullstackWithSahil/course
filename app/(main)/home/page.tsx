import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <h1 className="text-4xl text-center font-bold">Create a new course</h1>
      <Link href={"/newCourse"}>
        <div className="h-24 cursor-pointer w-4/5 border-2 rounded-lg flex items-center justify-center mx-[auto]">
          <PlusCircle/>
        </div>
      </Link>
    </>
  );
}
