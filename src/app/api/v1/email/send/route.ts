import { NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { createHash } from "crypto";
import sendEmail from "@/lib/sendEmail";
import validateKeyAndLimit, { isValidAuthResult } from "@/app/api/validatekey";


export async function POST(request: Request){
    try {
        const req = await request.json();
        const redis = Redis.fromEnv();

        //validate the api key, rate limits and check permissions
        const validation = await validateKeyAndLimit(request, "email:send");
        if (!isValidAuthResult(validation)) {
            return validation; // It's a NextResponse (error)
        }
        
        //prevent user from sending multiple emails if they accedently send multiple requests with same body
        const requestHash = createHash('sha256')
            .update(JSON.stringify(req))
            .digest('hex');
        
        const duplicateKey = `${validation.teacher}:email:duplicate:${requestHash}`;
        const existingRequest = await redis.get(duplicateKey);
        if (existingRequest) {
            return new NextResponse(JSON.stringify({
                error: "Duplicate request detected. Please wait before sending the same email again."
            }), { status: 429 });
        }
        await redis.setex(duplicateKey, 10, "sent");
        
        // Check if the daily limit is exceeded (assuming 100 emails per day)
        const dailyUsageKey = `${validation.teacher}:email:daily`;
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