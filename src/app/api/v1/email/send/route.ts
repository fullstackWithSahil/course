import { supabaseClient } from "@/lib/server/supabase";
import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";
import sendEmail from "@/lib/sendEmail";

export async function POST(request: Request){
    try {
        const req = await request.json();
        const redis = Redis.fromEnv();

        //get the api key from the request headers
        const apiKey = request.headers.get("authorization");
        if (!apiKey || !apiKey.startsWith("Bearer ")) {
            return new NextResponse(JSON.stringify({
                error: "API key is missing or invalid"
            }), { status: 401 });
        }

        //check if the api key is valid
        const supabase = supabaseClient();
        const {data:apiKeyData,error} = await supabase
            .from("apikeys")
            .select("*")
            .eq("key", apiKey.replace("Bearer ", ""))
            .single();
        if (error || !apiKeyData) {
            return new NextResponse(JSON.stringify({
                error: "Invalid API key"
            }), { status: 401 });
        }

        //check if the API key has the required permissions
        if (!apiKeyData.permissions.includes("email:send")) {
            return new NextResponse(JSON.stringify({
                error: "API key does not have permission to send emails"
            }), { status: 403 });
        }

        //ckeck if the rate limit is exceeded
        const reatLimitKey = `${apiKeyData.teacher}:email:send:limit`;
        const ratelimit = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(10, "10 s"),
        });
        const { success } = await ratelimit.limit(reatLimitKey);
        if (!success) {
            return new NextResponse(JSON.stringify({
                error: "Rate limit exceeded. Please try again later."
            }), { status: 429 });
        }

        //prevent user from sending multiple emails if they accedently send multiple requests with same body
        const requestHash = createHash('sha256')
            .update(JSON.stringify(req))
            .digest('hex');
        
        const duplicateKey = `${apiKeyData.teacher}:email:duplicate:${requestHash}`;
        const existingRequest = await redis.get(duplicateKey);
        if (existingRequest) {
            return new NextResponse(JSON.stringify({
                error: "Duplicate request detected. Please wait before sending the same email again."
            }), { status: 429 });
        }
        await redis.setex(duplicateKey, 60, "sent");
        
        // Check if the daily limit is exceeded (assuming 100 emails per day)
        const dailyUsageKey = `${apiKeyData.teacher}:email:daily`;
        const dailyRatelimit = new Ratelimit({
            redis,
            limiter: Ratelimit.slidingWindow(100, "1 d"),
        });
        const { success: dailySuccess } = await dailyRatelimit.limit(dailyUsageKey);
        if (!dailySuccess) {
            return new NextResponse(JSON.stringify({
                error: "Daily email limit exceeded. Please try again tomorrow."
            }), { status: 429 });
        }

        //send the email using a third-party service like SendGrid, Nodemailer, etc.
        await sendEmail({
            to:req.to,
            from: req.from || "",
            subject: req.subject || "No Subject",
            body: req.body || "No content provided",
        })

        //send a success response
        return new NextResponse(JSON.stringify({
            message: "Email sent successfully",
            req:request.headers,
        }),{status: 200});
    } catch (error) {
        console.log("error in email send route:", error);
    }
}