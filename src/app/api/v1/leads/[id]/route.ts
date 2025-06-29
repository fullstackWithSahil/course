import { NextRequest, NextResponse } from "next/server";
import { supabaseClient } from "@/lib/server/supabase";
import { Redis } from "@upstash/redis";
import validateKeyAndLimit, { ErrorResponse, isValidAuthResult } from "@/app/api/validatekey";


export async function GET(request:NextRequest,{params}:{params:Promise<{id:string}>}) {
	try {
        //validate the api key, rate limits and check permissions
        const validation = await validateKeyAndLimit(request, "leads:read");
        if (!isValidAuthResult(validation)) {
            return validation; // It's a NextResponse (error)
        }

		//get the date from supabase and send the response
        const supabase = supabaseClient();
		const id = (await params).id;
		const { data, error } = await supabase
			.from("leads")
			.select("*")
			.eq("id", Number(id))
			.eq("teacher", validation.teacher)
			.single();

		if (error) {
			return new NextResponse(JSON.stringify({ error: error.message }), {
				status: 500,
			});
		}

		return new NextResponse(JSON.stringify(data), { status: 200 });
	} catch (error) {
		console.log("error in email send route:", error);
        return new NextResponse(ErrorResponse, { status: 500 });
	}
}

export async function PUT(request: NextRequest,{ params }:{ params: Promise<{ id: string }>}) {
    try {
        //validate the api key, rate limits and check permissions
        const validation = await validateKeyAndLimit(request, "leads:write");
        if (!isValidAuthResult(validation)) {
            return validation; // It's a NextResponse (error)
        }
    
        //update the lead data into the database
        const supabase = supabaseClient();
        const body = await request.json();
        const id = (await params).id;
        const { data, error } = await supabase
            .from("leads")
            .update(body)
            .eq("id",Number(id))
            .eq("teacher", validation.teacher || "")
            .select()
            .single();
    
        if (error) {
            return new NextResponse(JSON.stringify({ error: error.message }), {
                status: 500,
            });
        }
        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.log("error in lead update route:", error);
        return new NextResponse(ErrorResponse, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, {params}:{params:Promise<{id:string}>}) {
    try {
        //validate the api key, rate limits and check permissions
        const validation = await validateKeyAndLimit(request, "leads:delete");
        if (!isValidAuthResult(validation)) {
            return validation; // It's a NextResponse (error)
        }
    
        //delete the lead from the database
        const supabase = supabaseClient();
        const id = (await params).id;
        const { error,data } = await supabase
            .from('leads')
            .delete()
            .eq('id',Number(id))
            .eq('teacher', validation.teacher)
            .select()
            .single();
        if (error) {
            return new NextResponse(JSON.stringify({ error: error.message }), {
                status: 500,
            });
        }
        return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (error) {
        console.log("error in lead delete route:", error);
        return new NextResponse(ErrorResponse, { status: 500 });
    }
}
