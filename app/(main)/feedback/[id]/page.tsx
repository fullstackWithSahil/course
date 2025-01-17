import { createClient } from "@/lib/server/supabase";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import React from "react";
import logo from "@/assets/sample.png";
import ReadComments from "./ReadComments";

export default async function page({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const user = await currentUser();
    if (!user) {
        return <p>you are not autherized to see this page</p>;
    }
    const { data } = await supabase
        .from("videos")
        .select("*")
        .eq("course",params.id);

    return (
        <div>
            {!data?<p>You have not uploded any videos to this course</p>:data.map(video=>(
                <div className="m-3 p-3 border-2 rounded-xl grid grid-cols-3 grid-rows-2" key={video.id}>
                    <Image src={logo} alt="logo" className="col-span-1 row-span-2"/>
                    <div className="col-span-2 row-span-2 p-3">
                        <p className="text-xl font-bold">
                            video title:{video.title}
                        </p>
                        <p className="text-xl font-bold">
                            modlue:{video.module}
                        </p>
                        <p className="text-xl font-bold">
                            lesson:{video.lesson?.toString()}
                        </p>
                    </div>
                    <ReadComments id={video.id}/>
                </div>
            ))}
        </div>
    );
}
