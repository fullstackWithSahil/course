"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import supabaseClient from "@/lib/supabase";
import { useAuth } from "@clerk/clerk-react";
import { useSession } from "@clerk/nextjs";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";
  

export default function Newcourse() {
    const [name, setName] = useState("");
    const [desc, setDesc] = useState("");
    const [price, setPrice] = useState<number>();
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [thumbnail, setThumbnail] = useState<any>();

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

    const {session} = useSession();
    const {userId} = useAuth();
    const router = useRouter();
    async function handleClick(){
        try {
            if(!userId) return;
            const supabase = supabaseClient(session);
            const { data: courseExists,error } = await supabase
                .from("courses")
                .select("*")
                .eq("teacher", userId)
                .eq("name", name)
                .single();

            if(courseExists){
                toast("you already have a course with this name")
                return;
            }

            //uploding the thumbnail
            const key = `${userId}/${name}/thumbnail`;
            const reader:any = new FileReader();      
            const base64Image = await new Promise((resolve, reject) => {
                reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
                };
                reader.onerror = () => reject(reader.error);
                reader.readAsDataURL(thumbnail);
            });
            const res =await axios.post('https://xhqbbboit44bex2ipwtqqda55a0sxuho.lambda-url.us-east-1.on.aws/',{
                key: key,
                imageBase64: base64Image
            });
            console.log({res})

            //uploding course metadata
            const { data,error: insertError } = await supabase.from("courses").insert({
                teacher: userId,
                name,
                description: desc,
                thumbnail: `https://buisnesstools-course.b-cdn.net/${key}.webp`,
                price,
            }).select("*").single();

            //handling errors related to uploding the course
            if(error||insertError){
                console.log({error,insertError})
                toast("something went wrong. Try again later...")
            }

            //redirecting them to course uploder
            router.push(`/newCourse/${data?.id}`);
        } catch (error) {
            console.log(error)
            toast("something went wrong. Try again later...")
        }
    }

	return (
		<div>
			<h1 className="text-4xl text-center font-bold">
				Create a new course
			</h1>
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
								onChange={(e) =>
									setPrice(Number(e.target.value))
								}
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
		</div>
	);
}
