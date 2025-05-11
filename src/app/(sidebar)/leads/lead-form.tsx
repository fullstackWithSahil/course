"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { LeadType } from "./columns";
import { toast } from "sonner";
import supabaseClient from "@/lib/supabase";
import { useSession } from "@clerk/nextjs";

interface LeadFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead?: LeadType;
}

export function LeadForm({ open, onOpenChange, lead }: LeadFormProps) {
  const isEditing = !!lead;
  const router = useRouter();
  const {session} = useSession();

  // Form state
  const [formData, setFormData] = useState<Partial<LeadType>>(
    lead ? { ...lead } : {
      name: "",
      email: "",
      source: "",
      note: ""
    }
  );
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when dialog opens/closes or when lead changes
  useState(() => {
    if (lead) {
      setFormData({ ...lead });
    } else {
      setFormData({
        name: "",
        email: "",
        source: "",
        note: ""
      });
    }
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSourceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, source: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = supabaseClient(session);
      const {error} = await supabase
        .from("leads")
        .insert({...formData,teacher: session?.user.id})
      if (error) {
        toast("There was a problem saving the lead. Please try again.");
      }
      toast(isEditing 
          ? "The lead has been successfully updated." 
          : "A new lead has been created.",
      );
      
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error("Error saving lead:", error);
      toast("There was a problem saving the lead. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Lead" : "Add New Lead"}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? "Update the lead's information below."
                : "Fill in the details to create a new lead."}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email || ""}
                onChange={handleChange}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="source">Source</Label>
              <Select 
                value={formData.source || ""} 
                onValueChange={handleSourceChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select lead source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="referral">Referral</SelectItem>
                  <SelectItem value="social_media">Social Media</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="note">Note</Label>
              <Textarea
                id="note"
                name="note"
                placeholder="Add notes about this lead..."
                rows={4}
                value={formData.note || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : isEditing ? "Update Lead" : "Add Lead"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}