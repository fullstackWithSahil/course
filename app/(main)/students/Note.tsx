"use client";

import supabaseClient from "@/lib/supabase";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function Note({ note, id }: { note: string; id: number }) {
  const [newNote, setNewNote] = useState(note == "add a note" ? "" : note);
  const [open, setOpen] = useState(false);
  const { getToken } = useAuth();
  
  async function handleClick() {
    const token = await getToken({ template: "supabase" });
    const supabase = supabaseClient(token);

    const res = await supabase
      .from("students")
      .update({ note: newNote })
      .eq("id", id)
      .select();

    console.log({ res, newNote, id });
    setOpen(false);
    setNewNote("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className="cursor-pointer">
        <p className="text-blue-500">{note}</p>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a note</DialogTitle>
        </DialogHeader>
        <Textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
        />
        <DialogFooter>
          <Button type="submit" onClick={handleClick}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}