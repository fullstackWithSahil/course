import { NextRequest } from 'next/server';
import validateKeyAndLimit, { ErrorResponse, isValidAuthResult } from '../../validatekey';

export async function GET(request: NextRequest) {
    try {
        //validate the api key, rate limits and check permissions
        const validation = await validateKeyAndLimit(request, "leads:read");
        if (!isValidAuthResult(validation)) {
            return validation; // It's a NextResponse (error)
        }
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
    } catch (error) {
        console.log("error in creating leads route:", error);
        return new Response(ErrorResponse,{ status: 500 });
    }
}