import { NextRequest } from 'next/server';
import validateKeyAndLimit, { ErrorResponse, isValidAuthResult } from '../../validatekey';
import { supabaseClient } from '@/lib/server/supabase';

export async function GET(request: NextRequest) {
    try {
        //validate the api key, rate limits and check permissions
        const validation = await validateKeyAndLimit(request, "leads:read");
        if (!isValidAuthResult(validation)) {
            return validation; // It's a NextResponse (error)
        }

        //send all the leads in the database
        const supbase = supabaseClient();
        const { data, error } = await supbase
            .from('leads')
            .select('*')
            .eq("teacher",validation.teacher)
            .order('created_at', { ascending: false });
        if (error) {
            return new Response(JSON.stringify({error:"there are no leads in your database"}),{status:500 });
        }
        return new Response(JSON.stringify(data),{ status: 200});
    } catch (error) {
        console.log("error in getting leads route:", error);
        return new Response(ErrorResponse,{ status: 500 });
    }
}

export async function POST(request:NextRequest){
    try {
        //validate the api key, rate limits and check permissions
        const validation = await validateKeyAndLimit(request, "leads:write");
        if (!isValidAuthResult(validation)) {
            return validation; // It's a NextResponse (error)
        }
        
        //add a new lead to the database
        const supbase = supabaseClient();
        const body = await request.json();
        const { data, error } = await supbase
            .from('leads')
            .insert({
                name: body.name,
                email: body.email,
                teacher: validation.teacher,
                source: body.source || "unknown",
                note:body.note
            })
            .select('*')
            .single();
        if (error) {
            return new Response(JSON.stringify({error:"there was an error creating the lead"}),{status:500 });
        }
        return new Response(JSON.stringify(data),{ status: 201});
    } catch (error) {
        console.log("error in creating leads route:", error);
        return new Response(ErrorResponse,{ status: 500 });
    }
}