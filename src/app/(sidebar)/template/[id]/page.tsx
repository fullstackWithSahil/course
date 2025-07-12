"use client";
import { Button } from "@/components/ui/button";
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { toast } from "sonner";

export default function Page() {
	const [value, setValue] = useState("");
  const { session } = useSession();
  const {id} =useParams();
  const router = useRouter();

  async function handleSubmit(){
    try {
      const supabase = supabaseClient(session);

      const { error } = await supabase
        .from('templetes')
        .update({ 
          body: value,
          variables:[
            ...value.match(/{{(.*?)}}/g)?.map(v => v.replace(/{{|}}/g, '').trim()) || []
          ]
        })
        .eq('id', Number(id));
      if (error) {
        throw error;
      }
    } catch (error) {
      toast.error("Failed to save template. Please try again.");
      console.error("Error saving template:", error);
    }finally{
      router.back();
    }
  }

  async function handleCancel() {}
	return (
		<div className="mt-5">
			<ReactQuill value={value} onChange={setValue}/>
      <div className="flex justify-end space-x-2 mt-4">
        <Button variant={"destructive"} onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSubmit}>Save</Button>
      </div>
		</div>
	);
}
