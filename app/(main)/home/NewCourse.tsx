"use client";
import { PlusCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import { useAuth, useSession } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { toast } from "sonner";
import supabaseClient from "@/lib/supabase";

export default function NewCourse() {
  const { userId } = useAuth();
  const {session} = useSession();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<any>();
  const router = useRouter();
  
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setThumbnail(file);
      };
      reader.readAsDataURL(file);
    }
  };

  async function handleClick() {
    if (!userId) throw new Error("User ID is undefined");
    const key = `${userId}/${name}/thumbnail.webp`;
    const supabase = supabaseClient(session);
    try {
      // Check if course already exists
      const { data: courseExists } = await supabase
        .from("courses")
        .select("*")
        .eq("teacher", userId)
        .eq("name", name)
        .single();

      if (courseExists) {
        toast("You already have a course with this name. Please choose a different name.");
        return; // Stop execution if course exists
      }

      // Upload thumbnail
      const formData = new FormData();
      formData.append('file', thumbnail);
      formData.append('key',key);
      const {data,error} = await supabase.functions.invoke("imageResizing",{body:formData});
      console.log({data})

      // Insert course details
      const { error: insertError } = await supabase.from("courses").insert({
        teacher: userId,
        name,
        description: desc,
        thumbnail: "https://buisnesstools-course.b-cdn.net/"+key,
        price,
      });

      // Handle insert error
      if (error||insertError) {
        console.error({insertError});
        toast("Error creating the course");
        return;
      }

      // Redirect on success
      router.push(`/newCourse/${name}`);
    } catch (error) {
      console.error(error);
      toast("There was an error creating a course. Try again later.");
    }
  }

  return (
    <section>
      <h1 className="text-4xl text-center font-bold">Create a new course</h1>
      <Dialog>
        <DialogTrigger asChild>
          <div className="h-24 cursor-pointer w-4/5 border-2 rounded-lg flex items-center justify-center mx-[auto]">
            <PlusCircle />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a new Course</DialogTitle>
          </DialogHeader>
          <div>
            <form>
              <Label htmlFor="name">Course Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <div className="space-y-2">
                <Label htmlFor="picture">Thumbnail</Label>
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e)}
                />
                {imagePreview && (
                  <div className="w-24 h-24 relative overflow-hidden rounded-md flex-shrink-0">
                    <Image
                      src={imagePreview}
                      alt="Image Preview"
                      className="aspect-video bg-cover"
                      width={16 * 15}
                      height={9 * 15}
                    />
                  </div>
                )}
              </div>
            </form>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleClick}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
