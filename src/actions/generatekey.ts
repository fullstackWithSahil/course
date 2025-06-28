"use server";
import { supabaseClient } from "@/lib/server/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function generateApiKey(name: string, permissions: string[]) {
    try {
        const supabase = supabaseClient();
        const user = await currentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const newKey= {
            name,
            key: `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random()
                .toString(36)
                .substring(2, 15)}`,
            permissions,
            lastUsed: "Never",
            status: "active",
            teacher: user.id,
        };
        const res = await supabase.from("apikeys").insert(newKey).select("*");
        return res.data?.[0] || null;
    } catch (error) {
        console.log("Error generating API key:", error);
    }
}

export async function regenerateApiKeys(id:number){
    try {
        const supabase = supabaseClient();
        const user = await currentUser();
        if (!user) {
            throw new Error("User not authenticated");
        }

        const newKey = `sk_live_${Math.random()
			.toString(36)
			.substring(2, 15)}${Math.random()
			.toString(36)
			.substring(2, 15)}`;
        
        const { error } = await supabase
            .from("apikeys")
            .update({ key: newKey})
            .eq("id", id)
            .select("*");

        if (error) {
            throw error;
        }
        return newKey;
    } catch (error) {
        console.log("Error regenerating API key:", error);
    }
}

export async function deleteApiKey(id: number) {
    try {
        const supabase = supabaseClient();
        const { error } = await supabase
            .from("apikeys")
            .delete()
            .eq("id", id);

        if (error) {
            throw error;
        }
        return id;
    } catch (error) {
        console.log("Error deleting API key:", error);
        return false;
    }
}