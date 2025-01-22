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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import supabaseClient from "@/lib/supabase";

export default function NewCourse() {
  const { userId, getToken } = useAuth();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<any>();
  const { toast } = useToast();
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
    const key = `${userId}/${name}/thumbnail.png`;
    const token = await getToken({ template: "supabase" });
    if (!token) throw new Error("Failed to retrieve token");
    const supabase = await supabaseClient(token);
    try {
      // Insert course details
      const { error: insertError } = await supabase.from("courses").insert({
        teacher: userId,
        name,
        description: desc,
        thumbnail: "syd.storage.bunnycdn.com/"+key,
        price,
      });

      // Handle insert error
      if (insertError) {
        console.error(insertError);
        toast({ title: "Error creating the course" });
        return;
      }

      // Upload thumbnail
      const { error: uploadError } = await supabase.storage
        .from("thumbnails")
        .upload(key, thumbnail);

      // Handle upload error
      if (uploadError) {
        console.error(uploadError);
        toast({ title: "Error uploading thumbnail" });
        return;
      }

      // Redirect on success
      router.push(`/newCourse/${name}`);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error creating a course",
        description: "There was an error creating a course. Try again later.",
      });
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
